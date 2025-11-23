import React, { useState } from 'react';
import BottomSheetDrawer from './BottomSheetDrawer';

const TensionLocativeEstimatorDrawer = ({ isOpen, onClose, onApply }) => {
    const [value, setValue] = useState(5);

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
                onClick={() => onApply(value)}
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
            title="Tension Locative"
            footer={footer}
        >
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
        </BottomSheetDrawer>
    );
};

export default TensionLocativeEstimatorDrawer;
