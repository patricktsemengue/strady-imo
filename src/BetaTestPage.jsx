import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './hooks/useAuth';

const BetaTestPage = ({ onBack, setNotification }) => {
    const { user } = useAuth();
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [featureArea, setFeatureArea] = useState('analyse');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Veuillez décrire votre retour en détail.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const { error: dbError } = await supabase
            .from('feedbacks')
            .insert({
                user_id: user.id,
                comment: comment,
                feedback_type: feedbackType,
                feature_area: featureArea,
                user_email: user.email,
                user_name: user.user_metadata?.prenom || '',
                created_at: new Date().toISOString()
            });

        if (dbError) {
            setError(`Erreur lors de l'envoi: ${dbError.message}`);
            setIsSubmitting(false);
        } else {
            setSuccess(true);
            setNotification({ msg: 'Votre retour a bien été envoyé. Merci !', type: 'success' });
            setTimeout(() => onBack(), 2000); // Retour automatique après 2s
        }
    };

    if (success) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Merci pour votre contribution !</h1>
                <p className="text-gray-700">Vous allez être redirigé...</p>
            </div>
        );
    }

    const renderRadioGroup = (state, setState, options, title) => (
        <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">{title}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setState(opt.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${state === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Formulaire Bêta-Test</h1>
            <p className="text-gray-600 mb-6">Votre avis est précieux. Utilisez ce formulaire pour signaler un bug, suggérer une amélioration ou poser une question.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                {renderRadioGroup(feedbackType, setFeedbackType, [
                    { value: 'suggestion', label: '💡 Suggestion' },
                    { value: 'bug', label: '🐞 Bug' },
                    { value: 'question', label: '❓ Question' },
                    { value: 'other', label: 'Autre' }
                ], 'Type de retour')}

                {renderRadioGroup(featureArea, setFeatureArea, [
                    { value: 'analyse', label: 'Formulaire d\'Analyse' },
                    { value: 'dashboard', label: 'Dashboard' },
                    { value: 'ia_assistant', label: 'Assistant IA' },
                    { value: 'account', label: 'Profil & Compte' },
                    { value: 'other', label: 'Autre' }
                ], 'Partie de l\'application concernée')}

                <div>
                    <label htmlFor="comment" className="block text-lg font-medium text-gray-700">Description détaillée</label>
                    <p className="text-sm text-gray-500 mb-2">Si c'est un bug, décrivez les étapes pour le reproduire. Si c'est une suggestion, expliquez le besoin que cela résoudrait.</p>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="6"
                        className="mt-1 w-full p-2 border rounded-md"
                        placeholder="Soyez aussi précis que possible..."
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon retour'}
                </button>
            </form>
        </div>
    );
};

export default BetaTestPage;