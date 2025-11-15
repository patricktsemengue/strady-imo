import React from 'react';
import { supabase } from '../supabaseClient';

export const useAI = ({ user, userPlan, setUserPlan, data, setData, setNotification, typeBienOptions, setTypeBienOptions, setIsCreditModalOpen }) => {
    const [aiInput, setAiInput] = React.useState('');
    const [aiPrompt, setAiPrompt] = React.useState('');
    const [showAiResponseActions, setShowAiResponseActions] = React.useState(false);
    const [aiActions, setAiActions] = React.useState([]);
    const [isApplyingAi, setIsApplyingAi] = React.useState(false);
    const [isAiAssistantModalOpen, setIsAiAssistantModalOpen] = React.useState(false);
    const [geminiResponse, setGeminiResponse] = React.useState('');
    const [isGeminiLoading, setIsGeminiLoading] = React.useState(false);
    const [geminiError, setGeminiError] = React.useState('');

    const checkAiCredits = () => {
        if (!user) {
            // setNotification("Connectez-vous pour utiliser l'assistant IA", 'error'); // Optionally show a notification or open auth modal if user is not logged in
            return false;
        }
        if (userPlan && userPlan.current_ai_credits === -1) return true; // Unlimited credits
        if (userPlan && userPlan.current_ai_credits > 0) return true;
        
        // If user has 0 credits and is logged in, open the credit modal
        if (user && userPlan && userPlan.current_ai_credits === 0) {
            setIsCreditModalOpen(true);
        }
        return false;
    };

    const getAiButtonTooltip = () => {
        if (!user) return "Connectez-vous pour utiliser l'assistant IA";
        if (userPlan && userPlan.current_ai_credits === 0) return "Crédits IA épuisés. Rechargez vos crédits.";
        return "Interroger l'IA";
    };

    const callGeminiAPI = async (systemPrompt, userPrompt, setLoading, setError, setResponse) => {
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const response = await fetch('/.netlify/functions/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt, userPrompt })
            });

            const resultData = await response.json();

            if (!response.ok) {
                throw new Error(resultData.error || `Error: ${response.statusText}`);
            }

            const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setResponse(text);
            } else {
                setError("La réponse de l'API était vide ou malformée.");
            }
        } catch (error) {
            setError(`Une erreur est survenue: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneralQuery = () => {
        const systemPrompt = `Tu es un assistant expert polyvalent dans le domaine de l'immobilier en Belgique. Ton rôle est d'analyser des annonces, des textes ou des questions et de fournir des réponses structurées.
        Tu DOIS répondre au format JSON. Le JSON doit contenir deux clés : "text" (une chaîne de caractères avec ta réponse en markdown) et "actions" (un tableau d'objets).
        Chaque objet action doit avoir: "label" (le texte du bouton), "type" ('UPDATE_FIELD' ou 'NEW_PROMPT'), et "payload" (un objet avec les détails de l'action).
        Pour "UPDATE_FIELD", le payload est {"field": "nomDuChamp", "value": "nouvelleValeur"}.
        Exemple d'action : {"label": "Appliquer loyer de 1100€", "type": "UPDATE_FIELD", "payload": {"field": "loyerEstime", "value": 1100}}.
        
        Instructions pour tes réponses :
        1.  **Extraction de données** : Extrais les champs clés (Prix, Surface, PEB, etc.).
        2.  **Suggestions d'optimisation** : Si tu identifies une opportunité (ex: loyer sous-évalué, travaux rentables), propose une action 'UPDATE_FIELD' correspondante. Par exemple, si le loyer semble bas, propose un bouton pour l'augmenter.
        3.  **Réponse textuelle** : Dans la clé "text", explique ton raisonnement de manière claire.
        4.  **Hors Sujet** : Si la question est hors sujet, le JSON doit être ` + '`{"text": "Je suis désolé, cela sort de mon cadre d\'expertise.", "actions": []}`' + `;`;

        const finalPrompt = `${aiPrompt}\n\nVoici le contexte à analyser (texte ou URL) :\n\n${aiInput}`;

        callGeminiAPI(systemPrompt, finalPrompt, setIsGeminiLoading, setGeminiError, (response) => {
            setGeminiResponse(response);
            if (response) {
                let parsedResponse = { text: response, actions: [] };
                try {
                    parsedResponse = JSON.parse(response);
                } catch {
                    console.warn("AI response was not valid JSON. Treating as plain text.");
                    parsedResponse = { text: response, actions: [] };
                }

                setGeminiResponse(parsedResponse.text);
                setAiActions(parsedResponse.actions || []);

                const isOutOfScopeResponse = /désolé|sort de mon cadre/i.test(parsedResponse.text);
                setShowAiResponseActions(!isOutOfScopeResponse);

                if (!isOutOfScopeResponse && user && userPlan && userPlan.current_ai_credits !== -1) {
                    const newCreditCount = Math.max(0, userPlan.current_ai_credits - 1);

                    setUserPlan(prevPlan => ({
                        ...prevPlan,
                        current_ai_credits: newCreditCount
                    }));

                    const decrementCredits = async () => {
                        const { error } = await supabase
                            .from('user_profile_plans')
                            .update({ current_ai_credits: newCreditCount })
                            .eq('user_id', user.id);
                        if (error) {
                            console.error("Erreur lors de la mise à jour des crédits :", error);
                        }
                    };
                    decrementCredits();
                }
            }
        });
    };

    const handleAiActionClick = (action) => {
        if (action.type === 'UPDATE_FIELD') {
            setData(prevData => ({ ...prevData, [action.payload.field]: action.payload.value }));
            setNotification(`Champ '${action.payload.field}' mis à jour !`, 'success');
        }
    };

    const handleSaveAiResponse = () => {
        setData(prev => ({ ...prev, descriptionBien: (prev.descriptionBien || '') + '\n\n--- Réponse IA ---\n' + geminiResponse }));
        setShowAiResponseActions(false);
        setTimeout(() => setNotification('', ''), 2000);
    };

    const handleIgnoreAiResponse = () => {
        setShowAiResponseActions(false);
    };

    const handleApplyAiResponse = () => {
        setIsApplyingAi(true);

        setTimeout(() => {
            const responseText = geminiResponse;
            let updatedData = {};

            const extract = (regex) => {
                const match = responseText.match(regex);
                return match ? match[1].trim() : null;
            };

            const typeBien = extract(/\*\*Type de bien:\*\*\s*(.*)/i);
            if (typeBien && !typeBienOptions.includes(typeBien)) {
                setTypeBienOptions(prev => [...prev, typeBien]);
            }
            if (typeBien) updatedData.typeBien = typeBien;

            const peb = extract(/\*\*Score PEB:\*\*\s*([A-G]\+?)/i);
            if (peb) updatedData.peb = peb;

            const surface = extract(/\*\*Surface:\*\*\s*(\d+)/i);
            if (surface) updatedData.surface = parseInt(surface, 10);

            const revenuCadastral = extract(/\*\*Revenu Cadastral:\*\*\s*([\d\s.,]+)/i);
            if (revenuCadastral) updatedData.revenuCadastral = parseInt(revenuCadastral.replace(/[.\s€]/g, ''), 10);

            const prixAchatMatch = extract(/\*\*Prix:\*\*.*?((\d{1,3}(?:[.\s]?\d{3})*))[,€]?/i);
            if (prixAchatMatch) updatedData.prixAchat = parseInt(prixAchatMatch.replace(/[.\s]/g, ''), 10);

            const adresse = extract(/\*\*Adresse:\*\*\s*(.*)/i);
            if (adresse) updatedData.ville = adresse;

            const electricite = extract(/\*\*Conformité électrique:\*\*\s*(.*)/i);
            if (electricite) updatedData.electriciteConforme = !/non\s*conforme/i.test(electricite);

            const urbanisme = extract(/\*\*Conformité urbanistique:\*\*\s*(.*)/i);
            if (urbanisme) updatedData.enOrdreUrbanistique = !/non\s*conforme|demande\s*en\s*cours/i.test(urbanisme);

            const loyer = extract(/Revenu locatif actuel\s*:\s*([\d.,]+)€/i);
            if (loyer) updatedData.loyerEstime = parseInt(loyer.replace(/[.,\s]/g, ''), 10);

            let tauxMatch = responseText.match(/Taux(?:.*?)sur\s*25\s*ans\s*:\s*([\d,.]+)%/i);
            
            if (tauxMatch) {
                const tauxExtrait = parseFloat(tauxMatch[1].replace(',', '.'));
                if (!isNaN(tauxExtrait)) {
                    updatedData.tauxCredit = tauxExtrait;
                    updatedData.dureeCredit = 25;
                }
            } else {
                const currentDuree = data.dureeCredit;
                tauxMatch = responseText.match(new RegExp(`Taux(?:.*?)sur\\s*${currentDuree}\\s*ans\\s*:\\s*([\\d,.]+)%`, "i"));
                if (tauxMatch) {
                    const tauxExtrait = parseFloat(tauxMatch[1].replace(',', '.'));
                    if (!isNaN(tauxExtrait)) {
                        updatedData.tauxCredit = tauxExtrait;
                    }
                }
            }

            const renovationCostMatch = extract(/Coût des travaux estimés\s*:\s*([\d.,]+)€/i);
            if (renovationCostMatch) updatedData.coutTravaux = parseInt(renovationCostMatch.replace(/[.,\s]/g, ''), 10);

            const operatingChargesMatch = extract(/Charges d'exploitation estimées\s*:\s*([\d.,]+)€\s*\/mois/i);
            if (operatingChargesMatch) updatedData.chargesMensuelles = parseInt(operatingChargesMatch.replace(/[.,\s]/g, ''), 10);


            if (Object.keys(updatedData).length > 0) {
                setData(prev => ({ ...prev, ...updatedData }));
                setNotification('Les informations ont été appliquées au formulaire !', 'success');
            } else {
                setNotification("Aucune information n'a pu être extraite de la réponse.", 'error');
            }

            setShowAiResponseActions(false);
            setTimeout(() => setNotification('', ''), 2000);
            setIsApplyingAi(false);
        }, 100);
    };

    const resetAI = () => {
        setAiInput('');
        setAiPrompt('');
        setGeminiResponse('');
        setGeminiError('');
        setShowAiResponseActions(false);
    };

    return {
        aiInput,
        setAiInput,
        aiPrompt,
        setAiPrompt,
        showAiResponseActions,
        aiActions,
        isApplyingAi,
        isAiAssistantModalOpen,
        setIsAiAssistantModalOpen,
        geminiResponse,
        isGeminiLoading,
        geminiError,
        handleGeneralQuery,
        handleAiActionClick,
        handleSaveAiResponse,
        handleIgnoreAiResponse,
        handleApplyAiResponse,
        resetAI,
        checkAiCredits,
        getAiButtonTooltip,
    };
};
