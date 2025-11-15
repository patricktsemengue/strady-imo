import React from 'react';
import { XIcon } from './Icons';

const BottomDrawerModal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-2xl' }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:items-center" 
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-t-lg md:rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col animate-slide-up md:animate-fade-in-scale`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 -mr-2">
                        <XIcon />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div className="overflow-y-auto flex-grow p-4 md:p-6 custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 md:p-6 border-t flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomDrawerModal;