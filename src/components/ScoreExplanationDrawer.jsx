import React from 'react';
import { scoreConfig } from '../config';
import BottomSheetDrawer from './BottomSheetDrawer';

const ScoreExplanationDrawer = ({ isOpen, onClose }) => {
    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
        if (grade.startsWith('B')) return 'bg-yellow-100 text-yellow-800';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
        if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const modalFooter = (
        <div className="flex justify-end">
            <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Fermer</button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Comprendre le Score Strady"
            footer={modalFooter}
        >
            <p className="text-gray-700 mb-6">
                Le score Strady évalue la rapidité à laquelle le cash-flow net généré par votre investissement permet de reconstituer votre apport personnel. Un score élevé indique un retour sur investissement plus rapide.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Score</th>
                            <th className="px-4 py-2">Années pour récupérer l'apport</th>
                            <th className="px-4 py-2">Équivalent en rendement (CoC)</th>
                            <th className="px-4 py-2">Commentaire</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {scoreConfig.cashflowScore.map(tier => (
                            <tr key={tier.grade} className={getGradeColor(tier.grade)}>
                                <td className="px-4 py-2 font-black text-lg">{tier.grade}</td>
                                <td className="px-4 py-2">{tier.maxYears === Infinity ? `> ${tier.minYears}` : `${tier.minYears} - ${tier.maxYears}`}</td>
                                <td className="px-4 py-2">{`> ${tier.cashOnCash}%`}</td>
                                <td className="px-4 py-2 text-xs">{tier.comment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </BottomSheetDrawer>
    );
};

export default ScoreExplanationDrawer;
