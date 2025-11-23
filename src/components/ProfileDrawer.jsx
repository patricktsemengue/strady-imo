import React from 'react';
import { SettingsIcon, WalletIcon, StarIcon, LogOutIcon, HelpIcon, HomeIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';
import Copyright from '../Copyright';

const ProfileDrawer = ({ isOpen, onClose, onNavigate, onSignOut, user, userPlan, analyses }) => {
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
            title="Profil"
            footer={footer}
        >
            <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                    {userPlan && (
                        <div className="mt-2">
                            <p className="font-semibold text-blue-600">{userPlan.profile_plans.plan_name}</p>
                            <p className="text-sm text-gray-500">Crédits IA: {userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}</p>
                            <p className="text-sm text-gray-500">Analyses: {userPlan.profile_plans.stored_analysis === -1 ? 'Illimitées' : `${analyses.length} / ${userPlan.profile_plans.stored_analysis}`}</p>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { onNavigate('account'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <SettingsIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Mon profil</span>
                    </button>
                    <button onClick={() => { onNavigate('dashboard'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <HomeIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Mes analyses</span>
                    </button>
                    <button onClick={() => { onNavigate('plans'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <WalletIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Abonnement</span>
                    </button>
                    <button onClick={() => { onNavigate('feedback'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm" title="Signaler un bug, faire une suggestion...">
                        <StarIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Feedback & Support</span>
                    </button>
                    <button onClick={() => { onNavigate('aide'); onClose(); }} className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 shadow-sm">
                        <HelpIcon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">Centre d'aide</span>
                    </button>
                </div>
                <div className="my-6 border-t" />
                <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors duration-200">
                    <LogOutIcon />
                    <span>Déconnexion</span>
                </button>
            </div>
        </BottomSheetDrawer>
    );
};

export default ProfileDrawer;
