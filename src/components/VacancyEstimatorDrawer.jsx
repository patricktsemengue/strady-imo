import React, { useState, useEffect } from 'react';
import BottomSheetDrawer from './BottomSheetDrawer';

const VacancyEstimatorDrawer = ({ isOpen, onClose, onApply, currentTension }) => {
    const [vacancy, setVacancy] = useState(8);

    useEffect(() => {
        if (currentTension) {
            const calculatedVacancy = Math.max(2, 12 - currentTension);
            setVacancy(calculatedVacancy);
        }
    }, [currentTension, isOpen]);

    if (!isOpen) return null;

    const footer = (
        <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
            >
                Annuler
            </button>
            <button
                onClick={() => onApply(vacancy)}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
            >
                Appliquer
            </button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Estimateur de Vacance Locative"
            footer={footer}
        >
            <p className="text-gray-700 mb-6">
                Basé sur une tension locative de <strong>{currentTension}/10</strong>, nous suggérons un taux de vacance de <strong>{vacancy}%</strong>.
            </p>
            <div className="flex items-center justify-center space-x-4">
                <input
                    type="range"
                    min="0"
                    max="25"
                    value={vacancy}
                    onChange={(e) => setVacancy(e.target.value)}
                    className="w-full"
                />
                <span className="text-2xl font-bold">{vacancy}%</span>
            </div>
        </BottomSheetDrawer>
    );
};

export default VacancyEstimatorDrawer;
