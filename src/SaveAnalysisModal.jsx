import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const SaveAnalysisModal = ({ isOpen, onClose, onSave, onUpdate, onSaveAsCopy, currentAnalysisId, projectName, setProjectName, error, setError }) => {
    if (!isOpen) return null;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose} 
            onConfirm={currentAnalysisId ? onUpdate : onSave}
            title={currentAnalysisId ? "Mettre à jour l'analyse" : "Sauvegarder l'analyse"}
            confirmText={currentAnalysisId ? "Mettre à jour" : "Sauvegarder"}
            confirmDisabled={!projectName.trim()}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du projet</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value);
                            if (error) setError('');
                        }}
                        className={`mt-1 w-full p-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                {currentAnalysisId &&
                    <button
                        onClick={onSaveAsCopy}
                        disabled={!projectName.trim()}
                        className="w-full text-center px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sauvegarder comme une copie
                    </button>
                }
            </div>
        </ConfirmationModal>
    );
};

export default SaveAnalysisModal;
