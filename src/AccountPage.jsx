import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const AccountPage = ({ onBack }) => {
    // Récupère l'utilisateur et les nouvelles fonctions de mise à jour
        const { user, updatePassword, updateUserData, signOut } = useAuth();

    // États pour les formulaires
    const [prenom, setPrenom] = useState(user.user_metadata?.prenom || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // États pour les messages de succès/erreur
    const [nameMessage, setNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Gère la mise à jour du prénom
    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNameMessage('');
        setError('');
        if (!prenom.trim()) {
            setError('Le prénom ne peut pas être vide.');
            setLoading(false);
            return;
        }
        const { error } = await updateUserData({ prenom: prenom });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setNameMessage('Prénom mis à jour avec succès !');
        }
    };

    // Gère la mise à jour du mot de passe
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
        } 
    }; 

    const handleDeleteAccount = async () => {
        if (window.confirm("Êtes-vous absolument sûr ? Cette action est irréversible et supprimera votre compte ainsi que toutes vos données.")) {
            setLoading(true);
            setError('');
            console.log("DEMANDE DE SUPPRESSION POUR L'UTILISATEUR:", user.id);

            // TODO: Appeler une Edge Function Supabase ici pour supprimer les données de l'utilisateur
            // et déclencher la suppression du compte `auth`.
            // Exemple: const { error } = await supabase.functions.invoke('delete-user');

            // Pour l'instant, nous déconnectons simplement l'utilisateur.
            await signOut();
            // Pas besoin de setLoading(false) car l'utilisateur est déconnecté et la page va changer.
        }
    };    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in space-y-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Mon Compte</h1>
            <button onClick={onBack} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour à l'analyse</button>

            {/* Formulaire Prénom */}
            <form onSubmit={handleNameUpdate} className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-700">Modifier mon prénom</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>
                {nameMessage && <p className="text-green-600 font-semibold">{nameMessage}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                >
                    {loading ? '...' : 'Mettre à jour le prénom'}
                </button>
            </form>

            {/* Formulaire Mot de passe */}
            <form onSubmit={handlePasswordUpdate} className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-700">Changer le mot de passe</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>
                {passwordMessage && <p className="text-green-600 font-semibold">{passwordMessage}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                >
                    {loading ? '...' : 'Changer le mot de passe'}
                </button>
            </form>

            {/* Affiche les erreurs générales */}
            {error && <p className="text-red-600 font-semibold text-center mt-4">{error}</p>}

            {/* --- Zone de Danger --- */}
            <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-red-600">Zone de Danger</h2>
                <p className="text-sm text-gray-600 mt-2">Cette action est irréversible. La suppression de votre compte entraînera la suppression de toutes vos analyses sauvegardées.</p>
                <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="mt-4 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-red-300"
                >
                    Supprimer mon compte
                </button>
            </div>
        </div>
    );
};

export default AccountPage;