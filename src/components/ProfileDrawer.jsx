import React from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsIcon, WalletIcon, StarIcon, LogOutIcon, HelpIcon, HomeIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';
import Copyright from '../Copyright';

const ProfileDrawer = ({ isOpen, onClose, onNavigate, onSignOut, user, userPlan, analyses }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        onClose();
    };

    if (!user) return null;

    const footer = (
        <div className="text-center">
            <Copyright />
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={t('profile')}
            footer={footer}
        >
            <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                    {userPlan && (
                        <div className="mt-2">
                            <p className="font-semibold text-blue-600">{userPlan.profile_plans.plan_name}</p>
                            <p className="text-sm text-gray-500">{t('ai_credits')}: {userPlan.current_ai_credits === -1 ? t('unlimited') : userPlan.current_ai_credits}</p>
                            <p className="text-sm text-gray-500">{t('analyses')}: {userPlan.profile_plans.stored_analysis === -1 ? t('unlimited') : `${analyses.length} / ${userPlan.profile_plans.stored_analysis}`}</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-lg font-semibold text-gray-800">{t('language')}</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <button onClick={() => changeLanguage('fr')} className={`p-2 rounded-lg text-sm font-medium ${i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t('french')}</button>
                        <button onClick={() => changeLanguage('en')} className={`p-2 rounded-lg text-sm font-medium ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t('english')}</button>
                        <button onClick={() => changeLanguage('nl')} className={`p-2 rounded-lg text-sm font-medium ${i18n.language === 'nl' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t('dutch')}</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { onNavigate('account'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <SettingsIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{t('my_profile')}</span>
                    </button>
                    <button onClick={() => { onNavigate('dashboard'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <HomeIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{t('my_analyses')}</span>
                    </button>
                    <button onClick={() => { onNavigate('plans'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <WalletIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{t('subscription')}</span>
                    </button>
                    <button onClick={() => { onNavigate('feedback'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm" title="Signaler un bug, faire une suggestion...">
                        <StarIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{t('feedback_support')}</span>
                    </button>
                    <button onClick={() => { onNavigate('aide'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <HelpIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{t('help_center')}</span>
                    </button>
                </div>
                <div className="my-6 border-t" />
                <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors duration-200">
                    <LogOutIcon />
                    <span>{t('sign_out')}</span>
                </button>
            </div>
        </BottomSheetDrawer>
    );
};

export default ProfileDrawer;
