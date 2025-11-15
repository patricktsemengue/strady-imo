import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const SaveAnalysisModal = ({ isOpen, onClose, onSave, onUpdate, currentAnalysisId, projectName, setProjectName, error, setError }) => {
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
                {currentAnalysisId && (
                    <div className="text-sm text-gray-600">
                        <p>Vous êtes sur le point de mettre à jour l'analyse existante.</p>
                        <p>Pour sauvegarder une nouvelle copie, changez le nom du projet.</p>
                    </div>
                )}
            </div>
        </ConfirmationModal>
    );
};

export default SaveAnalysisModal;
