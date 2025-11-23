import React from 'react';
import { XIcon } from '../Icons';

const BottomSheetDrawer = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-60 flex items-end justify-center"
            onClick={onClose}
        >
            <div
                className={`bg-gray-50 rounded-t-2xl shadow-2xl w-full max-w-xl max-h-[calc(100vh-70px-60px)] flex flex-col transform transition-all duration-300 ease-in-out mt-[70px] mb-[60px] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle */}
                <div className="w-full flex justify-center py-3 cursor-pointer" onClick={onClose}>
                    <div className="w-16 h-1.5 bg-[#003722] rounded-full transition-colors duration-200 hover:bg-orange-500" />
                </div>

                {/* Header */}
                {/*
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <XIcon />
                    </button>
                </div>
                */}
                {/* Content (Scrollable) */}
                <div className="overflow-y-auto flex-grow p-6 custom-scrollbar">
                    <div className="h-full">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomSheetDrawer;
