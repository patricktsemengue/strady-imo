import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Logo } from './Logo'; // On importe le Logo depuis App.jsx
import { useAuth } from './hooks/useAuth';

const WelcomePage = ({ onStart, onNavigate, user }) => {
    const { t } = useTranslation();
    const [showLegal, setShowLegal] = useState(false);
    // setAuthPageInitialMode est nécessaire pour définir le mode sur la page d'authentification
    const { setAuthPageInitialMode } = useAuth();
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-100 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                <Logo />
                <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2">
                    {user?.user_metadata?.prenom
                        ? t('welcome_back', { firstName: user.user_metadata.prenom })
                        : t('welcome_new')}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    {user?.user_metadata?.prenom
                        ? t('glad_to_see_you_again')
                        : t('copilot_for_rental_investment')
                    }
                </p>
                <div className="text-left space-y-3 mb-8">
                    <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><Trans i18nKey="feature_analyze" /></p>
                    <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><Trans i18nKey="feature_estimate" /></p>
                    <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><Trans i18nKey="feature_evaluate" /></p>
                    <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><Trans i18nKey="feature_save_time" /></p>
                    <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><Trans i18nKey="feature_save_sync" /></p>
                </div>
                <p className="text-gray-600 mb-8 italic">
                    {t('ready_to_transform')}
                </p>
                <div className="flex flex-col gap-4 mb-8">
                    {user ? (
                        // Bouton pour l'utilisateur authentifié
                        <button
                            onClick={() => {
                                // On vide le cache du formulaire de l'assistant IA pour repartir de zéro
                                localStorage.setItem('analysisState', 'new');
                                localStorage.removeItem('aiAssistantData');
                                onStart('/ai-assistant');
                            }}
                            className="w-full bg-emerald-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-lg"
                        >
                            {t('start_an_analysis')}
                        </button>
                    ) : (
                        // Boutons pour l'utilisateur non-authentifié
                        <>
                            <button onClick={() => { localStorage.setItem('analysisState', 'initial'); onStart('/analysis-form'); }} className="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-50 transition duration-300">
                                {t('try_the_simulator')}
                            </button>
                            <button onClick={() => { setAuthPageInitialMode('signUp'); onNavigate('/auth'); }} className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                                {t('create_free_account')}
                            </button>
                        </>
                    )}
                </div>

                
            </div>
        </div>
    );
};

export default WelcomePage;