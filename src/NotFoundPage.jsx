import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import WelcomePage from './WelcomePage';

const NotFoundPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleStart = (destination) => {
        navigate(destination || '/');
    };

    return <WelcomePage onStart={handleStart} onNavigate={navigate} user={user} />;
};

export default NotFoundPage;
