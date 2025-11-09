import React from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const StarIcon = ({ filled, onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer text-yellow-500">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const FeedbackPage = ({ onBack }) => {
    const { user } = useAuth();
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Veuillez sélectionner une note.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const { error: dbError } = await supabase
            .from('feedbacks')
            .insert({
                user_id: user.id,
                rating: rating,
                comment: comment,
                user_email: user.email,
                user_name: user.user_metadata?.prenom || '',
                created_at: new Date().toISOString()
            });

        if (dbError) {
            setError(`Erreur lors de l'envoi: ${dbError.message}`);
            setIsSubmitting(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Merci !</h1>
                <p className="text-gray-700 mb-6">Votre feedback a bien été envoyé. J'apprécie que vous preniez le temps de m'aider à améliorer l'application.</p>
                <button onClick={onBack} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour à l'application</button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Donner mon avis</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Quelle note donneriez-vous à l'application ?</label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <StarIcon key={star} filled={star <= rating} onClick={() => setRating(star)} />
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-lg font-medium text-gray-700">Avez-vous des suggestions ou des commentaires ?</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="5"
                        className="mt-1 w-full p-2 border rounded-md"
                        placeholder="Dites-moi ce que vous pensez..."
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300">
                        {isSubmitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackPage;
