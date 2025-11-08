import React from 'react';

const KnowledgePage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Base de Connaissances sur l'Investissement Locatif</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
        <div className="prose max-w-none text-gray-700 space-y-6">

            {/* --- PHASE 1 : LE MARCHÉ --- */}
            <h2 className="text-xl font-semibold">Chapitre 1 : Étude du Marché</h2>
            <p>L'objectif de cette phase est de comprendre les tendances générales, le cadre légal et les zones porteuses en Belgique avant même de chercher des biens.</p>
            <h3 className="text-lg font-semibold">1.1. Étude Démographique et Économique</h3>
            <p>Comprendre qui sont les locataires potentiels et quelle est leur santé financière. Sources : Statbel, IWEPS. Indicateurs : croissance démographique, structure de la population, pôles d'attractivité, revenu médian.</p>
            <h3 className="text-lg font-semibold">1.2. Tendances du Marché Immobilier</h3>
            <p>Sources : Baromètre des notaires, Statbel. Indicateurs : prix de vente moyen au m², prix de location moyen, taux de vacance locative.</p>
            <h3 className="text-lg font-semibold">1.3. Emplacement : Analyse Micro (Ville/Quartier)</h3>
            <p>Une fois une ou plusieurs villes cibles identifiées, il faut zoomer sur les quartiers. Analysez la proximité des services (transports, commerces, écoles), la qualité de vie et le profil des locataires.</p>

            {/* --- PHASE 2 : LE PROJET --- */}
            <h2 className="text-xl font-semibold">Chapitre 2 : Le Projet et sa Visite</h2>
            <h3 className="text-lg font-semibold">2.1. Type de projet : Achat, Rénovation, Construction</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">2.2. La Visite du bien</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">2.3. Check-list des Travaux</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">2.4. Conformité Urbanistique</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">2.5. Le PEB et la Conformité pour la Location</h3>
            <p>...</p>

            {/* --- PHASE 3 : LE FINANCEMENT --- */}
            <h2 className="text-xl font-semibold">Chapitre 3 : Le Financement</h2>
            <h3 className="text-lg font-semibold">3.1. Montage du dossier de crédit</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">3.2. Rôle du Notaire et Visite</h3>
            <p>...</p>

            {/* --- PHASE 4 : L'EXPLOITATION --- */}
            <h2 className="text-xl font-semibold">Chapitre 4 : L'Exploitation Locative</h2>
            <h3 className="text-lg font-semibold">4.1. Type de location : Classique, Co-living, Courte durée</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">4.2. Choix de la mise en location</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">4.3. Choix des locataires</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">4.4. Charges d'Exploitation</h3>
            <p>...</p>

            {/* --- PHASE 5 : LA FISCALITÉ --- */}
            <h2 className="text-xl font-semibold">Chapitre 5 : La Fiscalité</h2>
            <h3 className="text-lg font-semibold">5.1. Fiscalité en personne physique</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">5.2. Fiscalité en société</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">5.3. Risque de requalification en revenu professionnel</h3>
            <p>...</p>

            {/* --- PHASE 6 : LA SORTIE --- */}
            <h2 className="text-xl font-semibold">Chapitre 6 : La Revente</h2>
            <h3 className="text-lg font-semibold">6.1. Stratégie de revente et plus-value</h3>
            <p>...</p>
            <h3 className="text-lg font-semibold">6.2. Taxes à la revente</h3>
            <p>...</p>

            {/* --- PHASE 7 : LES INDICATEURS --- */}
            <h2 className="text-xl font-semibold">Chapitre 7 : Indicateurs Clés</h2>
            <h3 className="text-lg font-semibold">7.1. Rendement et Effort de trésorerie</h3>
            <p>...</p>
            <ul className="list-disc list-inside">
                <li><strong>Rendement Brut (%)</strong> = (Loyer Annuel Brut / Coût Total) x 100</li>
                <li><strong>Rendement Net (%)</strong> = ((Loyer Annuel Brut - Charges Annuelles) / Coût Total) x 100</li>
                <li><strong>Cash-Flow Mensuel (€)</strong> = (Loyer Mensuel - Charges Mensuelles) - Mensualité du Crédit</li>
            </ul>

            {/* --- Guide Tension Locative --- */}
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-blue-700">Annexe : Comment évaluer objectivement la tension locative ?</h3>
                <p className="mt-2">C'est un travail de détective qui repose sur des données concrètes. Voici une méthodologie en 3 étapes :</p>
                <h4 className="font-semibold mt-3">Étape 1 : Analyse des Annonces en Ligne</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Vitesse de location :</strong> Le critère le plus important. Combien de temps une annonce reste-t-elle en ligne ?
                        <ul className="list-circle list-inside pl-4 mt-1 text-sm">
                            <li>&lt; 7 jours : Tension Extrêmement Haute (Score 9-10/10)</li>
                            <li>7-15 jours : Tension Forte (Score 7-8/10)</li>
                            <li>15-30 jours : Tension Correcte (Score 5-6/10)</li>
                            <li>&gt; 1 mois : Tension Faible (Score 3-4/10)</li>
                        </ul>
                    </li>
                    <li><strong>Volume de la concurrence :</strong> Combien de biens similaires sont disponibles ?</li>
                </ul>
                <h4 className="font-semibold mt-3">Étape 2 : Validation sur le Terrain et Humaine</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Questionnez les agents immobiliers.</strong></li>
                    <li><strong>Observez lors des visites.</strong></li>
                </ul>
                <h4 className="font-semibold mt-3">Étape 3 : Analyse du Contexte</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Pôles d'attraction, démographie, projets d'urbanisme.</strong></li>
                </ul>
            </div>
        </div>
    </div>
);

export default KnowledgePage;