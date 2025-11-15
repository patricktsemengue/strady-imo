import React, { useState, useEffect } from 'react';

const VacancyEstimatorModal = ({ isOpen, onClose, onApply, currentTension }) => {
    const [vacancy, setVacancy] = useState(8);

    useEffect(() => {
        if (currentTension) {
            const calculatedVacancy = Math.max(2, 12 - currentTension);
            setVacancy(calculatedVacancy);
        }
    }, [currentTension, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Estimateur de Vacance Locative</h2>
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
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
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
            </div>
        </div>
    );
};

export default VacancyEstimatorModal;
