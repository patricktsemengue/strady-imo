import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, AlertTriangleIcon, MicIcon, SendIcon, TrashIcon } from './Icons';
import AIResponse from './components/AIResponse'; // Import the dedicated component
import { useAuth } from './hooks/useAuth';
import { useModal } from './contexts/useModal';
import AppFooter from './components/AppFooter';
import Copyright from './Copyright';
import { Logo } from './Logo';

const AiAssistantPage = ({
    aiInput,
    setAiInput,
    handleGeneralQuery,
    isGeminiLoading,
    geminiError,
    conversation,
    setConversation,
    resetAI,
    userPlan,
    checkAiCredits,
    getAiButtonTooltip,
    calculateAndShowResult, // Receive the new function as a prop
    isAnalysisComplete, // <-- Receive the new prop here
    saveAnalysis,
}) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const chatHistoryRef = useRef(null);
    const { user } = useAuth();
    const { setIsProfileModalOpen } = useModal();
    const navigate = useNavigate();

    const GOTO_DASHBOARD_ACTION = "Accéder directement à vos analyses sauvegardées";
    const GOTO_FORM_ACTION = "Accéder au formulaire";
    const EVALUATE_ANALYSIS_ACTION = "Evaluer l'analyse";
    const SAVE_ANALYSIS_ACTION = "Sauvegarder l'analyse";
    
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
                    content: `Bonjour ${user.user_metadata?.prenom || ''} ! Je suis "Strady", votre assistant IA.
                    <p>Mon objectif est de vous aider à estimer la rentabilité de votre investissement.</p>
                    <p><i>Commencez par me décrire votre projet ou coller une annonce immobilère ici ?</i></p>
                    <p></p>
                    <hr></hr>
                    `,
                    actions: [GOTO_DASHBOARD_ACTION, GOTO_FORM_ACTION],
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
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [conversation, isGeminiLoading]);

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
        handleGeneralQuery(conversation, aiInput); // Pass conversation and current input
        setAiInput('');
    };

    const handleActionClick = (actionText) => {
        switch (actionText) {
            case GOTO_DASHBOARD_ACTION:
                navigate('/dashboard');
                break;
            case GOTO_FORM_ACTION:
                navigate('/');
                break;
            case EVALUATE_ANALYSIS_ACTION:
                calculateAndShowResult();
                navigate('/');
                break;
            case SAVE_ANALYSIS_ACTION:
                saveAnalysis();
                break;
            default:
                // For any other action, treat it as input for the AI
                setAiInput(actionText);
        }
    };

    const handleClearChat = () => {
        resetAI();
        localStorage.removeItem('aiConversation');
    };

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50">
            <div className="flex-shrink-0 z-10">
                {/* Header */}
                <div className="flex justify-between items-center p-2 md:p-4 border-b border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <Logo />
                        {/* 
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <SparklesIcon /> Assistant IA
                        </h2>
                        */}
                    </div>
                    {conversation.length > 0 && (
                        <button onClick={handleClearChat} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Effacer la conversation">
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
            <div ref={chatHistoryRef} className="overflow-y-auto flex-grow p-4 space-y-4">
                    {conversation.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    {/*<SparklesIcon className="w-5 h-5 text-purple-600" />*/}
                                    <span className="logo-s">S</span>
                                </div>
                            )}
                            <div className={`max-w-[90%] md:max-w-4xl ${msg.sender === 'user' ? 'bg-blue-500 text-white p-3 rounded-lg' : 'text-gray-800'}`}>
                                {msg.sender === 'ai' ? (
                                    <AIResponse
                                        response={{ text: msg.content }}
                                        actions={msg.actions || []}
                                        onActionClick={handleActionClick}
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
            
            {/* Effect to auto-submit after an action click */}
            {useEffect(() => {
                if (aiInput && conversation.some(msg => msg.actions?.includes(aiInput))) {
                    handleGeneralQuery(conversation, aiInput); // Pass history and action-text as input
                    setAiInput('');
                }
            }, [aiInput])}
            {/* --- Fixed Bottom Area --- */}
            <div className="sticky bottom-0 left-0 right-0 bg-gray-50">
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
                        {conversation.some(m => m.sender === 'ai') && (
                            <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1.5">
                                <AlertTriangleIcon className="h-4 w-4 flex-shrink-0 text-yellow-500" /> L'assistant IA peut commettre des erreurs. Vérifiez toujours les informations importantes.
                            </p>
                        )}
                    </div>
                )}

                <div className="text-center pb-2 pt-1">
                    <Copyright />
                </div>

                <AppFooter user={user} onProfileClick={() => setIsProfileModalOpen(true)} isAIAssistantPage={true} />
            </div>
        </div>
    );
};

export default AiAssistantPage;

            