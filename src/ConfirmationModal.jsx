
import React, { useEffect } from 'react';
import BottomDrawerModal from './BottomDrawerModal';

// ---  Composant Modal de  Confirmation ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isLoading, confirmText = 'Confirmer', confirmDisabled = false, confirmButtonVariant = 'primary' }) => {
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Close the modal if the Escape key is pressed
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Add event listener only when the modal is open
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to remove the event listener
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]); // Rerun the effect if isOpen or onClose changes

    const confirmButtonStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    };

    const confirmButtonClasses = confirmButtonStyles[confirmButtonVariant] || confirmButtonStyles.primary;

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
                className={`font-bold py-2 px-6 rounded-lg disabled:cursor-not-allowed ${confirmButtonClasses}`}
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
