import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { PlusIcon, HomeIcon, DashboardIcon, HelpIcon, UserIcon, SparklesIcon, PrintIcon } from './Icons';
import { useAuth } from './hooks/useAuth';
import Copyright from './Copyright';
import { useModal } from './contexts/useModal';

const Layout = ({ children, handleNewProject }) => {
    const { user } = useAuth();
    const { setIsProfileModalOpen, setIsAiAssistantModalOpen } = useModal();
    const location = useLocation();
    const page = location.pathname.substring(1) || 'main';

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-10 print-hidden">
                <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                    <Link to="/">
                        <Logo />
                    </Link>
                    {/* Vous pouvez ajouter d'autres éléments de header ici si nécessaire */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
                {children}
            </main>

            <footer className="bg-white/90 backdrop-blur-sm border-t-2 shadow-top sticky bottom-0 left-0 right-0 z-20 print-hidden">
                {user && ['main', 'dashboard', 'view-analysis'].includes(page) && (
                    <button
                        onClick={handleNewProject}
                        className="absolute bottom-full right-6 mb-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:bg-amber-500 transition-all duration-300 z-30 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-400/50 print-hidden"
                        title="Nouvelle analyse"
                    >
                        <PlusIcon />
                    </button>
                )}
                {user && page === 'main' && (
                    <button
                        onClick={() => setIsAiAssistantModalOpen(true)}
                        className="absolute bottom-full right-6 mb-20 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 active:bg-blue-600 transition-all duration-300 z-30 transform hover:scale-110 hover:shadow-xl hover:shadow-orange-400/50"
                        title="Assistant IA"
                    >
                        <SparklesIcon />
                    </button>
                )}
                {user && page === 'view-analysis' && (
                    <button
                        onClick={() => window.print()}
                        className="absolute bottom-full right-6 mb-20 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 z-30 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-400/50 print-hidden"
                        title="Imprimer le rapport"
                    >
                        <PrintIcon />
                    </button>
                )}

                <nav className="max-w-4xl mx-auto flex justify-around p-2">
                    <Link to="/" className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${page === 'main' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}>
                        <HomeIcon />
                        <span className="hidden sm:inline text-xs sm:text-sm font-medium">Analyse</span>
                    </Link>
                    {user && (
                        <Link to="/dashboard" className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${page === 'dashboard' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}>
                            <DashboardIcon />
                            <span className="hidden sm:inline text-xs sm:text-sm font-medium">Mes analyses</span>
                        </Link>
                    )}
                    <Link to="/aide" className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${page === 'aide' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}>
                        <HelpIcon />
                        <span className="hidden sm:inline text-xs sm:text-sm font-medium">Aide</span>
                    </Link>
                    {user ? (
                        <button onClick={() => setIsProfileModalOpen(true)} className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${['account', 'plans', 'feedback'].includes(page) ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}>
                            <UserIcon />
                            <span className="hidden sm:inline text-xs sm:text-sm font-medium">{user.user_metadata?.prenom ? `Hey ${user.user_metadata.prenom} !` : 'Profil'}</span>
                        </button>
                    ) : (
                        <Link to="/auth" className={`flex flex-col sm:flex-row items-center justify-center w-20 sm:w-auto h-16 sm:h-12 gap-1 sm:gap-2 p-2 sm:px-4 rounded-lg transition-colors duration-200 ${page === 'auth' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}>
                            <UserIcon />
                            <span className="hidden sm:inline text-xs sm:text-sm font-medium">Connexion</span>
                        </Link>
                    )}
                </nav>
                <div className="text-center pb-2 pt-1">
                    <Copyright />
                </div>
            </footer>
        </div>
    );
};

export default Layout;
