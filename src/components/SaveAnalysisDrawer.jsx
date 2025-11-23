import React from 'react';
import BottomSheetDrawer from './BottomSheetDrawer';

const SaveAnalysisDrawer = ({ isOpen, onClose, onSave, currentAnalysisId, projectName, setProjectName, error, setError }) => {
    if (!isOpen) return null;

    const handleConfirm = onSave;

    const handleProjectNameChange = (e) => {
        setProjectName(e.target.value);
        if (error) setError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && projectName.trim()) {
            handleConfirm();
        }
    };

    const footer = (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleConfirm}
                disabled={!projectName.trim()}
                className={`w-full font-bold py-3 px-6 rounded-lg disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700`}
            >
                Sauvegarder
            </button>
            <button
                onClick={onClose}
                className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
            >
                Annuler
            </button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Sauvegarder l'analyse"
            footer={footer}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du projet</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={handleProjectNameChange}
                        onKeyDown={handleKeyDown}
                        className={`mt-1 w-full p-2 border rounded-md ${error ? 'border-red-500' : ''}`}
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
            </div>
        </BottomSheetDrawer>
    );
};

export default SaveAnalysisDrawer;
