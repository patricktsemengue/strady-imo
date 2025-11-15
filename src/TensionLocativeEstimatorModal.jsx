import React, { useState } from 'react';

const TensionLocativeEstimatorModal = ({ isOpen, onClose, onApply }) => {
    const [value, setValue] = useState(5);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Tension Locative</h2>
                <p className="text-gray-700 mb-6">
                    Sur une échelle de 1 à 10, à quel point le marché locatif est-il tendu dans cette zone ?
                </p>
                <div className="flex items-center justify-center space-x-4">
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full"
                    />
                    <span className="text-2xl font-bold">{value}</span>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => onApply(value)}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
                    >
                        Appliquer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TensionLocativeEstimatorModal;
