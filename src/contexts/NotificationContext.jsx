import React, { createContext, useState } from 'react';
import Notification from "../Notification.jsx";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ msg: '', type: '' });

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
    };

    const hideNotification = () => {
        setNotification({ msg: '', type: '' });
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Notification message={notification.msg} type={notification.type} onClose={hideNotification} />
        </NotificationContext.Provider>
    );
};
