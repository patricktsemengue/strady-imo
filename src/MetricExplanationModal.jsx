import React from 'react';

const MetricExplanationModal = ({ isOpen, onClose, metric }) => {
    const explanations = {
        rendementNet: {
            title: "Rendement Net",
            explanation: "Mesure la rentabilité intrinsèque du bien avant financement. Il prend en compte les loyers et les charges d'exploitation, mais exclut le coût du crédit.",
            formula: "((Loyer Annuel - Charges) / Coût Total) x 100"
        },
        cashflow: {
            title: "Cash-Flow Mensuel",
            explanation: "Représente le bénéfice ou la perte mensuelle après déduction de toutes les charges (y compris le crédit) des revenus locatifs.",
            formula: "Loyer Mensuel - Charges - Mensualité Crédit"
        },
        cashOnCash: { // Corrected from coc to cashOnCash
            title: "CoC Return (Cash-on-Cash)",
            explanation: "Mesure le rendement de vos fonds propres investis (votre apport). C'est le ratio entre le cash-flow annuel et votre apport personnel.",
            formula: "(Cash-Flow Annuel / Apport) x 100"
        },
        score: {
            title: "Score Strady",
            description: "Évalue la rapidité à laquelle le cash-flow net généré permet de reconstituer l'apport personnel. Un score 'A' indique un retour sur apport en moins de 5 ans.",
            formula: "Basé sur le CoC Return"
        },
        mensualiteCredit: {
            title: "Mensualité du Crédit",
            explanation: "C'est le montant que vous remboursez chaque mois à la banque pour votre prêt hypothécaire. Il comprend le capital et les intérêts.",
            formula: null
        },
        coutTotal: {
            title: "Coût Total du Projet",
            explanation: "C'est la somme de tous les coûts liés à l'acquisition du bien : le prix d'achat, les frais d'acquisition (droits d'enregistrement, notaire), le coût des travaux et les autres frais annexes.",
            formula: "Prix d'Achat + Coût Travaux + Frais d'Acquisition + Frais Annexes"
        }
    };

    const content = explanations[metric] || { title: 'Information', explanation: 'Aucune explication disponible pour cet indicateur.', formula: null };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className={`bg-white rounded-t-2xl sm:rounded-lg shadow-xl p-6 w-full max-w-full sm:max-w-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} sm:translate-y-0`} onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                <p className="text-gray-700 mb-4">{content.explanation}</p>
                {content.formula && (
                    <div className="bg-gray-100 p-3 rounded-md text-center">
                        <p className="text-sm font-semibold">Formule :</p>
                        <p className="text-sm font-mono">{content.formula}</p>
                    </div>
                )}
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default MetricExplanationModal;
