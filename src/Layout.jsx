import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo'; 
import { PrintIcon, UserIcon } from './Icons';
import { useAuth } from './hooks/useAuth';
import { useModal } from './contexts/useModal';
import FabMenu from './components/FabMenu';
import AppFooter from './components/AppFooter';
import Copyright from './Copyright';

const Layout = ({ children, handleNewProject }) => {
    const { user } = useAuth();
    const { setIsProfileModalOpen } = useModal();
    const location = useLocation();
    const page = location.pathname.substring(1) || 'main';
    const isAIAssistantPage = location.pathname === '/ai-assistant';
    const isAuthPage = location.pathname === '/auth';

    if (isAIAssistantPage ) {
       return <>{children}</>;
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-10 print-hidden">
                <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                    <Link to="/">
                        <Logo />
                    </Link>
                    {user && (
                        <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Accéder à mon profil">
                            <UserIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Mon Profil</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
                {children}
                <p>&nbsp;</p>
                <div className="text-center pb-2 pt-1">
                    <Copyright />
                </div>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </main>

            {user && page === 'view-analysis' && (
                <button
                    onClick={() => window.print()}
                    className="absolute bottom-full right-24 mb-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 z-30 transform hover:scale-110 print-hidden"
                    title="Imprimer le rapport"
                >
                    <PrintIcon />
                </button>
            )}
            {!isAIAssistantPage && !isAuthPage &&
            <AppFooter user={user} onProfileClick={() => setIsProfileModalOpen(true)} />
            }
        </div>
    );
};

export default Layout;
