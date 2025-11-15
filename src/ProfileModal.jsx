import React from 'react';
import { SettingsIcon, WalletIcon, StarIcon, LogOutIcon } from './Icons';
import AnimatedModal from './AnimatedModal';
import Copyright from './Copyright';

const ProfileModal = ({ isOpen, onClose, onNavigate, onSignOut, user, userPlan, analyses }) => {
    if (!user) return null;

    return (
        <AnimatedModal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">Profil</h2>
                            {user?.user_metadata?.prenom && <p className="text-sm text-gray-500">Connecté en tant que {user.user_metadata.prenom}</p>}
                        </div>
                        {userPlan && (
                            <div className="text-right text-sm">
                                <p className="font-semibold text-blue-600">{userPlan.profile_plans.plan_name}</p>
                                <p className="text-gray-500">Crédits IA: {userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}</p>
                                <p className="text-gray-500">Analyses: {userPlan.profile_plans.stored_analysis === -1 ? 'Illimitées' : `${analyses.length} / ${userPlan.profile_plans.stored_analysis}`}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-2">
                    <button onClick={() => { onNavigate('account'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <SettingsIcon />
                        <span>Mon profil</span>
                    </button>
                    <button onClick={() => { onNavigate('plans'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <WalletIcon />
                        <span>Abonnement</span>
                    </button>
                    <button onClick={() => { onNavigate('feedback'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100" title="Signaler un bug, faire une suggestion...">
                        <StarIcon />
                        <span>Feedback & Support</span>
                    </button>
                    <div className="my-2 border-t" />
                    <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                        <LogOutIcon />
                        <span>Déconnexion</span>
                    </button>
                </div>
                <div className="sm:hidden text-center py-2">
                    <Copyright />
                </div>
            </div>
        </AnimatedModal>
    );
};

export default ProfileModal;
