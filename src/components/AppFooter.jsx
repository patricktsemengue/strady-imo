import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, DashboardIcon,  UserIcon, SparklesIcon, HelpIcon } from '../Icons';

const NavItem = ({ to, icon, label, page, activeCondition }) => (
    <Link
        to={to}
        className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${activeCondition(page) ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-purple-600'}`}
    >
        {icon}
        <span className="hidden sm:inline text-xs sm:text-sm font-medium">{label}</span>
    </Link>
);

const AppFooter = ({ user, onProfileClick, isAIAssistantPage = false }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const page = isAIAssistantPage ? 'ai-assistant' : (location.pathname.substring(1) || 'main');

    return (
        <footer className={`bg-white/90 backdrop-blur-sm border-t-2 shadow-top ${isAIAssistantPage ? '' : 'fixed'} bottom-0 left-0 right-0 z-50 print-hidden`}>
            <nav className="max-w-4xl mx-auto flex justify-around p-2">
                {user && <NavItem to="/ai-assistant" icon={<SparklesIcon />} label={t('ai_assistant')} page={page} activeCondition={p => p === 'ai-assistant'} />}
                <NavItem to="/" icon={<HomeIcon />} label={t('analysis')} page={page} activeCondition={p => p === 'main'} />
                {user ? <NavItem to="/dashboard" icon={<DashboardIcon />} label={t('my_analyses')} page={page} activeCondition={p => p === 'dashboard'} /> : (
                    <NavItem to="/auth" icon={<UserIcon />} label={t('login')} page={page} activeCondition={p => p === 'auth'} />
                )}
            </nav>            
        </footer>
    );
};

export default AppFooter;