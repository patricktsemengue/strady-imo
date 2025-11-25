import React from 'react';
import { supabase } from '../supabaseClient';
import systemPrompt from '../models/AiAssistantPersona.md?raw';
import { aiService } from '../services/aiService';
import { conversationService } from '../services/conversationService';
import { sanitizeData } from '../utils/sanitize';
import { initialDataState } from './useAnalysis';

/**
 * Sets a value in a nested object based on a dot-separated path.
 * This is a mutable operation on the passed object.
 * @param {object} obj - The object to modify.
 * @param {string} path - The path to the property to set (e.g., "financialInputs.purchasePrice").
 * @param {*} value - The value to set.
 */
const setValueByPath = (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        // If a key in the path is missing, we cannot proceed.
        if (current[keys[i]] === undefined || typeof current[keys[i]] !== 'object') {
            console.error(`[setValueByPath] Invalid path: "${path}". Key "${keys[i]}" does not exist or is not an object.`);
            return;
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
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
    const [currentConversation, setCurrentConversation] = React.useState(null);

    React.useEffect(() => {
        if (user) {
            const loadConversation = async () => {
                const conversationData = await conversationService.getOrCreateConversation(user.id);
                setCurrentConversation(conversationData);
                if (conversationData) {
                    const messages = await conversationService.getMessages(conversationData.id);
                    setConversation(messages);
                }
            };
            loadConversation();
        }
    }, [user]);

    const checkAiCredits = () => {
        if (!user) {
            return false;
        }
        if (userPlan && userPlan.current_ai_credits === -1) return true; // Unlimited credits
        if (userPlan && userPlan.current_ai_credits > 0) return true;
        
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
        if (!currentConversation) {
            setGeminiError("La conversation n'a pas pu être chargée.");
            return;
        }

        setIsGeminiLoading(true);
        setGeminiError('');
        
        const userMessageContent = newUserInput.trim();
        const tempUserMessage = { sender: 'user', content: userMessageContent, created_at: new Date().toISOString(), conversation_id: currentConversation.id, user_id: user.id };
        const tempAiMessage = { sender: 'ai', content: '', created_at: new Date().toISOString(), conversation_id: currentConversation.id, user_id: user.id };
        setConversation(prev => [...prev, tempUserMessage, tempAiMessage]);

        setHasApplied(false);
        setHasSavedNote(false);

        await conversationService.addMessage({
            conversation_id: currentConversation.id,
            user_id: user.id,
            sender: 'user',
            content: userMessageContent,
        });

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = newUserInput.match(urlRegex);
        const taskType = urls && urls.length > 0 ? 'EXTRACT_URL' : 'QA';

        try {
            const requestPayload = {
                systemPrompt: String(systemPrompt),
                taskType,
                isAnalysisComplete: isAnalysisComplete ? isAnalysisComplete() : false
            };
            
            const response = await aiService.fetchAIResponse(requestPayload, conversation, newUserInput);
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponseChunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullResponseChunks.push(value);
            }

            // Manually concatenate the Uint8Arrays
            const totalLength = fullResponseChunks.reduce((acc, arr) => acc + arr.length, 0);
            const concatenatedChunks = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of fullResponseChunks) {
                concatenatedChunks.set(chunk, offset);
                offset += chunk.length;
            }
            
            const fullResponseJsonString = decoder.decode(concatenatedChunks);
            
            // Call the modified aiService.parseAIResponse
            const { conversationalPart, jsonData, usageMetadata: parsedUsageMetadata, error } = aiService.parseAIResponse(fullResponseJsonString);
            if (error) setGeminiError(error);

            if (parsedUsageMetadata) { // Use the usageMetadata from the parsed result
                conversationService.logTokenUsage({
                    user_id: user.id,
                    prompt_tokens: parsedUsageMetadata.promptTokenCount,
                    candidates_tokens: parsedUsageMetadata.candidatesTokenCount,
                    total_tokens: parsedUsageMetadata.totalTokenCount,
                    analysis_id: data?.analysisId,
                });
            }

            if (jsonData?.action === 'UPDATE_DATA' && jsonData.payload) {
                setData(prevData => {
                    const newData = JSON.parse(JSON.stringify(prevData));
                    Object.entries(jsonData.payload).forEach(([path, value]) => {
                        setValueByPath(newData, path, value);
                    });
                    return newData;
                });
            }

            const finalAiMessage = {
                conversation_id: currentConversation.id,
                user_id: user.id,
                sender: 'ai',
                content: conversationalPart.trim(), // Use conversationalPart
                actions: jsonData?.suggestedActions || null,
            };
            const savedAiMessage = await conversationService.addMessage(finalAiMessage);

            setConversation(prev => {
                const newConv = [...prev];
                newConv[newConv.length - 1] = savedAiMessage;
                return newConv;
            });

        } catch (err) {
            setGeminiError(err.message);
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
        calculateAndShowResult,
        saveAnalysis,
    };
};