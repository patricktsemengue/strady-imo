
import React from 'react';
import BottomDrawerModal from './BottomDrawerModal';

// ---  Composant Modal de  Confirmation ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isLoading, confirmText = 'Confirmer', confirmDisabled = false }) => {
    const modalFooter = (
        <div className="flex justify-end gap-3">
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
    );

    return (
        <BottomDrawerModal isOpen={isOpen} onClose={onClose} title={title} footer={modalFooter}>
            <div className="text-gray-700">{children}</div>
        </BottomDrawerModal>
    );
};

export default ConfirmationModal;
