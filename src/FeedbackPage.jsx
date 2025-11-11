import React, { useState, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { feedbackQuestionsConfig } from './feedbackConfig.js'; // Importer la configuration

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info text-gray-400 group-hover:text-blue-500">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
);

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 12 }) => (
    <svg
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`cursor-pointer h-${size} w-${size} transition-all duration-200 hover:scale-125 ${
            filled 
            ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)]' 
            : 'text-amber-500'
        }`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Tooltip = ({ text, children }) => (
    <div className="relative flex items-center group">
        {children}
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {text}
        </div>
    </div>
);

const FeedbackPage = ({ onBack, setNotification }) => {
    const { user } = useAuth();
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [featureArea, setFeatureArea] = useState('analyse_bien');
    const [comment, setComment] = useState('');
    const [dynamicAnswers, setDynamicAnswers] = useState({}); // Pour les réponses aux questions dynamiques
    const [starHint, setStarHint] = useState(''); // Pour l'infobulle des étoiles
    const [hoverRating, setHoverRating] = useState(0); // Pour l'effet de survol des étoiles
    const [rating, setRating] = useState(0); // Nouvel état pour la note
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Veuillez laisser un commentaire pour nous aider à comprendre votre retour.'); // Le commentaire est obligatoire
            return;
        }

        setIsSubmitting(true);
        setError('');

        const { error: dbError } = await supabase
            .from('feedbacks')
            .insert({
                user_id: user.id,
                comment: comment,
                rating: rating || null, // Envoie la note
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

    const starHints = ['Pas terrible', 'Moyen', 'Bon', 'Très bon', 'Excellent !'];
    const handleStarEnter = (index) => {
        setHoverRating(index);
        setStarHint(starHints[index - 1]);
    };
    const handleStarLeave = () => {
        setHoverRating(0);
        setStarHint('');
    };


    
    // Détermine quelles questions afficher en fonction du type de feedback
    const questionsToShow = useMemo(() => {
        // Priorité aux questions spécifiques à la fonctionnalité, sinon questions génériques
        const specificQuestions = feedbackQuestionsConfig[featureArea]?.[feedbackType];
        const genericQuestions = feedbackQuestionsConfig.generic[feedbackType];
        return specificQuestions || genericQuestions || [];
    }, [feedbackType, featureArea]);

    const handleDynamicAnswerChange = (id, value) => {
        setDynamicAnswers(prev => ({ ...prev, [id]: value }));
    };

    // Concatène les réponses dynamiques au commentaire principal
    const fullComment = useMemo(() => {
        const dynamicPart = questionsToShow.map(q => `${q.question}\n${dynamicAnswers[q.id] || 'Non répondu'}`).join('\n\n');
        return `${comment}\n\n--- Réponses au sondage ---\n${dynamicPart}`;
    }, [comment, dynamicAnswers, questionsToShow]);

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
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-lg font-medium text-gray-700">{title}</label>
                <Tooltip text="Choisir une catégorie nous aide à mieux comprendre et traiter votre retour.">
                    <InfoIcon />
                </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setState(opt.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${state === opt.value ? 'bg-blue-600 text-white border-blue-600 shadow-inner' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Feedback & Support</h1>
            <p className="text-gray-600 mb-6">Votre avis est précieux. Signalez un bug, suggérez une amélioration ou posez une question.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Quelle note donneriez-vous à l'application ?</label>
                    <div className="flex justify-center space-x-2" onMouseLeave={handleStarLeave}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                filled={star <= (hoverRating || rating)}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => handleStarEnter(star)}
                            />
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2 h-5 transition-opacity duration-300" style={{ opacity: starHint ? 1 : 0 }}>{starHint || ' '}</p>
                </div>

                {renderRadioGroup(feedbackType, setFeedbackType, [
                    { value: 'suggestion', label: '💡 Suggestion' },
                    { value: 'bug', label: '🐞 Bug' },
                    { value: 'question', label: '❓ Question' },
                    { value: 'other', label: 'Autre' }
                ], 'Type de retour')}

                {renderRadioGroup(featureArea, setFeatureArea, [
                    { value: 'analyse_bien', label: 'Analyse - Infos du Bien' },
                    { value: 'analyse_financement', label: 'Analyse - Financement' },
                    { value: 'analyse_loyer', label: 'Analyse - Loyer & Charges' },
                    { value: 'analyse_resultats', label: 'Analyse - Résultats & Score' },
                    { value: 'dashboard', label: 'Dashboard' },
                    { value: 'rapport', label: 'Rapport d\'Analyse' },
                    { value: 'ia_assistant', label: 'Assistant IA' },
                    { value: 'account', label: 'Profil & Compte' },
                ], 'Partie de l\'application concernée')}

                {/* --- Section de questions dynamiques --- */}
                {questionsToShow.length > 0 && (
                    <div className="space-y-4 p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-semibold text-gray-800">Quelques questions pour mieux comprendre :</h3>
                        {questionsToShow.map(q => (
                            <div key={q.id}>
                                <label htmlFor={q.id} className="block text-sm font-medium text-gray-700">{q.question}</label>
                                {q.type === 'textarea' ? (
                                    <textarea id={q.id} value={dynamicAnswers[q.id] || ''} onChange={(e) => handleDynamicAnswerChange(q.id, e.target.value)} rows="3" className="mt-1 w-full p-2 border rounded-md" placeholder={q.placeholder}></textarea>
                                ) : q.type === 'select' ? (
                                    <select id={q.id} value={dynamicAnswers[q.id] || ''} onChange={(e) => handleDynamicAnswerChange(q.id, e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                                        <option value="">-- Choisir --</option>
                                        {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" id={q.id} value={dynamicAnswers[q.id] || ''} onChange={(e) => handleDynamicAnswerChange(q.id, e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder={q.placeholder} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <label htmlFor="comment" className="block text-lg font-medium text-gray-700">Commentaire général</label>
                    <p className="text-sm text-gray-500 mb-2">
                        {rating > 3 ? "Qu'est-ce que vous avez particulièrement apprécié ?" : rating > 0 ? "Qu'est-ce qui pourrait être amélioré ?" : "Laissez un commentaire général ici."}
                    </p>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
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

export default FeedbackPage;