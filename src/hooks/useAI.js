import React from 'react';
import { supabase } from '../supabaseClient';
import systemPrompt from '../models/AiAssistantPersona.md?raw'; // Vite feature to import file as raw text
import { aiService } from '../services/aiService';
import { sanitizeData } from '../utils/sanitize';
import { initialDataState } from './useAnalysis';

/**
 * Deeply merges two objects. It's immutable.
 * @param {object} target - The original object.
 * @param {object} source - The object with new properties to merge.
 * @returns {object} A new object with merged properties.
 */
const deepMerge = (target, source) => {
    const output = { ...target };
    if (target && typeof target === 'object' && source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && key in target) {
                output[key] = deepMerge(target[key], source[key]);
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
};

export const useAI = ({ user, userPlan, setUserPlan, data, setData, setNotification, typeBienOptions, setTypeBienOptions, setIsCreditModalOpen, setIsSaveModalOpen, currentData, calculateAndShowResult, isAnalysisComplete, saveAnalysis }) => {
    const [aiInput, setAiInput] = React.useState('');
    const [aiPrompt, setAiPrompt] = React.useState('');
    const [showAiResponseActions, setShowAiResponseActions] = React.useState(false);
    const [aiActions, setAiActions] = React.useState([]);
    const [isApplyingAi, setIsApplyingAi] = React.useState(false);
    const [hasSavedNote, setHasSavedNote] = React.useState(false);
    const [hasApplied, setHasApplied] = React.useState(false);
    const [isAiAssistantModalOpen, setIsAiAssistantModalOpen] = React.useState(false);
    const [isGeminiLoading, setIsGeminiLoading] = React.useState(false);
    const [geminiError, setGeminiError] = React.useState('');
    const [conversation, setConversation] = React.useState([]);

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

    const handleGeneralQuery = async (conversationHistory, newUserInput) => {
        // Set loading state and clear previous results
        setIsGeminiLoading(true);
        setGeminiError(''); // Clear previous errors
        setConversation(prev => [...prev, { sender: 'user', content: newUserInput.trim() }]);
        setHasApplied(false); // Reset applied state for new query
        setHasSavedNote(false);

        let finalUserInput = newUserInput;
        let taskType = 'QA'; // Default task type

        // URL detection logic
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = newUserInput.match(urlRegex);

        if (urls && urls.length > 0) {
            try {
                console.log("URL détectée. Extraction du contenu...");
                // Call your new Netlify function
                const scrapeResponse = await fetch('/.netlify/functions/url-scraper', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: urls[0] }),
                });

                if (!scrapeResponse.ok) {
                    const errorText = await scrapeResponse.text();
                    let errorMessage = errorText;
                    try {
                        const errorBody = JSON.parse(errorText);
                        errorMessage = errorBody.error || errorText;
                    } catch (e) {
                        // The error is not JSON, so we'll just use the raw text.
                    }
                    throw new Error(errorMessage);
                }

                const scrapedData = await scrapeResponse.json();
                // Prepend the scraped content to the user input for the AI
                finalUserInput = `CONTENU DU SITE WEB: ${scrapedData.content}`;
                taskType = 'EXTRACT_URL'; // Set the task type for the AI
                
            } catch (error) {
                console.error("L'extraction a échoué:", error);
                setGeminiError(`Erreur d'extraction d'URL : ${error.message}`);
                setIsGeminiLoading(false);
                return;
            }
        }

        try {
            const requestPayload = {
                systemPrompt: String(systemPrompt),
                taskType,
                isAnalysisComplete: isAnalysisComplete ? isAnalysisComplete() : false
            };
            const apiResponseText = await aiService.fetchAIResponse(requestPayload, user?.id, currentData, conversationHistory, finalUserInput);
            const { conversationalPart, jsonData, error } = aiService.parseAIResponse(apiResponseText);

            if (error) {
                setGeminiError(error);
                setIsGeminiLoading(false);
                return;
            }

            if (jsonData?.data) {
                const sanitizedUpdate = sanitizeData(jsonData.data, initialDataState);
                setData(prevData => deepMerge(prevData, sanitizedUpdate));
            }
            
            const newAiMessage = {
                sender: 'ai',
                content: conversationalPart,
                actions: jsonData?.suggestedActions || [],
            };
            setConversation(prev => [...prev, newAiMessage]);

            // Note: Credit decrement logic could also be moved to the service if it becomes more complex
            const newCreditCount = userPlan?.current_ai_credits - 1;
            // ... (credit update logic remains here for now)
        } catch (error) {
            setGeminiError(error.message);
        } finally {
            setIsGeminiLoading(false);
        }
    };

    const handleAiActionClick = (action) => {
        if (action.type === 'UPDATE_FIELD') {
            setData(prevData => ({ ...prevData, [action.payload.field]: action.payload.value }));
            setNotification(`Champ '${action.payload.field}' mis à jour !`, 'success');
        }
    };



    const handleSaveAiResponse = () => {
        // Extrait uniquement les sections pertinentes de la réponse de l'IA
        const startIndex = geminiResponse.indexOf('## 1.');
        let relevantText = geminiResponse;
        if (startIndex !== -1) {
            relevantText = geminiResponse.substring(startIndex);
        }

        setData(prev => ({ ...prev, descriptionBien: (prev.descriptionBien || '') + '\n\n--- Réponse IA ---\n' + relevantText.trim() }));
        setNotification('La réponse a été ajoutée à vos notes.', 'success');
        setHasSavedNote(true);
        setTimeout(() => setHasSavedNote(false), 3000);
    };

    const handleIgnoreAiResponse = () => {
        setShowAiResponseActions(false);
    };

    const handleApplyAiResponse = () => {
        // This function is now obsolete as data is applied automatically.
        // It can be removed or repurposed if you need a manual "apply" button for other reasons.
        // For now, we can just show a notification.
        setNotification('Les données de l\'IA sont appliquées automatiquement.', 'info');
        setHasApplied(true);
        if (setIsSaveModalOpen) setIsSaveModalOpen(true);
    };

    const resetAI = () => {
        setAiInput('');
        setConversation([]);
        setGeminiError('');
    };

    return {
        aiInput,
        setAiInput,
        aiPrompt,
        setAiPrompt,
        showAiResponseActions,
        aiActions,
        isApplyingAi,
        hasSavedNote,
        hasApplied,
        isAiAssistantModalOpen,
        setIsAiAssistantModalOpen,
        isGeminiLoading,
        geminiError,
        conversation,
        setConversation,
        handleGeneralQuery,
        handleSaveAiResponse,
        handleIgnoreAiResponse,
        handleApplyAiResponse,
        resetAI,
        checkAiCredits,
        getAiButtonTooltip,
        calculateAndShowResult, // Expose the function
        saveAnalysis,
    };
};
