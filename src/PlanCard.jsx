import React from 'react';

const PlanCard = ({ plan, isCurrentPlan, onSubscribe }) => {
    const isUsageBased = plan.plan_payment_periodicity === 'usage-based';
    const isMostPopular = plan.is_most_popular;

    return (
        <div className={`relative border rounded-lg p-6 flex flex-col transition-all ${isCurrentPlan ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-200'}`}>
            {isMostPopular && (
                <div className="absolute top-0 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-lg whitespace-nowrap" style={{ animation: 'pulse-badge 2.5s ease-in-out infinite' }}>
                    Le plus populaire
                </div>
            )}
            <h2 className="text-xl font-bold">{plan.plan_name}</h2>
            {plan.description && <p className="text-sm text-gray-500 mt-1 mb-4 h-10">{plan.description}</p>}
            {isUsageBased ? (
                <div className="my-4">
                    <p className="text-2xl font-bold">Sur devis</p>
                    <p className="text-sm text-gray-500">Plan de paiement personnalisé</p>
                </div>
            ) : (
                <p className="text-3xl font-bold my-4">
                    {plan.plan_price === 0 ? 'Free' : `${plan.plan_price / 100} €`}
                    <span className="text-sm font-normal"> / {plan.plan_payment_periodicity}</span>
                </p>
            )}
            <ul className="space-y-2 text-gray-600 mb-6">
                <li>{plan.ai_credits === -1 ? 'Unlimited' : `${plan.ai_credits}`} AI assistant prompts</li>
                <li>{plan.stored_analysis === -1 ? 'Unlimited' : `${plan.stored_analysis}`} stored analyses</li>
            </ul>
            {isUsageBased ? (
                <a
                    href="mailto:contact@strady.imo?subject=Demande%20de%20devis%20pour%20le%20plan%20Professionnel"
                    className="mt-auto w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Nous contacter
                </a>
            ) : (
                <button
                    onClick={() => onSubscribe(plan)}
                    disabled={isCurrentPlan}
                    className="mt-auto w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
                </button>
            )}
        </div>
    );
};

export default PlanCard;