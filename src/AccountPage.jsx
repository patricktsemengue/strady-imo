
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabaseClient';
import ConfirmationModal from './ConfirmationModal';
import { WalletIcon, UserIcon, ShieldCheckIcon, AlertTriangleIcon, BriefcaseIcon, SendIcon, UsersIcon } from './Icons';
import { useNotification } from './contexts/useNotification';

const AccountPage = ({ onNavigate, userPlan, analysesCount }) => {
    const { user, updatePassword, updateUserData, signOut } = useAuth();
    const { showNotification } = useNotification();
 
    const [prenom, setPrenom] = useState(user.user_metadata?.prenom || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [referrals, setReferrals] = useState([]);

    // US 3.1: State for financial profile
    const [profileType, setProfileType] = useState(user.user_metadata?.financial_profile?.profileType || 'INDIVIDUAL');
    const [individualFinances, setIndividualFinances] = useState({
        monthlyNetIncome: user.user_metadata?.financial_profile?.individualFinances?.monthlyNetIncome || '',
        monthlyExpenses: user.user_metadata?.financial_profile?.individualFinances?.monthlyExpenses || '',
        currentLoansMonthlyPayment: user.user_metadata?.financial_profile?.individualFinances?.currentLoansMonthlyPayment || '',
        availableSavings: user.user_metadata?.financial_profile?.individualFinances?.availableSavings || '',
    });
    const [companyFinances, setCompanyFinances] = useState({
        annualRevenue: user.user_metadata?.financial_profile?.companyFinances?.annualRevenue || '',
        annualNetProfit: user.user_metadata?.financial_profile?.companyFinances?.annualNetProfit || '',
        availableCash: user.user_metadata?.financial_profile?.companyFinances?.availableCash || '',
    });

    const [nameMessage, setNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [error, setError] = useState(''); // General error for the page
    const [loading, setLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const referralCode = user.user_metadata?.referral_code;

    useEffect(() => {
        const fetchReferrals = async () => {
            if (!user) return;

            // We need to join with auth.users to get the referred user's email
            const { data, error } = await supabase
                .from('referrals')
                .select(`
                    id,
                    created_at,
                    referred_user_id
                `)
                .eq('referring_user_id', user.id);

            if (!error) setReferrals(data);
        };

        fetchReferrals();
    }, [user]);

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
            setPasswordMessage('Mot de passe mis à jour avec succès !');
            setPassword('');
            setConfirmPassword('');
        }
    };

    // US 3.1: Handle financial profile update
    const handleFinancialProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const financial_profile = {
            profileType,
            individualFinances: profileType === 'INDIVIDUAL' ? individualFinances : {},
            companyFinances: profileType === 'COMPANY' ? companyFinances : {}
        };

        const { error } = await updateUserData({ financial_profile });
        setLoading(false);

        if (error) {
            setError('Erreur lors de la mise à jour du profil financier: ' + error.message);
        } else {
            showNotification('Profil financier mis à jour avec succès !', 'success');
        }
    };

    const handleFinanceInputChange = (e, type) => {
        const { name, value } = e.target;
        const numericValue = value === '' ? '' : parseFloat(value) || 0;
        if (type === 'INDIVIDUAL') {
            setIndividualFinances(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setCompanyFinances(prev => ({ ...prev, [name]: numericValue }));
        }
    };

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        if (!inviteEmail) {
            showNotification('Veuillez entrer une adresse e-mail.', 'error');
            return;
        }
        setInviteLoading(true);
        try {
            const { error } = await supabase.functions.invoke('invite-friend', {
                body: { email: inviteEmail },
            });
            if (error) throw error;
            showNotification(`Invitation envoyée avec succès à ${inviteEmail} !`, 'success');
            setInviteEmail('');
        } catch (error) {
            showNotification(`Erreur lors de l'envoi de l'invitation: ${error.message}`, 'error');
        } finally {
            setInviteLoading(false);
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
            showNotification('Votre compte a été supprimé avec succès.', 'success');
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

                        {/* --- Carte Invitation --- */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><SendIcon /> Inviter un ami</h2>
                            <p className="text-sm text-gray-500 mb-4">Envoyez un lien d'invitation pour rejoindre Strady.imo.</p>
                            <form onSubmit={handleSendInvitation} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">E-mail de votre ami</label>
                                    <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="ami@example.com" />
                                </div>
                                <button type="submit" disabled={inviteLoading} className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 disabled:bg-emerald-300">
                                    {inviteLoading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
                                </button>
                            </form>
                        </div>

                        {/* --- Carte Parrainage --- */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><UsersIcon /> Mon Programme de Parrainage</h2>
                            {referralCode ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Votre code de parrainage unique</label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <input type="text" readOnly value={referralCode} className="flex-1 block w-full rounded-none rounded-l-md p-2 border-gray-300 bg-gray-100 cursor-not-allowed" />
                                            <button onClick={() => { navigator.clipboard.writeText(referralCode); showNotification('Code copié !', 'success'); }} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100">Copier</button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-medium text-gray-700">Utilisateurs parrainés ({referrals.length})</h3>
                                        {referrals.length > 0 ? (
                                            <ul className="mt-2 border-t border-gray-200 divide-y divide-gray-200">
                                                {referrals.map(ref => <li key={ref.id} className="py-2 text-sm text-gray-600">Inscrit le {new Date(ref.created_at).toLocaleDateString()}</li>)}
                                            </ul>
                                        ) : <p className="text-sm text-gray-500 mt-2">Aucun utilisateur parrainé pour le moment.</p>}
                                    </div>
                                </div>
                            ) : <p className="text-sm text-gray-500">Envoyez votre première invitation pour générer votre code de parrainage.</p>}
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

                        {/* US 3.1: Financial Profile Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4"><BriefcaseIcon /> Profil Financier</h2>
                            <p className="text-sm text-gray-500 mb-4">Ces informations permettront de personnaliser les calculs de faisabilité de vos projets (à venir).</p>
                            <form onSubmit={handleFinancialProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de profil</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setProfileType('INDIVIDUAL')} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${profileType === 'INDIVIDUAL' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Particulier</button>
                                        <button type="button" onClick={() => setProfileType('COMPANY')} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${profileType === 'COMPANY' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Société</button>
                                    </div>
                                </div>

                                {profileType === 'INDIVIDUAL' && (
                                    <div className="space-y-4 p-4 bg-gray-50 border rounded-lg animate-fade-in">
                                        <h3 className="font-semibold text-gray-800">Profil Particulier</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Revenus nets mensuels (€)</label>
                                            <input type="number" name="monthlyNetIncome" value={individualFinances.monthlyNetIncome} onChange={(e) => handleFinanceInputChange(e, 'INDIVIDUAL')} className="mt-1 w-full p-2 border rounded-md" placeholder="3000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Charges mensuelles (hors crédits) (€)</label>
                                            <input type="number" name="monthlyExpenses" value={individualFinances.monthlyExpenses} onChange={(e) => handleFinanceInputChange(e, 'INDIVIDUAL')} className="mt-1 w-full p-2 border rounded-md" placeholder="1200" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mensualités de crédits actuels (€)</label>
                                            <input type="number" name="currentLoansMonthlyPayment" value={individualFinances.currentLoansMonthlyPayment} onChange={(e) => handleFinanceInputChange(e, 'INDIVIDUAL')} className="mt-1 w-full p-2 border rounded-md" placeholder="500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Épargne disponible (€)</label>
                                            <input type="number" name="availableSavings" value={individualFinances.availableSavings} onChange={(e) => handleFinanceInputChange(e, 'INDIVIDUAL')} className="mt-1 w-full p-2 border rounded-md" placeholder="25000" />
                                        </div>
                                    </div>
                                )}

                                {profileType === 'COMPANY' && (
                                    <div className="space-y-4 p-4 bg-gray-50 border rounded-lg animate-fade-in">
                                        <h3 className="font-semibold text-gray-800">Profil Société</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Chiffre d'affaires annuel (€)</label>
                                            <input type="number" name="annualRevenue" value={companyFinances.annualRevenue} onChange={(e) => handleFinanceInputChange(e, 'COMPANY')} className="mt-1 w-full p-2 border rounded-md" placeholder="150000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bénéfice net annuel (€)</label>
                                            <input type="number" name="annualNetProfit" value={companyFinances.annualNetProfit} onChange={(e) => handleFinanceInputChange(e, 'COMPANY')} className="mt-1 w-full p-2 border rounded-md" placeholder="40000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Trésorerie disponible (€)</label>
                                            <input type="number" name="availableCash" value={companyFinances.availableCash} onChange={(e) => handleFinanceInputChange(e, 'COMPANY')} className="mt-1 w-full p-2 border rounded-md" placeholder="80000" />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">
                                    {loading ? '...' : 'Sauvegarder le profil financier'}
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
