import React from 'react';

const UserManualPage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manuel Utilisateur</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
        <div className="prose max-w-none text-gray-700 space-y-6">

            <h2 className="text-xl font-semibold">1. Section "Bien Immobilier"</h2>
            <p>
                C'est ici que vous décrivez les caractéristiques principales du bien que vous analysez. Renseignez le type de bien, le score PEB, la surface, le revenu cadastral et l'adresse. Ces informations sont cruciales pour la suite des calculs.
            </p>

            <h2 className="text-xl font-semibold">2. Assistant Immobilier IA</h2>
            <p>
                Pour gagner du temps, collez le texte d'une annonce immobilière ou son URL dans le champ prévu. Choisissez ensuite une action (comme "Extraire la description") et cliquez sur "Interroger l'IA". L'assistant remplira automatiquement les champs du formulaire pour vous. Vous pouvez ensuite sauvegarder sa réponse dans vos notes.
            </p>

            <h2 className="text-xl font-semibold">3. Section "Financement"</h2>
            <p>
                Cette section est dédiée au montage financier de votre projet. Indiquez le prix d'achat, le coût estimé des travaux et les frais. Vous pouvez utiliser les calculateurs intégrés pour vous aider.
            </p>
            <p>
                La <strong>quotité d'emprunt</strong> permet de calculer automatiquement votre apport. Si vous préférez, vous pouvez entrer votre apport manuellement, ce qui passera la quotité en mode "custom".
            </p>

            <h2 className="text-xl font-semibold">4. Section "Loyer et Charge"</h2>
            <p>
                Ici, vous estimez le potentiel locatif du bien. Renseignez le loyer mensuel que vous espérez percevoir et les charges d'exploitation mensuelles (assurance, précompte, entretien, etc.). Le calculateur de charges est là pour vous aider à ne rien oublier.
            </p>

            <h2 className="text-xl font-semibold">5. Évaluation et Résultats</h2>
            <p>
                Une fois tous les champs remplis, cliquez sur le bouton <strong>"Évaluer le Projet"</strong>. La section des résultats apparaîtra, vous donnant un score de rentabilité (de A à E), le rendement net, le cash-flow mensuel et d'autres indicateurs clés pour vous aider à prendre une décision éclairée.
            </p>

            <h2 className="text-xl font-semibold">6. Sauvegarde et Gestion</h2>
            <p>
                Si vous êtes connecté, vous pouvez sauvegarder votre analyse en cliquant sur le bouton "Sauvegarder". Toutes vos analyses sont accessibles depuis l'onglet "Mes analyses" dans la barre de navigation inférieure.
            </p>

        </div>
    </div>
);

export default UserManualPage;