import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon, AlertTriangleIcon, MicIcon, SendIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';
import AIResponse from './AIResponse';

const AiAssistantDrawer = ({
    isOpen,
    onClose,
    aiInput,
    setAiInput,
    aiPrompt,
    setAiPrompt,
    isGeminiLoading,
    geminiError,
    geminiResponse,
    aiActions,
    handleAiActionClick,
    handleGeneralQuery,
    handleNewPrompt,
    userPlan,
    checkAiCredits,
    getAiButtonTooltip,
    prePromptConfig = []
}) => {
    const { t } = useTranslation();
    const [isListening, setIsListening] = useState(false);
    const [conversation, setConversation] = useState([]);
    const recognitionRef = useRef(null);
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn(t('voice_recognition_not_supported'));
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
    }, [setAiInput, t]);

    useEffect(() => {
        if (isOpen) {
            setConversation([]);
            setAiInput('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (geminiResponse && !isGeminiLoading) {
            setConversation(prev => [...prev, { sender: 'ai', content: geminiResponse, actions: aiActions }]);
        }
    }, [geminiResponse, isGeminiLoading, aiActions]);

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
        handleGeneralQuery(aiInput);
        setAiInput('');
    };

    const modalContent = (
        <div className="flex flex-col h-[60vh]">
            <div ref={chatHistoryRef} className="overflow-y-auto flex-grow space-y-4 pb-4">
                <div className="flex items-start gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-gray-800">
                        <AIResponse response={{ text: t('ai_greeting') }} />
                    </div>
                </div>

                {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-purple-600" />
                            </div>
                        )}
                        <div className={`max-w-[90%] ${msg.sender === 'user' ? 'bg-blue-500 text-white p-3 rounded-lg' : 'text-gray-800'}`}>
                            {msg.sender === 'ai' ? (
                                <AIResponse
                                    response={{ text: msg.content, actions: msg.actions || aiActions }}
                                    onUpdateField={(payload) => handleAiActionClick({ type: 'UPDATE_FIELD', payload })}
                                    onNewPrompt={handleNewPrompt}
                                />
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
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
                            <div className="typing-indicator"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                )}
                {geminiError && !isGeminiLoading && <p className="text-red-500 text-sm mt-2">{geminiError}</p>}
            </div>

            <div className="pt-4 border-t border-gray-200 bg-white">
                <div className="relative">
                    <textarea
                        name="aiInput"
                        value={aiInput}
                        onChange={(e) => { if (checkAiCredits()) setAiInput(e.target.value); }}
                        rows="1"
                        placeholder={isListening ? t('speak_now') : t('change_price_example')}
                        className="w-full p-3 border rounded-lg pl-14 resize-none pb-12"
                        onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserMessage(); } }}
                    />
                    <div className="absolute top-3 left-3 flex items-center">
                        {recognitionRef.current && (
                            <button type="button" onClick={toggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} title={isListening ? t('stop_dictation') : t('start_dictation')}>
                                <MicIcon />
                            </button>
                        )}
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-3">
                        <button onClick={handleUserMessage} disabled={isGeminiLoading || !aiInput.trim() || (userPlan && userPlan.current_ai_credits === 0)} className="w-10 h-10 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 disabled:bg-purple-300 disabled:cursor-help flex items-center justify-center" title={getAiButtonTooltip()}>
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const modalTitle = (
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
                <SparklesIcon />
                <span>{t('ai_real_estate_assistant')}</span>
            </div>
            {userPlan && (
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${userPlan.current_ai_credits > 0 || userPlan.current_ai_credits === -1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {t('credits')} {userPlan.current_ai_credits === -1 ? t('unlimited') : userPlan.current_ai_credits}
                </span>
            )}
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            footer={<div className="flex justify-end"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">{t('close')}</button></div>}
        >
            {modalContent}
        </BottomSheetDrawer>
    );
};

export default AiAssistantDrawer;
