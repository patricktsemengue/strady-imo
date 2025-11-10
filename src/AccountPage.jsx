
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import ConfirmationModal from './ConfirmationModal';
import { WalletIcon, UserIcon, ShieldCheckIcon, AlertTriangleIcon } from './Icons';

const AccountPage = ({ onBack, onNavigate, userPlan, analysesCount, setNotification }) => {
    const { user, updatePassword, updateUserData, signOut } = useAuth();
 
    const [prenom, setPrenom] = useState(user.user_metadata?.prenom || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameMessage, setNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNameMessage('');
        setError('');
        if (!prenom.trim()) {
            setError('Le nom ne peut pas être vide.');
            setLoading(false);
            return;
        }
        const { error } = await updateUserData({ prenom: prenom });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setNameMessage('Nom mis à jour avec succès !');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordMessage('');
        setError('');
        if (password.length < 6) {
            setError('Le mot de passe doit faire au moins 6 caractères.');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }
        const { error } = await updatePassword(password);
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setNotification({ msg: 'Mot de passe mis à jour avec succès !', type: 'success' });
            setPassword('');
            setConfirmPassword('');
        }
    };

    const handleDeleteAccount = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        setError('');

        const { error: functionError } = await supabase.functions.invoke('delete-user');

        if (functionError) {
            setError("Une erreur est survenue lors de la suppression du compte. " + functionError.message);
            setLoading(false);
            setIsModalOpen(false);
        } else {
            await signOut();
            // Vider toutes les données locales pour ne laisser aucune trace
            localStorage.removeItem('immoAnalyses');
            localStorage.removeItem('welcomeExpiry');
            // Pas besoin de supprimer le consentement des cookies, c'est un choix de navigateur

            // Afficher la notification de succès
            setNotification({ msg: 'Votre compte a été supprimé avec succès.', type: 'success' });
            // Rediriger vers la page de connexion
            onNavigate('auth');
        }
    };

    return (
        <>
            <div className="p-4 md:p-6 bg-slate-50 animate-fade-in space-y-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800">Mon Espace</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Colonne de gauche : Profil & Sécurité --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* --- Carte Profil --- */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><UserIcon /> Informations Personnelles</h2>
                            <form onSubmit={handleNameUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                                    <input type="email" value={user.email} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                                </div>
                                {nameMessage && <p className="text-green-600 font-semibold">{nameMessage}</p>}
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">
                                    {loading ? '...' : 'Mettre à jour le prénom'}
                                </button>
                            </form>
                        </div>

                        {/* --- Carte Sécurité --- */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><ShieldCheckIcon /> Sécurité</h2>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                    <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                                </div>
                                {passwordMessage && <p className="text-green-600 font-semibold">{passwordMessage}</p>}
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">
                                    {loading ? '...' : 'Changer le mot de passe'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- Colonne de droite : Abonnement & Danger Zone --- */}
                    <div className="space-y-8">
                        {/* --- Carte Abonnement --- */}
                        {userPlan && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><WalletIcon /> Mon Abonnement</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-600">Plan actuel :</span>
                                        <span className="font-bold text-lg text-blue-600">{userPlan.profile_plans.plan_name}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-600">Crédits IA restants :</span>
                                        <span className="font-bold">{userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-600">Analyses sauvegardées :</span>
                                        <span className="font-bold">{userPlan.profile_plans.stored_analysis === -1 ? 'Illimitées' : `${analysesCount} / ${userPlan.profile_plans.stored_analysis}`}</span>
                                    </div>
                                </div>
                                <button onClick={() => onNavigate('plans')} className="mt-6 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                                    Gérer mon abonnement
                                </button>
                            </div>
                        )}

                        {/* --- Carte Danger Zone --- */}
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
                            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4"><AlertTriangleIcon /> Zone de Danger</h2>
                            <p className="text-sm text-gray-600 mt-2">La suppression de votre compte est irréversible et entraînera la perte de toutes vos analyses sauvegardées.</p>
                            <button onClick={handleDeleteAccount} disabled={loading} className="mt-4 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-red-300">
                                Supprimer mon compte
                            </button>
                        </div>
                    </div>
                </div>
                
                {error && <p className="text-red-600 font-semibold text-center mt-4">{error}</p>}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression du compte"
                isLoading={loading}
            >
                <p>Êtes-vous absolument sûr ? Cette action est irréversible et désactivera votre compte ainsi que toutes vos données.</p>
            </ConfirmationModal>
        </>
    );
};

export default AccountPage;
