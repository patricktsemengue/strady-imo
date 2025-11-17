import { useState } from 'react';

const mandatoryFields = {
    'Adresse': '**Adresse :**',
    'Type de bien': '**Type de bien :**',
    'Prix d\'achat': '**Prix d\'achat :**',
    'Loyer mensuel estimé': '**Loyer mensuel estimé :**',
};

/**
 * Hook personnalisé pour gérer la logique du "mode interviewer" de l'assistant IA.
 * @param {object} params
 * @param {function} params.setConversation - Fonction pour mettre à jour l'état de la conversation.
 * @param {function} params.handleGeneralQuery - Fonction pour lancer une requête à l'IA.
 * @param {Array} params.aiActions - Actions de base de l'IA.
 * @returns {object} - Fonctions et états pour gérer le mode interviewer.
 */
export const useInterviewer = ({ setConversation, handleGeneralQuery, aiActions }) => {
    const [isInterviewerMode, setIsInterviewerMode] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [collectedData, setCollectedData] = useState({});
    const [originalUserPrompt, setOriginalUserPrompt] = useState('');

    const resetInterviewer = () => {
        setIsInterviewerMode(false);
        setMissingFields([]);
        setCollectedData({});
        setOriginalUserPrompt('');
    };

    const processAiResponse = (geminiResponse) => {
        if (isInterviewerMode) {
            const finalAiResponse = {
                sender: 'ai',
                content: geminiResponse,
                actions: [
                    ...aiActions,
                    { type: 'NEW_PROMPT', label: 'Évaluer le projet', payload: 'Évalue ce projet immobilier.' },
                    { type: 'NEW_PROMPT', label: 'Quels sont les points forts ?', payload: 'Quels sont les points forts de ce bien ?' },
                    { type: 'NEW_PROMPT', label: 'Suggère des optimisations.', payload: 'Suggère des optimisations pour ce projet.' },
                ]
            };
            setConversation(prev => [...prev, finalAiResponse]);
            resetInterviewer();
        } else {
            const missing = Object.keys(mandatoryFields).filter(
                key => !geminiResponse.includes(mandatoryFields[key])
            );

            if (missing.length > 0) {
                setIsInterviewerMode(true);
                setMissingFields(missing);
                setConversation(prev => [
                    ...prev,
                    { sender: 'ai', content: geminiResponse },
                    { sender: 'ai', content: `Pour une analyse complète, j'ai besoin de quelques informations supplémentaires. Commençons par: **${missing[0]}** ?` }
                ]);
            } else {
                const completeAiResponse = {
                    sender: 'ai',
                    content: geminiResponse,
                    actions: [
                        ...aiActions,
                        { type: 'NEW_PROMPT', label: 'Évaluer le projet', payload: 'Évalue ce projet immobilier.' },
                        { type: 'NEW_PROMPT', label: 'Quels sont les points forts ?', payload: 'Quels sont les points forts de ce bien ?' },
                        { type: 'NEW_PROMPT', label: 'Suggère des optimisations.', payload: 'Suggère des optimisations pour ce projet.' },
                    ]
                };
                setConversation(prev => [...prev, completeAiResponse]);
            }
        }
    };

    const handleInterviewerResponse = (userInput) => {
        const currentField = missingFields[0];
        const newCollectedData = { ...collectedData, [currentField]: userInput };
        setCollectedData(newCollectedData);

        const remainingFields = missingFields.slice(1);
        setMissingFields(remainingFields);

        if (remainingFields.length > 0) {
            setConversation(prev => [...prev, { sender: 'ai', content: `Parfait. Maintenant, pourriez-vous me donner: **${remainingFields[0]}** ?` }]);
        } else {
            const finalPrompt = `Voici les détails d'un bien immobilier:\n- Description initiale: ${originalUserPrompt}\n` + Object.entries(newCollectedData).map(([key, value]) => `- ${key}: ${value}`).join('\n');
            handleGeneralQuery(finalPrompt);
        }
    };

    return { isInterviewerMode, processAiResponse, handleInterviewerResponse, setOriginalUserPrompt, resetInterviewer };
};