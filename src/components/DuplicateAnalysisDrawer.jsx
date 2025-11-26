import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';

const DuplicateAnalysisDrawer = ({ isOpen, onClose, onConfirm, analysis }) => {
    const { t } = useTranslation();
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const MAX_LENGTH = 80;

    useEffect(() => {
        if (isOpen && analysis) {
            const originalName = analysis.project_name || analysis.data.projectName;
            setNewName(`${originalName}${t('copy_suffix')}`);
            setError('');
            setTimeout(() => inputRef.current?.select(), 100);
        }
    }, [isOpen, analysis, t]);

    const handleConfirm = () => {
        if (!newName.trim()) {
            setError(t('name_cannot_be_empty'));
            return;
        }
        onConfirm(analysis, newName.trim());
    };

    if (!isOpen) return null;

    const footer = (
        <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
            >
                {t('cancel')}
            </button>
            <button
                onClick={handleConfirm}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
            >
                {t('duplicate_and_save')}
            </button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={t('duplicate_analysis')}
            footer={footer}
        >
            <p className="mb-4 text-sm text-gray-600">{t('enter_new_name')}</p>
            <input ref={inputRef} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={MAX_LENGTH} className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`} />
            <div className="text-right text-xs text-gray-500 mt-1">{newName.length}/{MAX_LENGTH}</div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </BottomSheetDrawer>
    );
};

export default DuplicateAnalysisDrawer;
