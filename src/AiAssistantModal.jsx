import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, AlertTriangleIcon, MicIcon } from './Icons';
import AIResponse from './components/AIResponse'; // Import the dedicated component

const AiAssistantModal = ({
    isOpen,
    onClose,
    aiInput,
    setAiInput,
    aiPrompt,
    setAiPrompt,
    handleGeneralQuery,
    isGeminiLoading,
    geminiError,
    geminiResponse,
    showAiResponseActions,
    handleApplyAiResponse,
    handleSaveAiResponse,
    handleIgnoreAiResponse,
    isApplyingAi,
    hasSavedNote,
    hasApplied,
    aiActions,
    handleAiActionClick,
    handleNewPrompt, // Added prop
    userPlan,
    checkAiCredits,
    getAiButtonTooltip,
    prePromptConfig = [] // Pass prePromptConfig as a prop
}) => {
    // --- Logique pour la dictée vocale ---
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'fr-FR';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            // Met à jour le champ de texte avec le texte final
            if (finalTranscript) {
                setAiInput(prev => prev + finalTranscript + ' ');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [setAiInput]);

    if (!isOpen) return null;
    
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <SparklesIcon /> Assistant Immobilier IA
                    </h2>
                    <div className="flex items-center gap-4">
                        {userPlan && (
                            <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${userPlan.current_ai_credits > 0 || userPlan.current_ai_credits === -1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                Crédits restants: {userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}
                            </span>
                        )}
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                    <p className="text-sm text-gray-500 mb-3">Collez le texte d'une annonce ou une URL, choisissez une action, puis interrogez l'IA.</p>

                    <div className="relative">
                        <textarea
                            name="aiInput"
                            value={aiInput}
                            onChange={(e) => {
                                if (checkAiCredits()) setAiInput(e.target.value);
                            }}
                            rows="5"
                            placeholder={isListening ? "Parlez maintenant..." : "Collez un texte, une URL, ou utilisez le micro pour dicter."}
                            className="w-full p-2 border rounded-md pr-10"
                        />
                        {recognitionRef.current && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                title={isListening ? "Arrêter la dictée" : "Commencer la dictée vocale"}
                            >
                                <MicIcon />
                            </button>
                        )}
                    </div>

                    <div className="mt-4">
                        {prePromptConfig.map((group) => (
                            <div key={group.category} className="mb-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">{group.category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.prompts.map((promptText) => (
                                        <button
                                            key={promptText}
                                            onClick={() => {
                                                if (checkAiCredits()) setAiPrompt(promptText);
                                            }}
                                            className={`text-sm py-1 px-3 rounded-full transition border-2 ${aiPrompt === promptText ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 text-gray-800 border-gray-100 hover:border-gray-300'}`}
                                        >
                                            {promptText}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleGeneralQuery}
                        disabled={isGeminiLoading || !aiInput || (userPlan && userPlan.current_ai_credits === 0)}
                        className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-purple-300 disabled:cursor-help"
                        title={getAiButtonTooltip()}
                    >
                        {isGeminiLoading ? 'Recherche...' : "Interroger l'IA"}
                    </button>

                    {geminiError && !isGeminiLoading && <p className="text-red-500 text-sm mt-2">{geminiError}</p>}
                    {isGeminiLoading && <div className="text-center p-4 text-sm text-gray-600">L'IA recherche la meilleure réponse...</div>}

                    {geminiResponse && (
                        <div className="mt-4">
                            <AIResponse 
                                response={{ text: geminiResponse, actions: aiActions }}
                                onUpdateField={(payload) => handleAiActionClick({ type: 'UPDATE_FIELD', payload })}
                                onNewPrompt={handleNewPrompt}
                            />
                            <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                <div className="flex-shrink-0 text-yellow-500 pt-0.5"><AlertTriangleIcon /></div>
                                <p className="text-xs text-yellow-800"><strong>Avertissement :</strong> L'assistant IA peut commettre des erreurs. Pensez à toujours vérifier les informations importantes par vous-même.</p>
                            </div>
                            {showAiResponseActions && (
                                <div className="flex justify-end gap-3 border-t pt-3">
                                    <button onClick={handleIgnoreAiResponse} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Ignorer</button>
                                    <button
                                        onClick={handleApplyAiResponse} // The regexes below are simplified checks to enable the button. The real extraction is in useAI.js
                                        disabled={isApplyingAi || hasApplied || !geminiResponse.match(/\*\*Prix d'achat\s?:\*\*|\*\*Surface\s?:\*\*|\*\*Loyer mensuel estimé\s?:\*\*/i)}
                                        className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 ${isApplyingAi ? 'bg-purple-400' : hasApplied ? 'bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white disabled:bg-green-300 disabled:cursor-not-allowed`}
                                        title={!geminiResponse.match(/\*\*Prix d'achat\s?:\*\*|\*\*Surface\s?:\*\*|\*\*Loyer mensuel estimé\s?:\*\*/i) ? "Aucune donnée pertinente (prix, surface, loyer) n'a été trouvée." : "Appliquer les données au formulaire"}
                                    >
                                        {isApplyingAi ? 'Application...' : hasApplied ? 'Appliqué ✓' : 'Appliquer au formulaire'}
                                    </button>
                                    {/* <button onClick={handleSaveAiResponse}
                                        disabled={hasSavedNote}
                                        className={`font-bold py-2 px-4 rounded-lg transition-colors ${hasSavedNote ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed'}`}>
                                        {hasSavedNote ? 'Sauvegardé ✓' : 'Sauvegarder dans les notes'}
                                    </button> */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiAssistantModal;