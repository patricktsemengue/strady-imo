import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import ConfirmationModal from './ConfirmationModal';
import PlanCard from './PlanCard';

const PlansPage = ({ userPlan, onBack, setNotification, onNavigate }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserPlanId, setCurrentUserPlanId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Fetch all available plans
                const { data: plansData, error: plansError } = await supabase
                    .from('profile_plans')
                    .select('*')
                    .order('plan_price', { ascending: true });

                if (plansError) {
                    throw plansError;
                }
                setPlans(plansData);

                // If a user is logged in, fetch their current plan
                if (user) {
                    const { data: userPlanData, error: userPlanError } = await supabase
                        .from('user_profile_plans')
                        .select('plan_id')
                        .eq('user_id', user.id)
                        .single();

                    // PGRST116 means no row was found, which is fine.
                    if (userPlanError && userPlanError.code !== 'PGRST116') {
                        throw userPlanError;
                    }

                    if (userPlanData) {
                        setCurrentUserPlanId(userPlanData.plan_id);
                    }
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [user]);

    const handleSubscribe = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
        setHasAgreed(false); // Reset agreement state when modal opens
    };

    const handleConfirmSubscription = async () => {
        if (!selectedPlan || !user) return;

        setIsSubscribing(true);

        // --- NOUVELLE LOGIQUE DE GESTION DES CRÉDITS ---
        let newCreditCount = selectedPlan.ai_credits;
        let newResetDate = new Date().toISOString();

        // Si l'utilisateur avait déjà un plan et que ce n'était pas un plan illimité
        if (userPlan && userPlan.profile_plans.ai_credits !== -1) {
            const oldPlanTotalCredits = userPlan.profile_plans.ai_credits;
            const oldPlanRemainingCredits = userPlan.current_ai_credits;
            const creditsConsumed = oldPlanTotalCredits - oldPlanRemainingCredits;

            // Si le nouveau plan n'est pas illimité, on soustrait les crédits consommés
            if (selectedPlan.ai_credits !== -1) {
                newCreditCount = Math.max(0, selectedPlan.ai_credits - creditsConsumed);
            }
            // On conserve l'ancienne date de réinitialisation pour que le cycle ne soit pas remis à zéro
            newResetDate = userPlan.last_credit_reset_date;
        }
        // --- FIN DE LA NOUVELLE LOGIQUE ---

        try {
            const { error } = await supabase
                .from('user_profile_plans')
                .upsert({
                    user_id: user.id,
                    plan_id: selectedPlan.id,
                    current_ai_credits: newCreditCount,
                    last_credit_reset_date: newResetDate,
                }, { onConflict: 'user_id' });

            if (error) {
                throw error;
            }

            setCurrentUserPlanId(selectedPlan.id);
            setNotification({ msg: `Félicitations ! Vous êtes maintenant abonné au plan ${selectedPlan.plan_name}. Profitez pleinement de l'application !`, type: 'success' });
            setTimeout(() => setNotification({ msg: '', type: '' }), 6000);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubscribing(false);
            setIsModalOpen(false);
            setSelectedPlan(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Plans</h1>
            <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={plan.id === currentUserPlanId}
                        onSubscribe={handleSubscribe}
                    />
                ))}
            </div>
            {isModalOpen && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmSubscription}
                    isLoading={isSubscribing}
                    title={`Confirmer l'abonnement au plan ${selectedPlan?.plan_name}`}
                    confirmText="Confirmer et payer"
                    confirmDisabled={!hasAgreed}
                >
                    <p className="mb-4">Vous êtes sur le point de souscrire au plan <strong>{selectedPlan?.plan_name}</strong>.</p>
                    <div className="p-4 bg-gray-50 border rounded-lg">
                        <label htmlFor="terms-agree" className="flex items-start gap-3 cursor-pointer">
                            <input
                                id="terms-agree"
                                type="checkbox"
                                checked={hasAgreed}
                                onChange={(e) => setHasAgreed(e.target.checked)}
                                className="h-5 w-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Je confirme avoir lu et accepté les <button type="button" onClick={() => onNavigate('terms')} className="text-blue-600 underline">Conditions Générales d'Utilisation</button>. Je comprends qu'en confirmant, je conclus un contrat et que, conformément à la législation européenne et belge, je dispose d'un droit de rétractation de 14 jours.</span>
                        </label>
                    </div>
                </ConfirmationModal>
            )}
        </div>
    );
};

export default PlansPage;