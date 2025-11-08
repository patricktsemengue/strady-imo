import React from 'react';

const HelpHubPage = ({ onNavigate }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Centre d'Aide</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carte pour le Manuel Utilisateur */}
            <div onClick={() => onNavigate('user-manual')} className="p-6 border rounded-lg hover:shadow-lg hover:border-blue-400 transition cursor-pointer">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Manuel Utilisateur & FAQ</h2>
                <p className="text-gray-600">
                    Apprenez à utiliser le simulateur, à comprendre les différentes sections et à tirer le meilleur parti de l'assistant IA.
                </p>
            </div>

            {/* Carte pour la Base de Connaissances */}
            <div onClick={() => onNavigate('knowledge')} className="p-6 border rounded-lg hover:shadow-lg hover:border-green-400 transition cursor-pointer">
                <h2 className="text-xl font-semibold text-green-700 mb-2">Base de Connaissances</h2>
                <p className="text-gray-600">
                    Plongez dans notre guide complet sur l'investissement immobilier en Belgique, de l'étude de marché à la fiscalité.
                </p>
            </div>
        </div>
    </div>
);

export default HelpHubPage;