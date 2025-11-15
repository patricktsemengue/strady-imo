import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';

const cacheDuration = import.meta.env.VITE_STRADY_CACHE_DURATION_HOURS;

const WelcomeHandler = ({ user, children }) => {
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = React.useState(() => {
        const expiry = localStorage.getItem('welcomeExpiry');
        if (!expiry) return true;
        return parseInt(expiry) < Date.now();
    });

    const handleStart = (destination = '/') => {
        const newExpiry = Date.now() + (cacheDuration * 60 * 60 * 1000);
        localStorage.setItem('welcomeExpiry', newExpiry);
        setShowWelcome(false);
        navigate(destination);
    };

    if (showWelcome) {
        return <WelcomePage onStart={handleStart} onNavigate={navigate} user={user} />;
    }

    return <>{children}</>;
};

export default WelcomeHandler;
