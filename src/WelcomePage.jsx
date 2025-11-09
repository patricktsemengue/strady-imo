import React from 'react';
import { Logo } from './App'; // On importe le Logo depuis App.jsx

const WelcomePage = ({ onStart, onNavigate, user }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-100 animate-fade-in">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
            <Logo />
            <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2">
                {user?.user_metadata?.prenom
                    ? `Hey ${user.user_metadata.prenom} !`
                    : "Bienvenue sur Strady.imo !"}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                {user?.user_metadata?.prenom
                    ? "Ravi de vous revoir. Prêt à analyser votre prochain investissement ?"
                    : "Votre copilote pour l'investissement locatif en Belgique."
                }
            </p>
            <div className="text-left space-y-3 mb-8">
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Analysez</strong> la rentabilité d'un bien (score, rendement, cash-flow).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Estimez</strong> vos coûts (travaux, frais d'acquisition, charges).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Évaluez</strong> le marché (tension locative, loyers).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Gagnez du temps</strong> avec notre assistant IA pour extraire les données d'une annonce.</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Sauvegardez & Synchronisez</strong> vos analyses en créant un compte.</span></p>
            </div>
            <p className="text-gray-600 mb-8 italic">
                Prêt à transformer vos intuitions en décisions chiffrées ? Bonne utilisation !
            </p>
            <div className="flex flex-col gap-4 mb-8">
                <button
                    onClick={onStart}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
                >
                    Commencer une analyse
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">En continuant, vous confirmez avoir lu et accepté notre <button onClick={() => onNavigate('terms')} className="underline">Conditions d'Utilisation</button> et notre <button onClick={() => onNavigate('privacy')} className="underline">Politique de Confidentialité</button>.</p>
        </div>
    </div>
);

export default WelcomePage;