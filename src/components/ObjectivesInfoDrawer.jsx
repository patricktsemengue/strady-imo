import React from 'react';
import BottomSheetDrawer from './BottomSheetDrawer';

const objectives = [
    {
        title: "Vue d'ensemble",
        description: "Affiche toutes les métriques clés pour une analyse complète du projet. Idéal pour avoir une vision globale de la performance et des coûts."
    },
    {
        title: "Machine à Cash",
        description: "Met en avant le flux de trésorerie (cash-flow) pour évaluer le revenu passif généré chaque mois. Parfait si votre objectif principal est de générer un revenu complémentaire régulier."
    },
    {
        title: "Rentabilité",
        description: "Se concentre sur les rendements (Rendement Net, CoC) pour mesurer la performance de l'investissement par rapport aux capitaux engagés. Utile pour comparer l'efficacité de différents projets."
    },
    {
        title: "Coût de l'Achat",
        description: "Détaille les coûts principaux (mensualité du crédit, apport personnel) pour comprendre l'effort financier nécessaire à l'acquisition. Essentiel pour évaluer la faisabilité du projet selon votre budget."
    }
];

const ObjectivesInfoDrawer = ({ isOpen, onClose }) => {
    const modalFooter = (
        <div className="flex justify-end">
            <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Fermer</button>
        </div>
    );

    return (
        <BottomSheetDrawer isOpen={isOpen} onClose={onClose} title="Les Objectifs d'Analyse" footer={modalFooter}>
            <div className="space-y-4 text-sm">
                <p className="text-gray-600">
                    Les objectifs vous permettent de filtrer les résultats pour vous concentrer sur les indicateurs qui comptent le plus pour vous.
                </p>
                {objectives.map((obj, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-gray-800">{obj.title}</h4>
                        <p className="text-gray-600 mt-1">{obj.description}</p>
                    </div>
                ))}
            </div>
        </BottomSheetDrawer>
    );
};
export default ObjectivesInfoDrawer;
