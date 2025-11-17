import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from './hooks/useAuth';
import { Logo } from './Logo';
import { useNotification } from './contexts/useNotification';

// 1. Accepter 'setNotification' dans les props
const AuthPage = ({ onBack, onNavigate }) => {
  const { signIn, signUp, resetPassword, requestRestore, user, updatePassword, restoreUser, authPageInitialMode } = useAuth();
  const [mode, setMode] = useState(authPageInitialMode); // 'signIn', 'signUp', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ---  ÉTATS ---
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // -------------------------

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // 2. Mettre à jour l'appel useAuth() pour ajouter 'restoreUser'
  const { showNotification } = useNotification();

  // Nouvel état pour gérer la visibilité du formulaire de mise à jour du mot de passe
  const [showUpdatePasswordForm, setShowUpdatePasswordForm] = useState(false);

  // 3. Corriger le useEffect et ses dépendances
  useEffect(() => {
    // Les paramètres de session (access_token, type) sont dans le hash de l'URL après une redirection de Supabase
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    const restoreToken = hashParams.get('token'); // Pour la restauration de compte
    const errorParam = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    // Cas 1: Un utilisateur DÉJÀ authentifié atterrit sur cette page avec un lien de récupération.
    // C'est illogique, on le redirige vers son tableau de bord.
    if (user && type === 'recovery' && accessToken) {
      showNotification("Vous êtes déjà connecté.", 'success');
      onNavigate('dashboard');
      return;
    }

    if (type === 'recovery' && accessToken) {
      // L'utilisateur vient de cliquer sur le lien de réinitialisation de mot de passe.
      // La présence de l'access_token dans l'URL suffit à autoriser la mise à jour.
      setMode('reset');
      setShowUpdatePasswordForm(true);
      setMessage("Veuillez définir votre nouveau mot de passe.");
    } else if (errorParam && errorDescription && errorDescription.includes('expired')) {
      // --- NOUVELLE GESTION D'ERREUR ---
      // L'utilisateur a cliqué sur un lien expiré ou invalide.
      setMode('reset'); // On affiche le formulaire "Mot de passe oublié"
      setShowUpdatePasswordForm(false); // On s'assure que le formulaire de nouveau mdp n'est pas montré
      setError("Le lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.");
      // Nettoie l'URL pour enlever les paramètres d'erreur et éviter que le message ne reste après un rafraîchissement.
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (type === 'restore_account' && restoreToken) {
      // --- NOUVELLE LOGIQUE DE RESTAURATION ---
      const restoreAccount = async () => {
        setLoading(true);
        try {
          // Utiliser la fonction du contexte
          const { error } = await restoreUser(restoreToken);
          if (error) throw error;
          // S'assurer que setNotification est bien une fonction
          showNotification('Votre compte a été restauré avec succès ! Vous pouvez maintenant vous connecter.', 'success');
          setMode('signIn'); // Prépare le formulaire pour la connexion
        } catch {
          setError("Le lien de restauration est invalide ou a expiré.");
        } finally {
          setLoading(false);
        }
      };
      restoreAccount();
      window.history.replaceState({}, document.title, window.location.pathname); // Nettoie l'URL
    }
  }, [user, showNotification, restoreUser, onNavigate]); // Mettre à jour les dépendances

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'signIn') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      
      } else if (mode === 'signUp') {
        // --- VALIDATION SUPPLÉMENTAIRE ---
        if (password !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        if (!prenom.trim()) {
            throw new Error("Veuillez renseigner votre prénom.");
        }
        // --- APPEL MIS À JOUR ---
        const { error } = await signUp(email, password, prenom); 
        if (error) throw error;
        setMessage("Compte créé ! Veuillez vérifier votre boîte de réception pour confirmer votre e-mail.");
      
      } else if (mode === 'reset') {
        // Si nous sommes en mode reset mais que le formulaire de mise à jour n'est pas affiché,
        // cela signifie que l'utilisateur vient de demander l'e-mail de réinitialisation.
        if (!showUpdatePasswordForm) {
          const { data, error: functionError } = await resetPassword(email); // Ceci appelle la Edge Function
          if (functionError) {
            // Gère les erreurs réseau ou autres erreurs inattendues
            throw functionError;
          }
          // Analyser la réponse de la fonction
          if (data?.status === 'ACCOUNT_DELETED') {
            setError("ACCOUNT_DELETED");
          } else {
            setMessage("Si un compte existe avec cet e-mail, un lien de restauration ou de réinitialisation a été envoyé.");
          }
        } else {
          // C'est la mise à jour réelle du mot de passe après avoir cliqué sur le lien de l'e-mail
          if (password.length < 6) throw new Error("Le mot de passe doit faire au moins 6 caractères.");
          if (password !== confirmPassword) throw new Error("Les mots de passe ne correspondent pas.");
          const { error } = await updatePassword(password); // Ceci appelle la fonction updatePassword de useAuth
          if (error) throw error;
          
          // S'assurer que setNotification est bien une fonction
          showNotification('Mot de passe mis à jour avec succès !', 'success');
          // Le mot de passe est mis à jour, la session est maintenant valide. On redirige
          // l'utilisateur vers le tableau de bord, ce qui finalise son authentification.
          onNavigate('/ai-assistant');
        }
      }
    } catch (error) {
      setError(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRestore = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await requestRestore(email);
      if (error) throw error;
      setMessage("Si un compte supprimé correspond à cet e-mail, un lien de restauration a été envoyé.");
    } catch (error) {
      setError(error.message);
    } finally { setLoading(false); }
  };
  const getTitle = () => {
    if (mode === 'signIn') return "Connexion";
    if (mode === 'signUp') return "Créer un compte";
    if (mode === 'reset' && showUpdatePasswordForm) return "Définir un nouveau mot de passe";
    if (mode === 'reset') return "Mot de passe oublié";
  };
  
  // Réinitialise les champs lors du changement de mode
  const switchMode = (newMode) => {
      setMode(newMode);
      setError(''); // Réinitialise l'erreur
      setMessage('');
      setPassword('');
      setConfirmPassword('');
      setAcceptedTerms(false);
      setPrenom('');
      setShowUpdatePasswordForm(false); // Réinitialise cet état lors du changement de mode
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{getTitle()}</h1>
      
      {mode !== 'signIn' && !showUpdatePasswordForm && ( // Affiche le bouton "Retour" seulement si pas en mode "définir nouveau mot de passe"
        <button 
          onClick={() => switchMode('signIn')}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          &larr; Retour à la connexion
        </button>
      )}
      
      {onBack && mode === 'signIn' && (
         <button onClick={onBack} className="mb-4 text-sm text-blue-600 hover:underline">&larr; Retour à l'analyse</button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* --- CHAMP PRÉNOM (Mode Inscription uniquement) --- */}
        {mode === 'signUp' && (
           <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* Le champ E-mail est maintenant caché en mode mise à jour de mot de passe */}
        {!showUpdatePasswordForm && (
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        )}

        {(mode !== 'reset' || showUpdatePasswordForm) && ( // Affiche le mot de passe pour connexion, inscription ou mise à jour
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        )}

        {/* --- CHAMP CONFIRMATION (Mode Inscription ou Mise à jour du mot de passe) --- */}
        {(mode === 'signUp' || showUpdatePasswordForm) && ( // Affiche la confirmation pour inscription ou mise à jour
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        )}

        {mode === 'signUp' && (
            <div className="flex items-center">
                <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    J'ai lu et j'accepte les{" "}
                    <button type="button" onClick={() => onNavigate('/terms')} className="text-blue-600 hover:underline cursor-pointer">
                        Conditions Générales d'Utilisation
                    </button>
                    .
                </label>
            </div>
        )}

        {message && <p className="text-green-600 font-semibold text-center">{message}</p>}
        {error && (
            <div className="text-red-600 font-semibold text-center">
                {error === 'ACCOUNT_DELETED' ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                         <p>Ce compte a été désactivé.</p>
                         <p className="text-sm">
                             Si vous souhaitez le réactiver, cliquez sur le bouton ci-dessous pour recevoir un e-mail de restauration.
                         </p>
                         <button
                            type="button"
                            onClick={handleRequestRestore}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 disabled:bg-orange-300"
                         >
                            {loading ? 'Envoi...' : 'Restaurer mon compte'}
                         </button>
                    </div>
                ) : (
                    <p>{error}</p>
                )}
            </div>
        )}

        <button
          type="submit"
          disabled={loading || (mode === 'signUp' && !acceptedTerms)}
          className={`w-full text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 ${
            showUpdatePasswordForm 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Chargement...' : getTitle()}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        {mode === 'signIn' && !user && (
          <>
            <p>
              Pas de compte ?{' '}
              <button onClick={() => switchMode('signUp')} className="text-blue-600 hover:underline font-medium">
                Inscrivez-vous
              </button>
            </p>
            <p className="mt-2">
              <button onClick={() => switchMode('reset')} className="text-gray-500 hover:underline">
                Mot de passe oublié ?
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;