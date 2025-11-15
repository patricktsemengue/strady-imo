import React, { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 3000); // Notification disappears after 3 seconds
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [message, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg flex items-center`}>
            <span>{message}</span>
            <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-4 font-bold">
                &times;
            </button>
        </div>
    );
};

export default Notification;
