import React, { useState, useEffect } from 'react';

const AnimatedModal = ({ isOpen, onClose, children }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Use a short timeout to allow the component to mount before starting the animation.
            const timer = setTimeout(() => setIsAnimating(true), 10);
            return () => clearTimeout(timer);
        } else {
            // Reset animation state when closing.
            setIsAnimating(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className={`w-full transform transition-all duration-300 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default AnimatedModal;