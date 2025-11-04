import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Notre hook
import { Logo } from './App'; // Importer le Logo depuis App.jsx

const AuthPage = ({ onBack }) => {
  const [mode, setMode] = useState('signIn'); // 'signIn', 'signUp', 'reset'
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
  const { signIn, signUp, resetPassword } = useAuth();

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
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage("E-mail de réinitialisation envoyé. Veuillez vérifier votre boîte de réception.");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'signIn') return "Connexion";
    if (mode === 'signUp') return "Créer un compte";
    if (mode === 'reset') return "Mot de passe oublié";
  };
  
  // Réinitialise les champs lors du changement de mode
  const switchMode = (newMode) => {
      setMode(newMode);
      setError('');
      setMessage('');
      setPassword('');
      setConfirmPassword('');
      setPrenom('');
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{getTitle()}</h1>
      
      {mode !== 'signIn' && (
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

        {mode !== 'reset' && (
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

        {/* --- CHAMP CONFIRMATION (Mode Inscription uniquement) --- */}
        {mode === 'signUp' && (
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
                    <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => window.alert('Veuillez consulter les Conditions d\'Utilisation via le lien dans le pied de page.')}>
                        Conditions Générales d'Utilisation
                    </span>
                    .
                </label>
            </div>
        )}

        {message && <p className="text-green-600 font-semibold">{message}</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading || (mode === 'signUp' && !acceptedTerms)}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
        >
          {loading ? 'Chargement...' : getTitle()}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        {mode === 'signIn' && (
          <p>
            Pas de compte ?{' '}
            <button onClick={() => switchMode('signUp')} className="text-blue-600 hover:underline font-medium">
              Inscrivez-vous
            </button>
          </p>
        )}
        {mode === 'signIn' && (
           <p className="mt-2">
            <button onClick={() => switchMode('reset')} className="text-gray-500 hover:underline">
              Mot de passe oublié ?
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;