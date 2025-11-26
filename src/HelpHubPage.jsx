import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileTextIcon, ShieldCheckIcon } from './Icons';

const HelpHubPage = ({ onNavigate }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('help_center')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Carte pour le Manuel Utilisateur */}
                <div onClick={() => onNavigate('user-manual')} className="p-6 border rounded-lg hover:shadow-lg hover:border-blue-400 transition cursor-pointer">
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{t('user_manual_faq')}</h2>
                    <p className="text-gray-600">
                        {t('user_manual_faq_description')}
                    </p>
                </div>

                {/* Carte pour la Base de Connaissances */}
                <div onClick={() => onNavigate('knowledge')} className="p-6 border rounded-lg hover:shadow-lg hover:border-green-400 transition cursor-pointer">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">{t('knowledge_base')}</h2>
                    <p className="text-gray-600">
                        {t('knowledge_base_description')}
                    </p>
                </div>

                {/* Carte pour le Glossaire */}
                <div onClick={() => onNavigate('glossary')} className="p-6 border rounded-lg hover:shadow-lg hover:border-purple-400 transition cursor-pointer">
                    <h2 className="text-xl font-semibold text-purple-700 mb-2">{t('glossary_of_terms')}</h2>
                    <p className="text-gray-600">
                        {t('glossary_of_terms_description')}
                    </p>
                </div>

                {/* Carte pour les Conditions d'utilisation */}
                <div onClick={() => onNavigate('terms')} className="p-6 border rounded-lg hover:shadow-lg hover:border-indigo-400 transition cursor-pointer">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2"><FileTextIcon /> {t('terms_of_use')}</h2>
                    <p className="text-gray-600">
                        {t('terms_of_use_description')}
                    </p>
                </div>

                {/* Carte pour la Politique de confidentialité */}
                <div onClick={() => onNavigate('privacy')} className="p-6 border rounded-lg hover:shadow-lg hover:border-rose-400 transition cursor-pointer">
                    <h2 className="text-xl font-semibold text-rose-700 mb-2 flex items-center gap-2"><ShieldCheckIcon /> {t('privacy_policy')}</h2>
                    <p className="text-gray-600">
                        {t('privacy_policy_description')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpHubPage;