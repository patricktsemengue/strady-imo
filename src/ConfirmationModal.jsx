
import React from 'react';

// ---  Composant Modal de  Confirmation ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isLoading, confirmText = 'Confirmer', confirmDisabled = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="text-gray-700 mb-6">
                    {children}
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading || confirmDisabled}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Chargement...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
