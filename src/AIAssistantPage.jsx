import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, AlertTriangleIcon, MicIcon, SendIcon, TrashIcon } from './Icons';
import AIResponse from './components/AIResponse'; // Import the dedicated component
import { useAuth } from './hooks/useAuth';
import ConfirmationModal from './ConfirmationModal';
import { useModal } from './contexts/useModal';
import { useInterviewer } from './hooks/useInterviewer';
import FabMenu from './components/FabMenu';
import AppFooter from './components/AppFooter';

const AiAssistantPage = ({
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
    handleNewProject,
}) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [conversation, setConversation] = useState([]);
    const [isClearConfirmModalOpen, setIsClearConfirmModalOpen] = useState(false);
    const chatHistoryRef = useRef(null);
    const { user } = useAuth();
    const { setIsProfileModalOpen } = useModal();
    
    const { 
        isInterviewerMode, 
        processAiResponse, 
        handleInterviewerResponse, 
        setOriginalUserPrompt,
        resetInterviewer } = useInterviewer({ setConversation, handleGeneralQuery, aiActions });
    // --- LOCAL STORAGE PERSISTENCE ---
    useEffect(() => {
        // Load conversation from localStorage on initial mount
        try {
            const savedConversation = localStorage.getItem('aiConversation');

            if (savedConversation && savedConversation !== '[]') {
                setConversation(JSON.parse(savedConversation));
            } else if (user && (!savedConversation || savedConversation === '[]')) {
                // If no conversation is saved, and user is logged in, set up a simple welcome message.
                const welcomeMessage = {
                    sender: 'ai',
                    content: `Bonjour ${user?.displayName || ''} ! Je suis votre assistant IA, prêt à vous aider. Pour commencer, vous pouvez coller une annonce, une URL, ou me dicter les détails du bien.`
                };
                setConversation([welcomeMessage]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la conversation depuis le localStorage:", error);
            localStorage.removeItem('aiConversation');
        }
    }, [user]);

    useEffect(() => {
        // Save conversation to localStorage whenever it changes
        if (conversation.length > 0) {
            localStorage.setItem('aiConversation', JSON.stringify(conversation));
        } else {
            localStorage.removeItem('aiConversation');
        }
    }, [conversation]);

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
            if (finalTranscript) {
                setAiInput(prev => prev + finalTranscript + ' ');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [setAiInput]);

    useEffect(() => {
        if (geminiResponse && !isGeminiLoading) {
            processAiResponse(geminiResponse);
        }
    }, [geminiResponse, isGeminiLoading]);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [conversation]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleUserMessage = () => {
        if (!aiInput.trim()) return;

        setConversation(prev => [...prev, { sender: 'user', content: aiInput }]);

        if (isInterviewerMode) {
            handleInterviewerResponse(aiInput);
        } else {
            setOriginalUserPrompt(aiInput); // Save the first user prompt
            handleGeneralQuery(aiInput);
        }
        setAiInput('');
    };
    const handleClearChat = () => {
        setIsClearConfirmModalOpen(true);
    };

    const handleConfirmClearChat = () => {
        setConversation([]);
        setIsClearConfirmModalOpen(false);
        resetInterviewer(); // Reset interviewer state
        // The useEffect for persistence will handle localStorage removal
    };

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
            <div className="flex-shrink-0 z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-2 md:p-4 border-b border-gray-200 bg-white">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2"><SparklesIcon /> Assistant IA</h2>
                    {conversation.length > 0 && (
                        <button onClick={handleClearChat} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Effacer la conversation">
                            <TrashIcon className="h-4 w-4" /> <span className="hidden sm:inline">Effacer</span>
                        </button>
                    )}
                    {/*userPlan && (
                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${userPlan.current_ai_credits > 0 || userPlan.current_ai_credits === -1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                            Crédits restants: {userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}
                        </span>
                    )*/}
                </div>
            </div>
            {/* Chat History */}
            <div ref={chatHistoryRef} className="overflow-y-auto flex-grow p-4 space-y-4 pb-40">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                                </div>
                            )}
                            <div className={`max-w-[90%] md:max-w-4xl ${msg.sender === 'user' ? 'bg-blue-500 text-white p-3 rounded-lg' : 'text-gray-800'}`}>
                                {msg.sender === 'ai' ? (
                                    <AIResponse
                                        response={{ text: msg.content, actions: msg.actions || aiActions }}
                                        onUpdateField={(payload) => handleAiActionClick({ type: 'UPDATE_FIELD', payload })}
                                        onNewPrompt={handleNewPrompt}
                                    />
                                ) : (
                                    <div className="whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isGeminiLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3 px-4 inline-block">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    {geminiError && !isGeminiLoading && <p className="text-red-500 text-sm mt-2">{geminiError}</p>}
            </div>
            
            {/* --- Fixed Bottom Area --- */}
            <div className="absolute bottom-0 left-0 right-0">
                {/* Input & Actions Area */}
                {user && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="relative">
                            <textarea
                                name="aiInput"
                                value={aiInput}
                                onChange={(e) => {
                                    if (checkAiCredits()) setAiInput(e.target.value);
                                }}
                                rows="1"
                                placeholder={isListening ? "Parlez maintenant..." : "Posez une question, collez une URL ou une annonce..."}
                                className="w-full p-3 border rounded-lg pl-14 resize-none pb-12"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleUserMessage();
                                    }
                                }}
                            />
                            <div className="absolute top-3 left-3 flex items-center">
                                {recognitionRef.current && (
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                        title={isListening ? "Arrêter la dictée" : "Commencer la dictée vocale"}
                                    >
                                        <MicIcon />
                                    </button>
                                )}
                            </div>
                            {/* Action Buttons inside Textarea */}
                            <div className="absolute bottom-2 right-2 flex items-center gap-3">
                                {geminiResponse && showAiResponseActions && (
                                    <button
                                        onClick={handleApplyAiResponse}
                                        disabled={isApplyingAi || hasApplied || !geminiResponse.match(/\*\*Prix d'achat\s?:\*\*|\*\*Surface\s?:\*\*|\*\*Loyer mensuel estimé\s?:\*\*/i)}
                                        className="text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg"
                                        title={!geminiResponse.match(/\*\*Prix d'achat\s?:\*\*|\*\*Surface\s?:\*\*|\*\*Loyer mensuel estimé\s?:\*\*/i) ? "Aucune donnée pertinente (prix, surface, loyer) n'a été trouvée." : "Appliquer les données au formulaire"}
                                    >
                                        {isApplyingAi ? 'Application...' : hasApplied ? 'Appliqué ✓' : 'Appliquer'}
                                    </button>
                                )}
                                <button
                                    onClick={handleUserMessage}
                                    disabled={isGeminiLoading || !aiInput.trim() || (userPlan && userPlan.current_ai_credits === 0)}
                                    className="w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 disabled:bg-purple-300 disabled:cursor-help flex items-center justify-center"
                                    title={getAiButtonTooltip()}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                        {/* AI Warning */}
                        {geminiResponse && (
                            <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1.5">
                                <AlertTriangleIcon className="h-4 w-4 flex-shrink-0 text-yellow-500" /> L'assistant IA peut commettre des erreurs. Vérifiez toujours les informations importantes.
                            </p>
                        )}
                    </div>
                )}

                <AppFooter user={user} onProfileClick={() => setIsProfileModalOpen(true)} isAIAssistantPage={true} />
            </div>

            <ConfirmationModal
                isOpen={isClearConfirmModalOpen}
                onClose={() => setIsClearConfirmModalOpen(false)}
                onConfirm={handleConfirmClearChat}
                title="Effacer la conversation"
                confirmText="Effacer"
            >
                <p>Êtes-vous sûr de vouloir effacer tout l'historique de cette conversation ? Cette action est irréversible.</p>
            </ConfirmationModal>
            {user && <FabMenu handleNewProject={handleNewProject} />}
        </div>
    );
};

export default AiAssistantPage;

            