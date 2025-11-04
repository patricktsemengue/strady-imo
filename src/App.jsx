import React from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage';
import { prePromptConfig } from './config.js';
import FeedbackPage from './FeedbackPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsOfServicePage from './TermsOfServicePage';

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

// --- Icônes SVG pour une interface plus propre ---
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-text"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /><path d="M6 8h2" /><path d="M6 12h2" /><path d="M16 8h2" /><path d="M16 12h2" /></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
);
const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);
const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><line x1="16" x2="12" y1="14" y2="14" /><line x1="12" x2="12" y1="14" y2="18" /><line x1="12" x2="8" y1="10" y2="10" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="12" x2="12" y1="10" y2="10" /></svg>
);
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);
const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent"><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
);
const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
);
const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);
const BrainCircuitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.993.119c.044.835.43 1.616.993 2.162m5.993-.119a3 3 0 1 1 5.993.119c-.044.835-.43 1.616-.993 2.162" /><path d="M12 12a3 3 0 1 0-5.993.119c.044.835.43 1.616.993 2.162m5.993-.119a3 3 0 1 1 5.993.119c-.044.835-.43 1.616-.993 2.162" /><path d="M12 19a3 3 0 1 0-5.993.119c.044.835.43 1.616.993 2.162m5.993-.119a3 3 0 1 1 5.993.119c-.044.835-.43 1.616-.993 2.162" /><path d="M14.5 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z" /><path d="M9.5 4.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" /><path d="M14.5 11.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z" /><path d="M9.5 11.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" /><path d="M14.5 18.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z" /><path d="M9.5 18.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" /><path d="M20 12h-2" /><path d="M6 12H4" /><path d="m14 15.5-.5.8" /><path d="m10.5 16.3.5-.8" /><path d="m14 8.5-.5-.8" /><path d="m10.5 7.7.5.8" /></svg>
);

// env
const cacheDuration = import.meta.env.VITE_STRADY_CACHE_DURATION_HOURS;
//const maxAnalyses = import.meta.env.VITE_STRADY_MAX_ANALYZES;
const apiKey = import.meta.env.STRADY_GEMINI_API_KEY;

// --- Composant Logo ---
export const Logo = () => (
    <div className="logo">
        <i><span className="logo-s">S</span><span className="logo-trady">trady</span><span className="logo-dot"> . </span><span className="logo-imo">imo</span>
        </i>
    </div>
);

// Fonction utilitaire pour les calculs de financement
const calculateFinances = (data) => {
    const coutTotal = (data.prixAchat || 0) + (data.coutTravaux || 0) + (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
    const aFinancer = coutTotal - (data.apport || 0);
    const tauxMensuel = (data.tauxCredit || 0) / 100 / 12;
    const nbMensualites = (data.dureeCredit || 0) * 12;
    const mensualite = aFinancer > 0 && nbMensualites > 0 ? (aFinancer * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) / (Math.pow(1 + tauxMensuel, nbMensualites) - 1) : 0;

    return {
        coutTotalProjet: coutTotal,
        montantAFinancer: aFinancer,
        mensualiteEstimee: mensualite
    };
};

// --- Composant pour la page d'aide (Protocole) ---
const HelpPage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Protocole d'Aide à la Décision</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour à l'analyse</button>
        <div className="prose max-w-none text-gray-700 space-y-4">
            {/* --- PHASE 1 --- */}
            <h2 className="text-xl font-semibold">Phase 1 : Analyse Macro du Marché Wallon</h2>
            <p>L'objectif de cette phase est de comprendre les tendances générales, le cadre légal et les zones porteuses en Wallonie avant même de chercher des biens.</p>
            <h3 className="text-lg font-semibold">1.1. Étude Démographique et Économique</h3>
            <p>Comprendre qui sont les locataires potentiels et quelle est leur santé financière. Sources : Statbel, IWEPS. Indicateurs : croissance démographique, structure de la population, pôles d'attractivité, revenu médian.</p>
            <h3 className="text-lg font-semibold">1.2. Tendances du Marché Immobilier</h3>
            <p>Sources : Baromètre des notaires, Statbel. Indicateurs : prix de vente moyen au m², prix de location moyen, taux de vacance locative.</p>
            <h3 className="text-lg font-semibold">1.3. Analyse Réglementaire</h3>
            <p>Sources : spw.wallonie.be. Points de vigilance : bail d'habitation wallon, normes PEB, CoDT (urbanisme), fiscalité.</p>

            {/* --- PHASE 2 --- */}
            <h2 className="text-xl font-semibold mt-6">Phase 2 : Analyse Micro du Marché Local (Ville/Quartier)</h2>
            <p>Une fois une ou plusieurs villes cibles identifiées, il faut zoomer sur les quartiers.</p>
            <h3 className="text-lg font-semibold">2.1. Analyse de l'Attractivité du Quartier</h3>
            <p>Proximité des services (transports, commerces, écoles), qualité de vie, profil des locataires.</p>
            <h3 className="text-lg font-semibold">2.2. Analyse de la Concurrence et des Loyers</h3>
            <p>Source : Immoweb, ImmoVlan. Méthodologie : répertorier les biens en location pendant 2-4 semaines pour calculer le loyer moyen au m² par type de bien et estimer la tension locative.</p>

            {/* --- Guide Tension Locative --- */}
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-blue-700">Comment évaluer objectivement la tension locative ?</h3>
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

            {/* --- Guide Vacance Locative --- */}
            <div className="p-4 bg-gray-50 rounded-lg border mt-4">
                <h3 className="text-lg font-semibold text-blue-700">Comment estimer objectivement la vacance locative ?</h3>
                <p className="mt-2">La vacance locative est la période où votre bien est vide. Son estimation dépend directement de la tension locative.</p>
                <p className="font-mono text-sm my-2">Formule : (% vacance) = (Jours de vacance / 365) * 100</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>
                        <strong>Tension Élevée (8-10/10) :</strong> Vous relouez très vite.
                        <br /><span className="text-sm">Estimation : 10-17 jours de vacance &rarr; <strong>3% à 5%</strong>.</span>
                    </li>
                    <li>
                        <strong>Tension Moyenne (5-7/10) :</strong> La "règle du mois de loyer" s'applique.
                        <br /><span className="text-sm">Estimation : 22-30 jours de vacance &rarr; <strong>7% à 9%</strong>.</span>
                    </li>
                    <li>
                        <strong>Tension Faible (1-4/10) :</strong> Soyez pessimiste, le risque est réel.
                        <br /><span className="text-sm">Estimation : 40-55 jours de vacance &rarr; <strong>10% à 15%</strong>.</span>
                    </li>
                </ul>
            </div>

            {/* --- PHASE 3 --- */}
            <h2 className="text-xl font-semibold mt-6">Phase 3 : Fiche d'Évaluation du Bien Visité</h2>
            <p>C'est le cœur de votre aide à la décision. Une checklist à utiliser lors de chaque visite.</p>
            <h3 className="text-lg font-semibold">3.1. Informations Générales & 3.2. Évaluation Technique</h3>
            <p>Relever l'adresse, prix, RC, charges de copro, PEB, état du gros œuvre, électricité, plomberie, chauffage, isolation.</p>
            <h3 className="text-lg font-semibold">3.3. Estimation des Coûts par Projet</h3>
            <p>Estimer le budget pour un "Rafraîchissement" (5-15k€), une "Rénovation" (30-70k€+), ou un achat "Clé sur porte" (travaux nuls).</p>
            <h3 className="text-lg font-semibold">3.4. Potentiel par Type de Location</h3>
            <p>Évaluer l'adéquation pour une location classique, une colocation (taille des chambres, SDB) ou une courte durée (règlementation, tourisme).</p>

            {/* --- PHASE 4 --- */}
            <h2 className="text-xl font-semibold mt-6">Phase 4 : Simulateur de Rentabilité</h2>
            <p>Calculer le coût total d'acquisition, simuler les revenus et charges, et calculer les indicateurs clés.</p>
            <ul className="list-disc list-inside">
                <li><strong>Rendement Brut (%)</strong> = (Loyer Annuel Brute / Coût Total) x 100</li>
                <li><strong>Rendement Net (%)</strong> = ((Loyer Annuel Brut - Charges Annuelles) / Coût Total) x 100</li>
                <li><strong>Cash-Flow Mensuel (€)</strong> = (Loyer Mensuel - Charges Mensuelles) - Mensualité du Crédit</li>
            </ul>
        </div>
    </div>
);

// --- Composant pour la page des paramètres (version lue depuis .env) ---
const SettingsPage = ({ onBack, maxAnalyses }) => {
    // const SettingsPage = ({ onBack }) => {
    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Paramètres</h1>
            <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour à l'analyse</button>
            <div className="space-y-4 text-gray-700">
                <p className="p-3 bg-gray-100 rounded-md border">
                    <strong>Clé API Gemini:</strong> Configurée de manière sécurisée sur le serveur.
                </p>
                <p className="p-3 bg-gray-100 rounded-md border">
                    <strong>Durée du Cache de Bienvenue:</strong> {cacheDuration || 'N/A'} heures
                </p>
                <p className="p-3 bg-gray-100 rounded-md border">
                    <strong>Nombre maximum d'analyses:</strong> {maxAnalyses || 'N/A'}
                </p>
                <p className="mt-6 text-sm text-gray-500 italic">
                    Ces paramètres sont définis dans le fichier <code>.env</code> (pour le local) ou dans les variables d'environnement de Netlify (en production).
                </p>
            </div>
        </div>
    );
};


// --- Composant pour la page Dashboard ---
const DashboardPage = ({ analyses, onLoad, onDelete, onBack, maxAnalyses }) => {
    const emptySlotsCount = maxAnalyses > analyses.length ? maxAnalyses - analyses.length : 0;
    const emptySlots = Array.from({ length: emptySlotsCount });

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes Analyses</h1>
            <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Continuer &rarr;</button>
            <div className="space-y-4">
                {analyses.length === 0 && emptySlotsCount === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucune analyse sauvegardée. Augmentez la limite dans les paramètres pour en ajouter.</p>
                )}
                {analyses.map(analysis => (
                    <div key={analysis.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-grow">
                            <h2 className="font-bold text-lg">{analysis.data.projectName}</h2>
                            <p className="text-sm text-gray-600">{analysis.data.ville}</p>
                            {analysis.result && (
                                <div className={`mt-2 text-sm font-semibold p-2 rounded-md inline-block ${analysis.result.grade === 'A' ? 'bg-green-100 text-green-800' : analysis.result.grade === 'B' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    Score: {analysis.result.grade} ({analysis.result.score}/100) - Renta. Net: {analysis.result.rendementNet}%
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                            <button onClick={() => onLoad(analysis.id)} className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">Charger</button>
                            <button onClick={() => onDelete(analysis.id)} className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">Supprimer</button>
                        </div>
                    </div>
                ))}
                {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} className="p-8 border-2 border-dashed rounded-lg flex justify-center items-center text-gray-400">
                        <p>Emplacement d'analyse vide</p>
                    </div>
                ))}
                {analyses.length >= maxAnalyses && maxAnalyses > 0 && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-center items-center text-red-600 font-semibold text-center">
                        <p>Vous ne pouvez plus sauvegarder de nouvelle analyse. La limite de {maxAnalyses} est atteinte.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Modals d'estimation (Travaux, Tension, Vacance, Charges, Frais d'acquisition) ---
const RenovationEstimatorModal = ({ isOpen, onClose, onApply }) => {
    const [items, setItems] = React.useState([{ id: Date.now(), object: 'Cuisine', type: 'Rénovation complète', cost: 8000 }]);
    const [tempValue, setTempValue] = React.useState(null); // State for onFocus/onBlur

    const addItem = () => setItems([...items, { id: Date.now(), object: '', type: '', cost: 0 }]);
    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id !== id) return item;

            if (field === 'cost') {
                if (value === '') {
                    return { ...item, cost: '' };
                }
                return { ...item, cost: parseFloat(String(value).replace(/\s/g, '')) || 0 };
            }
            return { ...item, [field]: value };
        }));
    };

    const handleCostFocus = (id, cost) => {
        setTempValue({ id, cost });
        updateItem(id, 'cost', '');
    };

    const handleCostBlur = (id) => {
        const item = items.find(i => i.id === id);
        if (item && item.cost === '' && tempValue && tempValue.id === id) {
            updateItem(id, 'cost', tempValue.cost);
        }
        setTempValue(null);
    };

    const totalCost = React.useMemo(() => items.reduce((total, item) => total + (item.cost || 0), 0), [items]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Estimation Flexible des Travaux</h2>
                <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                    {items.map((item, index) => (
                        <div key={item.id} className="p-3 border rounded-lg grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                            <div className="md:col-span-2"><label className="text-sm font-medium">Objet {index + 1}</label><input type="text" placeholder="Ex: Chambre 1" value={item.object} onChange={(e) => updateItem(item.id, 'object', e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium">Type</label><input type="text" placeholder="Ex: Peinture + Sols" value={item.type} onChange={(e) => updateItem(item.id, 'type', e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium">Coût (€)</label>
                                <input
                                    type="number"
                                    placeholder="1500"
                                    value={item.cost}
                                    onChange={(e) => updateItem(item.id, 'cost', e.target.value)}
                                    onFocus={() => handleCostFocus(item.id, item.cost)}
                                    onBlur={() => handleCostBlur(item.id)}
                                    className="mt-1 w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="text-right md:pt-6"><button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"><TrashIcon /></button></div>
                        </div>
                    ))}
                    <button onClick={addItem} className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 border-blue-400"><PlusCircleIcon /> Ajouter une ligne</button>
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="text-right mb-4"><span className="text-lg font-medium">Coût total (TVA incl.):</span><span className="text-2xl font-bold text-blue-600 ml-2">{Math.round(totalCost).toLocaleString('fr-BE')} €</span></div>
                    <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(Math.round(totalCost))} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
                </div>
            </div>
        </div>
    );
};

const TensionLocativeEstimatorModal = ({ isOpen, onClose, onApply }) => {
    const [vitesse, setVitesse] = React.useState(3);
    const [concurrence, setConcurrence] = React.useState(1);
    const [feedback, setFeedback] = React.useState(1);
    const [contexte, setContexte] = React.useState(1);
    const optionsVitesse = [{ label: '> 2 mois', value: 0 }, { label: '> 1 mois', value: 1 }, { label: '15-30 jours', value: 2 }, { label: '7-15 jours', value: 3 }, { label: '< 7 jours', value: 4 }];
    const optionsConcurrence = [{ label: '> 8 biens', value: 0 }, { label: '4-8 biens', value: 1 }, { label: '0-3 biens', value: 2 }];
    const optionsFeedback = [{ label: 'Faible demande', value: 0 }, { label: 'Demande correcte', value: 1 }, { label: 'Forte demande', value: 2 }];
    const optionsContexte = [{ label: 'Peu attractif', value: 0 }, { label: 'Stable / Neutre', value: 1 }, { label: 'Très attractif / Croissance', value: 2 }];
    const totalScore = React.useMemo(() => vitesse + concurrence + feedback + contexte, [vitesse, concurrence, feedback, contexte]);

    if (!isOpen) return null;

    const renderRadioGroup = (title, description, options, state, setState) => (
        <div className="py-4 border-b"><h4 className="font-semibold text-lg">{title}</h4><p className="text-sm text-gray-500 mb-3">{description}</p><div className="flex flex-wrap gap-2">{options.map(opt => (<button key={opt.value} onClick={() => setState(opt.value)} className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${state === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{opt.label}</button>))}</div></div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Aide à l'évaluation de la Tension Locative</h2>
                <div className="overflow-y-auto flex-grow pr-2">
                    {renderRadioGroup('1. Vitesse de location', 'Combien de temps un bien similaire reste-t-il en ligne ?', optionsVitesse, vitesse, setVitesse)}
                    {renderRadioGroup('2. Volume de la concurrence', 'Combien de biens similaires sont en location ?', optionsConcurrence, concurrence, setConcurrence)}
                    {renderRadioGroup('3. Feedback du terrain', 'Quel est le retour des agents immobiliers ?', optionsFeedback, feedback, setFeedback)}
                    {renderRadioGroup('4. Contexte de la zone', 'La zone est-elle attractive et en croissance ?', optionsContexte, contexte, setContexte)}
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="text-center mb-4"><span className="text-lg font-medium">Score Estimé:</span><div className="text-5xl font-bold text-blue-600 mt-1">{totalScore} / 10</div></div>
                    <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(totalScore)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
                </div>
            </div>
        </div>
    );
};

const VacancyEstimatorModal = ({ isOpen, onClose, onApply, currentTension }) => {
    const getSuggestion = () => {
        if (currentTension >= 8) return { range: "3% - 5%", value: 4, label: "Tension Élevée", color: "text-green-600" };
        if (currentTension >= 5) return { range: "7% - 9%", value: 8, label: "Tension Moyenne", color: "text-yellow-600" };
        return { range: "10% - 15%", value: 12, label: "Tension Faible", color: "text-red-600" };
    };
    const suggestion = getSuggestion();
    const [vacancy, setVacancy] = React.useState(suggestion.value);

    React.useEffect(() => {
        setVacancy(getSuggestion().value);
    }, [currentTension]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Aide à l'estimation de la Vacance Locative</h2>
                <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <p className="text-sm text-gray-600">Basé sur votre score de tension locative de <strong className="text-blue-600">{currentTension}/10</strong> :</p>
                    <p className={`font-semibold text-lg ${suggestion.color}`}>{suggestion.label}</p>
                    <p className="text-gray-800">Une vacance locative de <strong>{suggestion.range}</strong> est une estimation prudente.</p>
                </div>
                <div className="my-6">
                    <label className="block text-center font-medium text-gray-700 mb-2">Ajustez la valeur si nécessaire :</label>
                    <div className="flex items-center gap-4">
                        <input type="range" min="0" max="25" value={vacancy} onChange={(e) => setVacancy(parseInt(e.target.value))} className="w-full range-slider-good-low" />
                        <div className="font-bold text-2xl text-blue-600 w-20 text-center p-2 border rounded-lg">{vacancy}%</div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button>
                    <button onClick={() => onApply(vacancy)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button>
                </div>
            </div>
        </div>
    );
};

const ChargesEstimatorModal = ({ isOpen, onClose, onApply }) => {
    const [items, setItems] = React.useState([
        { id: Date.now(), object: 'Assurance PNO', periodicity: 'An', price: 250 },
        { id: Date.now() + 1, object: 'Charges copropriété non-récup.', periodicity: 'Mois', price: 50 },
    ]);
    const addItem = () => setItems([...items, { id: Date.now(), object: '', periodicity: 'Mois', price: 0 }]);
    const removeItem = (id) => setItems(items.filter(item => item.id !== id));
    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: field === 'price' ? parseFloat(value) || 0 : value } : item
        ));
    };

    const totalMonthlyCost = React.useMemo(() => {
        return items.reduce((total, item) => {
            const monthlyPrice = item.periodicity === 'An' ? item.price / 12 : item.price;
            return total + monthlyPrice;
        }, 0);
    }, [items]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Estimation des Charges Mensuelles Non-Récupérables</h2>
                <div className="overflow-y-auto flex-grow pr-2 space-y-4">
                    {items.map((item, index) => (
                        <div key={item.id} className="p-3 border rounded-lg grid grid-cols-1 md:grid-cols-8 gap-3 items-center">
                            <div className="md:col-span-3"><label className="text-sm font-medium">Objet de la charge {index + 1}</label><input type="text" placeholder="Ex: Assurance PNO" value={item.object} onChange={(e) => updateItem(item.id, 'object', e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium">Périodicité</label><select value={item.periodicity} onChange={(e) => updateItem(item.id, 'periodicity', e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="Mois">Mois</option><option value="An">An</option></select></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium">Prix (€)</label><input type="number" placeholder="50" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} className="mt-1 w-full p-2 border rounded-md" /></div>
                            <div className="text-right md:pt-6"><button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"><TrashIcon /></button></div>
                        </div>
                    ))}
                    <button onClick={addItem} className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 border-blue-400"><PlusCircleIcon /> Ajouter une charge</button>
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="text-right mb-4"><span className="text-lg font-medium">Total Mensuel Estimé:</span><span className="text-2xl font-bold text-red-600 ml-2">{Math.round(totalMonthlyCost).toLocaleString('fr-BE')} € / mois</span></div>
                    <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(Math.round(totalMonthlyCost))} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
                </div>
            </div>
        </div>
    );
};

const AcquisitionFeesEstimatorModal = ({ isOpen, onClose, onApply, prixAchat }) => {
    const [region, setRegion] = React.useState('wallonie');
    const [age, setAge] = React.useState('existant');
    const [valeurTerrain, setValeurTerrain] = React.useState(prixAchat * 0.3);

    const calculatedFees = React.useMemo(() => {
        const calculateHonoraires = (base) => {
            if (base <= 0) return 0;
            // Simplified calculation based on common averages for properties between 100k and 300k
            return (base * 0.01) + 800;
        };

        let taxePrincipale = 0;
        const tauxRegional = region === 'flandre' ? 0.12 : 0.125;

        if (age === 'existant') {
            taxePrincipale = prixAchat * tauxRegional;
        } else {
            const valeurConstruction = prixAchat - valeurTerrain;
            if (valeurConstruction < 0) {
                return { error: "La valeur du terrain ne peut excéder le prix d'achat." };
            }
            const tvaConstruction = valeurConstruction * 0.21;
            const droitsTerrain = valeurTerrain * tauxRegional;
            taxePrincipale = tvaConstruction + droitsTerrain;
        }

        const honoraires = calculateHonoraires(prixAchat);
        const fraisAdmin = 1100; // Estimation forfaitaire
        const tvaSurFrais = (honoraires + fraisAdmin) * 0.21;
        const total = taxePrincipale + honoraires + fraisAdmin + tvaSurFrais;

        return {
            taxePrincipale: Math.round(taxePrincipale),
            honoraires: Math.round(honoraires),
            fraisAdmin: Math.round(fraisAdmin),
            tvaSurFrais: Math.round(tvaSurFrais),
            total: Math.round(total),
            error: null
        };

    }, [prixAchat, region, age, valeurTerrain]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Calculateur Détaillé des Frais d'Acquisition</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Région</label>
                            <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                                <option value="wallonie">Wallonie / Bruxelles</option>
                                <option value="flandre">Flandre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Âge du bien</label>
                            <select value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
                                <option value="existant">Existant (&gt; 2 ans)</option>
                                <option value="neuf">Neuf (&lt; 2 ans)</option>
                            </select>
                        </div>
                    </div>
                    {age === 'neuf' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valeur estimée du terrain (€)</label>
                            <input type="number" value={valeurTerrain} onChange={(e) => setValeurTerrain(parseFloat(e.target.value) || 0)} className="mt-1 w-full p-2 border rounded-md" />
                            {calculatedFees.error && <p className="text-red-500 text-sm mt-1">{calculatedFees.error}</p>}
                        </div>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t">
                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between"><span className="text-gray-600">{age === 'existant' ? 'Droits d\'enregistrement' : 'Taxe (TVA + Droits)'}:</span> <span>{calculatedFees.taxePrincipale.toLocaleString('fr-BE')} €</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Honoraires du notaire (est.):</span> <span>{calculatedFees.honoraires.toLocaleString('fr-BE')} €</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Frais administratifs (est.):</span> <span>{calculatedFees.fraisAdmin.toLocaleString('fr-BE')} €</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">TVA sur honoraires & frais:</span> <span>{calculatedFees.tvaSurFrais.toLocaleString('fr-BE')} €</span></div>
                    </div>
                    <div className="text-right mb-4 border-t pt-2">
                        <span className="text-lg font-medium">Total estimé:</span>
                        <span className="text-2xl font-bold text-blue-600 ml-2">{calculatedFees.total.toLocaleString('fr-BE')} €</span>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button>
                        <button onClick={() => onApply(calculatedFees.total)} disabled={!!calculatedFees.error} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">Appliquer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Composant Modal pour la sauvegarde ---
const SaveAnalysisModal = ({ isOpen, onClose, onSave, onUpdate, currentAnalysisId, projectName, setProjectName, error, setError }) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        setProjectName(e.target.value);
        if (error) {
            setError('');
        }
    }

    const isUpdateMode = currentAnalysisId !== null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{isUpdateMode ? "Mettre à jour ou Sauvegarder" : "Sauvegarder l'Analyse"}</h2>

                {isUpdateMode ? (
                    <p className="text-gray-600 mb-4">Cette analyse a été chargée. Voulez-vous la mettre à jour ou en créer une nouvelle copie ?</p>
                ) : (
                    <p className="text-gray-600 mb-4">Veuillez confirmer ou modifier le nom du projet avant de sauvegarder.</p>
                )}

                <div>
                    <label htmlFor="saveProjectName" className="block text-sm font-medium text-gray-700">Nom du Projet</label>
                    <input
                        type="text"
                        id="saveProjectName"
                        value={projectName}
                        onChange={handleChange}
                        className={`mt-1 w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button>
                    {isUpdateMode ? (
                        <>
                            <button onClick={onUpdate} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Mettre à jour</button>
                            <button onClick={onSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Sauvegarder comme copie</button>
                        </>
                    ) : (
                        <button onClick={onSave} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Confirmer</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ---  Composant Modal de  Confirmation ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="text-gray-700 mb-6">
                    {children}
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700"
                    >
                        Confirmer la suppression
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Composant Modal de Profil ---
const ProfileModal = ({ isOpen, onClose, onNavigate, onSignOut, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Profil</h2>
                    {user.user_metadata?.prenom && <p className="text-sm text-gray-500">Connecté en tant que {user.user_metadata.prenom}</p>}
                </div>
                <div className="p-2">
                    <button onClick={() => { onNavigate('account'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <SettingsIcon />
                        <span>Mon Compte</span>
                    </button>
                    <button onClick={() => { onNavigate('feedback'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <StarIcon />
                        <span>Donner mon avis</span>
                    </button>
                    <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                        <LogOutIcon />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Composant pour la page de bienvenue ---
const WelcomePage = ({ onStart, onNavigate }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-100 animate-fade-in">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
            <Logo />
            <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2">
                Bienvenue sur Strady.imo !
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                Votre copilote pour l'investissement locatif en Belgique.
            </p>
            <div className="text-left space-y-3 mb-8">
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Analysez</strong> la rentabilité d'un bien (score, rendement, cash-flow).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Estimez</strong> vos coûts (travaux, frais d'acquisition, charges).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Évaluez</strong> le marché (tension locative, loyers).</span></p>
                <p className="flex items-start"><span className="text-green-500 mr-3 mt-1 flex-shrink-0">✔️</span><span><strong>Sauvegardez & Synchronisez</strong> vos analyses en créant un compte.</span></p>
            </div>
            <p className="text-gray-600 mb-8 italic">
                Prêt à transformer vos intuitions en décisions chiffrées ? Bonne utilisation !
            </p>
            <button
                onClick={onStart}
                className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
            >
                Commencer l'analyse
            </button>
            <p className="text-xs text-gray-500 mt-4">En continuant, vous confirmez avoir lu et accepté notre <button onClick={() => onNavigate('terms')} className="underline">Conditions d'Utilisation</button> et notre <button onClick={() => onNavigate('privacy')} className="underline">Politique de Confidentialité</button>.</p>
        </div>
    </div>
);

// --- Composant principal de l'application ---
export default function App() {
    const [page, setPage] = React.useState('main');

    // Utilisation de notre Contexte d'Authentification
    const { user, signOut } = useAuth();

    const [showWelcome, setShowWelcome] = React.useState(() => {
        const expiry = localStorage.getItem('welcomeExpiry');
        if (!expiry) return true;
        return parseInt(expiry) < Date.now();
    });

    const initialDataState = {
        projectName: 'Nouveau Projet', prixAchat: 180000, coutTravaux: 15000, fraisAcquisition: 26100, fraisAnnexe: 2000, apport: 40000, tauxCredit: 3.5, dureeCredit: 25,
        ville: 'Namur',
        descriptionBien: '',// 'Appartement 2 chambres, bon état',
        typeBien: 'Appartement',
        surface: 85,
        peb: 'C',
        revenuCadastral: 1000,
        tensionLocative: 7, loyerEstime: 900, chargesMensuelles: 100, vacanceLocative: 8,
        quotite: 80,
    };

    const [data, setData] = React.useState(initialDataState);
    const [result, setResult] = React.useState(null);
    const [analyses, setAnalyses] = React.useState([]);
    const [isEstimatorOpen, setIsEstimatorOpen] = React.useState(false);
    const [isTensionEstimatorOpen, setIsTensionEstimatorOpen] = React.useState(false);
    const [isVacancyEstimatorOpen, setIsVacancyEstimatorOpen] = React.useState(false);
    const [isChargesEstimatorOpen, setIsChargesEstimatorOpen] = React.useState(false);
    const [isAcquisitionFeesEstimatorOpen, setIsAcquisitionFeesEstimatorOpen] = React.useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
    const [projectNameForSave, setProjectNameForSave] = React.useState('');
    const [saveError, setSaveError] = React.useState('');
    const [notification, setNotification] = React.useState({ msg: '', type: '' });
    const [maxAnalyses, setMaxAnalyses] = React.useState(() => {
        return parseInt(import.meta.env.VITE_STRADY_MAX_ANALYZES || '3', 10);
    });
    const [allSettingsConfigured, setAllSettingsConfigured] = React.useState(false);
    const [isDataLoading, setIsDataLoading] = React.useState(true);
    const [tempNumericValue, setTempNumericValue] = React.useState(null);
    const [currentAnalysisId, setCurrentAnalysisId] = React.useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
        const [analysisToDelete, setAnalysisToDelete] = React.useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

    const [showCookieBanner, setShowCookieBanner] = React.useState(() => {
        return !localStorage.getItem('cookie_consent');
    });

    const handleCookieConsent = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowCookieBanner(false);
    };

// --- Composant pour la bannière de cookies ---
const CookieBanner = ({ onAccept }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center z-50 animate-fade-in-up">
        <p className="text-sm mb-2 md:mb-0">Ce site utilise des cookies et le stockage local essentiels à son bon fonctionnement. En continuant, vous acceptez leur utilisation.</p>
        <button onClick={onAccept} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex-shrink-0">J'ai compris</button>
    </div>
);
    const typeBienOptions = ['Appartement', 'Maison', 'Immeuble', 'Commerce', 'Autre'];
    const pebOptions = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'N/C'];
    const dureeOptions = [15, 20, 25, 30];

    // ASSISTANT IA GÉNÉRAL
    const [geminiQuery, setGeminiQuery] = React.useState('');
    const [geminiResponse, setGeminiResponse] = React.useState('');
    const [isGeminiLoading, setIsGeminiLoading] = React.useState(false);
    const [geminiError, setGeminiError] = React.useState('');

    // Charger les données sauvegardées
    React.useEffect(() => {

        // Fonction pour charger les analyses depuis Supabase
        const loadAnalysesFromCloud = async (userId) => {
            setIsDataLoading(true);
            const { data: cloudAnalyses, error } = await supabase
                .from('analyses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Erreur lors du chargement des analyses cloud:", error);
            } else {
                // Formatter les données cloud pour qu'elles correspondent à l'état
                // { id, data, result } devient { id, project_name, ville, data, result }
                setAnalyses(cloudAnalyses);
            }
            setIsDataLoading(false);
        };

        // Fonction pour charger les analyses depuis le localStorage
        const loadAnalysesFromLocal = () => {
            setIsDataLoading(true);
            const savedAnalyses = JSON.parse(localStorage.getItem('immoAnalyses') || '[]');
            setAnalyses(savedAnalyses);
            setIsDataLoading(false);
        };

        // --- LOGIQUE DE SYNCHRONISATION ---
        // S'exécute si un utilisateur vient de se connecter
        const syncLocalAnalyses = async (userId) => {
            const localAnalyses = JSON.parse(localStorage.getItem('immoAnalyses') || '[]');

            if (localAnalyses.length > 0) {
                if (window.confirm(`Nous avons trouvé ${localAnalyses.length} analyse(s) locale(s). Voulez-vous les synchroniser avec votre compte ?`)) {

                    // Transformer les données locales en format Supabase
                    const analysesToUpload = localAnalyses.map(analysis => ({
                        user_id: userId,
                        project_name: analysis.data.projectName,
                        ville: analysis.data.ville,
                        data: analysis.data,
                        result: analysis.result,
                        // 'id' sera auto-généré par Supabase
                    }));

                    const { error } = await supabase.from('analyses').insert(analysesToUpload);

                    if (error) {
                        console.error("Erreur de synchronisation:", error);
                        alert("Une erreur est survenue lors de la synchronisation. Vos données locales sont conservées.");
                    } else {
                        localStorage.removeItem('immoAnalyses'); // Succès, on nettoie le local
                        loadAnalysesFromCloud(userId); // Recharger les données depuis le cloud
                        alert("Synchronisation réussie !");
                    }
                }
            }
        };

        // --- POINT D'ENTRÉE ---
        if (user) {
            // 1. Utilisateur connecté
            syncLocalAnalyses(user.id); // Vérifier s'il y a des données locales à synchroniser
            loadAnalysesFromCloud(user.id); // Charger les données du cloud
        } else {
            // 2. Utilisateur déconnecté
            loadAnalysesFromLocal();
        }

    }, [user]);

    const handleStart = () => {
        const durationHours = parseInt(import.meta.env.VITE_STRADY_CACHE_DURATION_HOURS || '24', 10);
        const expiryTime = Date.now() + durationHours * 60 * 60 * 1000;
        localStorage.setItem('welcomeExpiry', expiryTime.toString());
        setShowWelcome(false);
    };

    React.useEffect(() => {
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Poppins:wght@500&family=The+Girl+Next+Door&display=swap";
        fontLink.rel = "stylesheet";
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        :root { --orange: #f59e0b; --light-blue: #3b82f6; }
        .logo { display: flex; align-items: baseline; gap: 4px; }
        .logo-s { font-family: 'Caveat', cursive; font-size: 2.4rem; font-weight: 700; line-height: 1; }
        .logo-trady { font-family: 'The Girl Next Door', cursive; font-size: 1.8rem; line-height: 1; }
        .logo-dot { font-size: 2.2rem; color: var(--orange); line-height: 1; }
        .logo-imo { font-family: 'Poppins', sans-serif; font-size: 1.1rem; font-weight: 500; padding: 0.1rem 0.5rem; border-radius: 6px; border-top: 2.5px solid var(--light-blue); border-right: 2.5px solid var(--light-blue); border-bottom: 2.5px solid var(--light-blue); color: var(--light-blue); line-height: 1; }
    
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            width: 100%;
            height: 18px; 
        }

        input[type="range"]::-webkit-slider-runnable-track {
            height: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        input[type="range"]::-moz-range-track {
            height: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            margin-top: -5px; 
            background-color: #ffffff;
            border: 2px solid #4b5563; 
            height: 20px;
            width: 20px;
            border-radius: 50%;
        }
         input[type="range"]::-moz-range-thumb {
            background-color: #ffffff;
            border: 2px solid #4b5563;
            height: 16px; 
            width: 16px;
            border-radius: 50%;
        }

        
        .range-slider-good-high::-webkit-slider-runnable-track {
             background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%);
        }
        .range-slider-good-high::-moz-range-track {
             background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%);
        }

        .range-slider-good-low::-webkit-slider-runnable-track {
             background: linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%);
        }
        .range-slider-good-low::-moz-range-track {
             background: linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%);
        }
        `;
        document.head.appendChild(fontLink);
        document.head.appendChild(styleElement);

        // Check if all settings are configured
        //const apiKey = localStorage.getItem('geminiApiKey');
        //const cacheDuration = localStorage.getItem('welcomeCacheDuration');
        //const maxAnalysesStored = localStorage.getItem('maxAnalyses');


        if (apiKey && cacheDuration && maxAnalysesStored) {
            setAllSettingsConfigured(true);
        }

        return () => { document.head.removeChild(fontLink); document.head.removeChild(styleElement); };
    }, [page]);

    // [NOUVEAU HOOK] Recalcul automatique de l'apport basé sur la quotité
    React.useEffect(() => {
        // Ne pas recalculer si l'utilisateur a entré un montant manuel
        if (data.quotite === 'custom') return;

        const baseEmpruntable = (data.prixAchat || 0) + (data.coutTravaux || 0);
        const frais = (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
        const selectedQuotite = Number(data.quotite) || 0;

        let nouvelApport = 0;

        if (selectedQuotite <= 100) {
            // Quotité standard: l'apport couvre les frais + la part non financée
            const partNonEmpruntee = baseEmpruntable * (1 - (selectedQuotite / 100));
            nouvelApport = frais + partNonEmpruntee;
        } else {
            // Quotité > 100 (finance les frais)
            const montantEmprunte = baseEmpruntable * (selectedQuotite / 100);
            const fraisFinances = montantEmprunte - baseEmpruntable;
            // L'apport est ce qui reste des frais, au minimum 0
            nouvelApport = Math.max(0, frais - fraisFinances);
        }

        // Mettre à jour l'apport dans l'état
        // On utilise 'd' pour "data" pour éviter le conflit de nom dans setData
        setData(d => ({ ...d, apport: Math.round(nouvelApport) }));

    }, [data.prixAchat, data.coutTravaux, data.fraisAcquisition, data.fraisAnnexe, data.quotite]);


    React.useEffect(() => {
        // Si l'utilisateur est maintenant connecté (user n'est pas null)
        // ET que l'utilisateur est toujours sur la page d'authentification
        if (user && page === 'auth') {
            // Redirige vers le dashboard
            setPage('dashboard');
        }
    }, [user, page]);


    /*
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        setData(prevData => {
            // Supprime les espaces pour gérer les formats comme "20 000"
            const cleanedValue = String(value).replace(/\s/g, '');
            const newValue = type === 'number' ? (parseFloat(cleanedValue) || 0) : value;

            const newData = { ...prevData, [name]: newValue };

            if (name === 'prixAchat') {
                newData.fraisAcquisition = Math.round((parseFloat(cleanedValue) || 0) * 0.145);
            }

            // --- MODIFICATION ---
            // Si l'utilisateur modifie l'apport manuellement, on passe en quotité 'custom'
            if (name === 'apport') {
                newData.quotite = 'custom';
            }
            // Si l'utilisateur clique sur un bouton quotité, 'name' sera 'quotite'
            // et la 'useEffect' de calcul d'apport s'en chargera.
            // --- FIN MODIFICATION ---

            return newData;
        });
    };
    */

    const handleDataChange = (name, value) => {
        setData(prevData => {
            const newData = { ...prevData, [name]: value };

            // Logique de l'ancien handler préservée
            if (name === 'prixAchat') {
                newData.fraisAcquisition = Math.round((parseFloat(value) || 0) * 0.145);
            }

            if (name === 'apport') {
                newData.quotite = 'custom';
            }

            return newData;
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        // Supprime les espaces pour gérer les formats comme "20 000"
        const cleanedValue = String(value).replace(/\s/g, '');
        const processedValue = type === 'number' ? parseFloat(cleanedValue) || 0 : value;
        handleDataChange(name, processedValue);
    };

    const handleTravauxUpdate = (newValue) => {
        setData(d => ({ ...d, coutTravaux: newValue }));
        setIsEstimatorOpen(false);
        // La ligne de calcul d'apport a été supprimée, l'useEffect s'en charge
    };
    const handleTensionUpdate = (newValue) => { setData(d => ({ ...d, tensionLocative: newValue })); setIsTensionEstimatorOpen(false); };
    const handleVacancyUpdate = (newValue) => { setData(d => ({ ...d, vacanceLocative: newValue })); setIsVacancyEstimatorOpen(false); };
    const handleChargesUpdate = (newValue) => { setData(d => ({ ...d, chargesMensuelles: newValue })); setIsChargesEstimatorOpen(false); };
    const handleAcquisitionFeesUpdate = (newValue) => {
        setData(d => ({ ...d, fraisAcquisition: newValue }));
        setIsAcquisitionFeesEstimatorOpen(false);
        // La ligne de calcul d'apport a été supprimée, l'useEffect s'en charge
    };

    /*
    const { coutTotalProjet, montantAFinancer, mensualiteEstimee } = React.useMemo(() => {
        const coutTotal = data.prixAchat + data.coutTravaux + data.fraisAcquisition + data.fraisAnnexe;
        const aFinancer = coutTotal - data.apport;
        const tauxMensuel = data.tauxCredit / 100 / 12;
        const nbMensualites = data.dureeCredit * 12;
        const mensualite = aFinancer > 0 && nbMensualites > 0 ? (aFinancer * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) / (Math.pow(1 + tauxMensuel, nbMensualites) - 1) : 0;
        return { coutTotalProjet: coutTotal, montantAFinancer: aFinancer, mensualiteEstimee: mensualite };
    }, [data.prixAchat, data.coutTravaux, data.fraisAcquisition, data.fraisAnnexe, data.apport, data.tauxCredit, data.dureeCredit]);
    */

    const [finances, setFinances] = React.useState(() => calculateFinances(initialDataState));

    // Étape 2.2 : Utiliser useEffect pour mettre à jour les calculs
    React.useEffect(() => {
        // Liste des champs requis pour le calcul
        const requiredFields = [
            'prixAchat', 'coutTravaux', 'fraisAcquisition', 'fraisAnnexe',
            'apport', 'tauxCredit', 'dureeCredit'
        ];

        // Vérifie si un champ est vide ('') à cause du onFocus
        const isAFieldEmpty = requiredFields.some(field => data[field] === '');

        // SI un champ est vide, NE PAS recalculer. On garde l'ancienne valeur.
        if (isAFieldEmpty) {
            return;
        }

        // SINON, tous les champs sont valides (0 ou plus), on recalcule.
        setFinances(calculateFinances(data));

    }, [data]);

    const calculateScore = () => {
        const loyerAnnuelBrut = (data.loyerEstime || 0) * 12;
        const chargesAnnuelles = (data.chargesMensuelles || 0) * 12;
        const coutVacance = loyerAnnuelBrut * ((data.vacanceLocative || 0) / 100);

        // Utiliser 'finances.coutTotalProjet'
        const rendementNet = ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / finances.coutTotalProjet) * 100;
        // Utiliser 'finances.mensualiteEstimee'
        const cashflowMensuel = (data.loyerEstime || 0) - (data.chargesMensuelles || 0) - finances.mensualiteEstimee;

        let score = 0;
        if (rendementNet > 7) score += 40; else if (rendementNet > 5) score += 30; else if (rendementNet > 3) score += 15;
        if (cashflowMensuel > 100) score += 40; else if (cashflowMensuel > 0) score += 30; else if (cashflowMensuel > -150) score += 10;
        score += (data.tensionLocative || 0);

        // Utiliser 'finances.coutTotalProjet'
        const ratioApport = finances.coutTotalProjet > 0 ? ((data.apport || 0) / finances.coutTotalProjet) * 100 : 0;
        if (ratioApport < 20) score += 10; else if (ratioApport < 30) score += 5;

        let grade, motivation;
        if (score > 75) { grade = 'A'; motivation = "Projet très favorable. Excellent potentiel !"; }
        else if (score > 50) { grade = 'B'; motivation = "Projet mitigé. Analysez les possibilités d'optimisation."; }
        else { grade = 'C'; motivation = "Projet non favorable. Le risque est élevé."; }

        const newResult = {
            rendementNet: isFinite(rendementNet) ? rendementNet.toFixed(2) : '0.00',
            cashflowMensuel: cashflowMensuel.toFixed(2),
            // Utiliser 'finances' pour le résultat
            mensualiteCredit: finances.mensualiteEstimee.toFixed(2),
            coutTotal: finances.coutTotalProjet.toFixed(0),
            grade, motivation, score: Math.round(score)
        };
        setResult(newResult);
        setNotification({ msg: '', type: '' });
    };

    const handleOpenSaveModal = () => {
        if (analyses.length >= maxAnalyses) {
            setNotification({ msg: `Limite de ${maxAnalyses} analyses atteinte.`, type: 'error' });
            setTimeout(() => setNotification({ msg: '', type: '' }), 5000);
            return;
        }

        // --- LOGIQUE DE GÉNÉRATION DE NOM ---
        const parts = [];
        if (data.typeBien) parts.push(data.typeBien);
        if (data.surface > 0) parts.push(`${data.surface}m²`);
        if (data.peb && data.peb !== 'N/C') parts.push(`PEB ${data.peb}`);
        if (data.ville) parts.push(data.ville);

        let suggestedName = parts.join(' - ');
        if (!suggestedName.trim()) {
            suggestedName = data.projectName;
        }
        // --- FIN NOUVELLE LOGIQUE ---

        setProjectNameForSave(suggestedName);
        setSaveError('');
        setIsSaveModalOpen(true);

    };

    const handleUpdateAnalysis = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        // Check for duplicate name, but exclude the current analysis
        if (analyses.some(a => a.id !== currentAnalysisId && (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà. Veuillez en choisir un autre.');
            return;
        }

        const currentDataWithNewName = { ...data, projectName: projectNameForSave };

        if (user) {
            // --- Cloud Update Logic ---
            const { data: updatedAnalysis, error } = await supabase
                .from('analyses')
                .update({
                    project_name: projectNameForSave,
                    ville: currentDataWithNewName.ville,
                    data: currentDataWithNewName,
                    result: result
                })
                .eq('id', currentAnalysisId)
                .select()
                .single();

            if (error) {
                setSaveError("Erreur lors de la mise à jour cloud: " + error.message);
                return;
            }
            setAnalyses(analyses.map(a => a.id === currentAnalysisId ? updatedAnalysis : a));
        } else {
            // --- Local Update Logic ---
            const updatedAnalyses = analyses.map(a =>
                a.id === currentAnalysisId ? { ...a, data: currentDataWithNewName, result: result, project_name: projectNameForSave, ville: currentDataWithNewName.ville } : a
            );
            setAnalyses(updatedAnalyses);
            localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        }

        setIsSaveModalOpen(false);
        setProjectNameForSave('');
        setSaveError('');
        setNotification({ msg: `'${projectNameForSave}' a été mis à jour !`, type: 'success' });
        setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
    };

    const handleConfirmSave = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        // When saving as a copy, the name must be different from the original
        if (currentAnalysisId !== null) {
            const originalAnalysis = analyses.find(a => a.id === currentAnalysisId);
            if (originalAnalysis && (originalAnalysis.project_name || originalAnalysis.data.projectName) === projectNameForSave) {
                setSaveError('Pour sauvegarder une copie, veuillez changer le nom du projet.');
                return;
            }
        }
        if (analyses.some(a => (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà. Veuillez en choisir un autre.');
            return;
        }

        const currentDataWithNewName = { ...data, projectName: projectNameForSave };

        if (user) {
            // --- Logique Cloud ---
            const { data: newCloudAnalysis, error } = await supabase
                .from('analyses')
                .insert({
                    user_id: user.id,
                    project_name: projectNameForSave,
                    ville: currentDataWithNewName.ville,
                    data: currentDataWithNewName,
                    result: result
                })
                .select()
                .single();

            if (error) {
                setSaveError("Erreur lors de la sauvegarde cloud: " + error.message);
                return;
            }
            setAnalyses([newCloudAnalysis, ...analyses]);
            setCurrentAnalysisId(newCloudAnalysis.id);
        } else {
            // --- Logique Locale ---
            const newAnalysis = { id: Date.now(), data: currentDataWithNewName, result: result };
            const updatedAnalyses = [newAnalysis, ...analyses];
            setAnalyses(updatedAnalyses);
            localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
            setCurrentAnalysisId(newAnalysis.id);
        }

        setIsSaveModalOpen(false);
        setProjectNameForSave('');
        setSaveError('');
        setNotification({ msg: `'${projectNameForSave}' a été sauvegardé !`, type: 'success' });
        setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
    };

    // Fonction pour charger une analyse (locale ou cloud)
    const loadAnalysis = (id) => {
        // 'analyses' est déjà le bon état (local ou cloud)
        const analysisToLoad = analyses.find(a => a.id === id);
        if (analysisToLoad) {
            // Si c'est du cloud (format {data, result}), ou local (format {data, result})
            // L'ancien format local était { id, data, result }.
            // Le format cloud est { id, user_id, project_name, ville, data, result }
            // L'objet 'data' contient tout, c'est ce qu'on charge.
            setData(analysisToLoad.data);
            setResult(analysisToLoad.result);
            setCurrentAnalysisId(id);
            setPage('main');
        }
    };

    // Fonction pour supprimer une analyse (locale ou cloud)
    const deleteAnalysis = (id) => {
        const analysis = analyses.find(a => a.id === id);
        if (analysis) {
            setAnalysisToDelete(analysis); // Mémorise l'analyse à supprimer
            setIsDeleteModalOpen(true); // Ouvre la modale
        }
    };

    //  Exécute la suppression (appelée par la modale)
    const handleConfirmDelete = async () => {
        if (!analysisToDelete) return; // Sécurité

        const id = analysisToDelete.id;

        if (user) {
            // --- Logique Cloud ---
            const { error } = await supabase.from('analyses').delete().eq('id', id);
            if (error) {
                alert("Erreur lors de la suppression cloud: " + error.message);
            } else {
                setAnalyses(analyses.filter(a => a.id !== id));
            }
        } else {
            // --- Logique Locale ---
            const updatedAnalyses = analyses.filter(a => a.id !== id);
            setAnalyses(updatedAnalyses);
            localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        }

        // Réinitialise et ferme la modale
        setIsDeleteModalOpen(false);
        setAnalysisToDelete(null);
    };

    // Fonction pour appeler l'API Gemini
    const callGeminiAPI = async (systemPrompt, userPrompt, setLoading, setError, setResponse) => {
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const response = await fetch('/.netlify/functions/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt, userPrompt })
            });

            const resultData = await response.json();

            if (!response.ok) {
                throw new Error(resultData.error || `Error: ${response.statusText}`);
            }

            const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setResponse(text);
            } else {
                setError("La réponse de l'API était vide ou malformée.");
            }
        } catch (error) {
            setError(`Une erreur est survenue: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneralQuery = () => {
        const systemPrompt = `Tu es un assistant expert polyvalent dans le domaine de l'immobilier en Belgique (Wallonie, Flandre, Bruxelles). Tu peux répondre à des questions sur le droit, la fiscalité, les taxes, la location, le marché, le financement, les travaux, les permis d'urbanisme, l'architecture, la décoration, et les garanties. Fournis des réponses claires, structurées et factuelles. Si une information est spécifique à une région, précise-le. Ton rôle est strictement limité à ce domaine. Si un utilisateur te pose une question qui sort de ce cadre (par exemple, des recommandations de films, de restaurants, ou des questions d'ordre général non liées à l'immobilier), tu dois décliner poliment la demande en rappelant ton champ d'expertise. La seule exception est si la question sur un lieu (comme un restaurant) est posée dans le but d'évaluer la proximité d'un bien immobilier.`;
        callGeminiAPI(systemPrompt, geminiQuery, setIsGeminiLoading, setGeminiError, setGeminiResponse);
    };


    // Se déclenche quand l'utilisateur clique DANS un champ
    const handleNumericFocus = (e) => {
        const { name, value } = e.target;
        // 1. Sauvegarder la valeur actuelle dans notre état temporaire
        setTempNumericValue({ name, value });
        // 2. Vider le champ dans l'état principal 'data'
        setData(prevData => ({ ...prevData, [name]: '' }));
    };

    // Se déclenche quand l'utilisateur clique HORS d'un champ
    const handleNumericBlur = (e) => {
        const { name } = e.target;
        const currentValue = data[name];

        // Si l'utilisateur n'a rien tapé (le champ est toujours vide)
        // ET que nous avons bien une sauvegarde pour ce champ précis
        if (currentValue === '' && tempNumericValue && tempNumericValue.name === name) {
            // Supprime les espaces pour gérer les formats comme "20 000"
            const cleanedValue = String(tempNumericValue.value).replace(/\s/g, '');
            // 1. Restaurer la valeur d'origine en s'assurant que c'est un nombre
            setData(prevData => ({ ...prevData, [name]: parseFloat(cleanedValue) || 0 }));
        }

        // 2. Vider la sauvegarde temporaire
        setTempNumericValue(null);
    };

    const renderPage = () => {
        switch (page) {
            case 'aide': return <HelpPage onBack={() => setPage('main')} />;
            case 'settings': return <SettingsPage onBack={() => setPage('main')} maxAnalyses={maxAnalyses} setMaxAnalyses={setMaxAnalyses} />;
            case 'dashboard': return <DashboardPage analyses={analyses} onLoad={loadAnalysis} onDelete={deleteAnalysis} onBack={() => setPage('main')} maxAnalyses={maxAnalyses} />;
            case 'auth': return <AuthPage onBack={() => setPage('main')} />;
                        case 'account': return <AccountPage onBack={() => setPage('main')} />;
                        case 'feedback': return <FeedbackPage onBack={() => setPage('main')} />;
            case 'privacy': return <PrivacyPolicyPage onBack={() => setPage('main')} />;
            case 'terms': return <TermsOfServicePage onBack={() => setPage('main')} />;
            default:

                // --- NOUVEAU CALCUL POUR QUOTITÉ MANUELLE ---
                let quotiteEstimeeLabel = '(Mode Manuel)';
                if (data.quotite === 'custom') {
                    const frais = (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
                    const baseEmpruntable = (data.prixAchat || 0) + (data.coutTravaux || 0);

                    if (baseEmpruntable > 0) {
                        const partNonFinancee = (data.apport || 0) - frais;
                        const quotiteRatio = 1 - (partNonFinancee / baseEmpruntable);
                        const quotitePourcentage = (quotiteRatio * 100).toFixed(0);
                        quotiteEstimeeLabel = `(Quotité estimée: ${quotitePourcentage}%)`;
                    } else {
                        // Si prixAchat + coutTravaux = 0, on ne peut pas calculer
                        quotiteEstimeeLabel = '(Quotité non calc.)';
                    }
                }
                // --- FIN DU NOUVEAU CALCUL ---

                return (
                    <div className="space-y-8 animate-fade-in">
                        {/* --- Section 1: Détails du Bien --- */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Détails du Bien</h2>

                            {/* --- NOM, VILLE, SURFACE, RC --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm font-medium">Nom du Projet</label><input type="text" name="projectName" value={data.projectName} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Adresse/ Ville / Commune</label><input type="text" name="ville" value={data.ville} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Surface (m²)</label><input type="number" name="surface" value={data.surface} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Revenu Cadastral (€)</label><input type="number" name="revenuCadastral" value={data.revenuCadastral} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                            </div>

                            {/* --- TYPE DE BIEN (BOUTONS) --- */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Type de bien</label>
                                <div className="flex flex-wrap gap-2">
                                    {typeBienOptions.map(opt => (
                                        <button key={opt} onClick={() => handleDataChange('typeBien', opt)} className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${data.typeBien === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* --- PEB (BOUTONS) --- */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Score PEB</label>
                                <div className="flex flex-wrap gap-2">
                                    {pebOptions.map(opt => (
                                        <button key={opt} onClick={() => handleDataChange('peb', opt)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.peb === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* --- DESCRIPTION --- */}
                            <div className="mt-4"><label className="block text-sm font-medium">Notes</label><textarea name="descriptionBien" value={data.descriptionBien} onChange={handleInputChange} rows="4" className="mt-1 w-full p-2 border rounded-md" placeholder='Quartier calme, Prévoir travaux SDB, Gros œuvre OK...'></textarea></div>
                        </div>

                        {/* --- Section 2: Coûts & Financement --- */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Coûts & Financement</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">Prix d'achat (€)</label><input type="number" name="prixAchat" value={data.prixAchat} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium text-gray-700">Coût travaux (€)</label><div className="flex items-center gap-2"><input type="number" name="coutTravaux" value={data.coutTravaux} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                                    <button onClick={() => setIsEstimatorOpen(true)} title="Estimer le coût des travaux" className="p-2 mt-1 bg-gray-200 hover:bg-gray-300 rounded-md"><CalculatorIcon /></button>
                                </div></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Frais d'acquisition (€)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" name="fraisAcquisition" value={data.fraisAcquisition} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                                        <button onClick={() => setIsAcquisitionFeesEstimatorOpen(true)} className="mt-1 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" title="Calculateur détaillé">
                                            <CalculatorIcon />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Estimation auto. Pour un calcul précis, utilisez l'estimateur ou notaire.be</p>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700">Frais annexes (€)</label><input type="number" name="fraisAnnexe" value={data.fraisAnnexe} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} placeholder="Agence, hypothèque..." className="mt-1 w-full p-2 border rounded-md" /></div>

                                {/* --- MODIFICATIONS POUR QUOTITÉ --- */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Quotité d'emprunt</label>
                                    <p className="text-xs text-gray-500 mt-1 mb-2">Part du prix d'achat et des travaux financée par la banque. L'apport est calculé automatiquement.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[70, 80, 90, 100, 125].map((q) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => handleInputChange({ target: { name: 'quotite', value: q, type: 'number' } })}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.quotite === q
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                                    }`}
                                            >
                                                {q}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Apport personnel (€)
                                        {/* --- MODIFICATION DE CETTE LIGNE --- */}
                                        {data.quotite === 'custom' && <span className="text-blue-600 font-normal ml-2">{quotiteEstimeeLabel}</span>}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="apport"
                                            value={data.apport}
                                            onChange={handleInputChange}
                                            onFocus={handleNumericFocus}
                                            onBlur={handleNumericBlur}
                                            className="mt-1 w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {data.quotite === 'custom'
                                            ? "L'apport est en mode manuel. Sélectionnez une quotité pour réactiver le calcul auto."
                                            : "Calculé (Frais + Part non-financée) basé sur la quotité."
                                        }
                                    </p>
                                </div>
                                {/* --- FIN DES MODIFICATIONS QUOTITÉ --- */}

                                <div><label className="block text-sm font-medium text-gray-700">Taux du crédit (%)</label><input type="number" step="0.1" name="tauxCredit" value={data.tauxCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Durée du crédit (années)</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input type="number" name="dureeCredit" value={data.dureeCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                                        <div className="flex-shrink-0 flex gap-1">
                                            {dureeOptions.map(duree => (
                                                <button
                                                    key={duree}
                                                    onClick={() => handleDataChange('dureeCredit', duree)}
                                                    className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.dureeCredit === duree ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                                                    title={`${duree} ans`}
                                                >
                                                    {duree}
                                                </button>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-dashed"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div><p className="text-sm text-gray-600">Coût total du projet</p><p className="text-lg font-bold">{finances.coutTotalProjet.toLocaleString('fr-BE')} €</p></div>
                                <div><p className="text-sm text-gray-600">Montant à financer</p><p className="text-lg font-bold text-blue-700">{finances.montantAFinancer.toLocaleString('fr-BE')} €</p></div>
                                <div><p className="text-sm text-gray-600">Mensualité estimée</p><p className="text-lg font-bold text-red-600">{finances.mensualiteEstimee.toFixed(2)} €</p></div>
                            </div></div>
                        </div>

                        {/* --- Section 3: Analyse du Marché et du Loyer --- */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Analyse Marché & Loyer</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm font-medium">Loyer estimé (€)</label><input type="number" name="loyerEstime" value={data.loyerEstime} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Charges non-récup. (€/mois)</label><div className="flex items-center gap-2 mt-1"><input type="number" name="chargesMensuelles" value={data.chargesMensuelles} onChange={handleInputChange} className="w-full p-2 border rounded-md" /><button onClick={() => setIsChargesEstimatorOpen(true)} title="Aide à l'évaluation des charges" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><ClipboardListIcon /></button></div></div>

                                <div className="md:col-span-2 "><label className="block text-sm font-medium">Tension locative (1-10)</label><div className="flex items-center gap-2 mt-1">
                                    {/* MODIFIÉ: Ajout de className="range-slider-good-high" */}
                                    <input type="range" min="1" max="10" name="tensionLocative" value={data.tensionLocative} onChange={handleInputChange} className="w-full range-slider-good-high" />
                                    <div className="font-semibold text-lg w-12 text-center">{data.tensionLocative}</div>
                                    <button onClick={() => setIsTensionEstimatorOpen(true)} title="Aide à l'évaluation" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><TrendingUpIcon /></button>
                                </div></div>

                                <div className="md:col-span-2 "><label className="block text-sm font-medium">Vacance locative (%)</label><div className="flex items-center gap-2 mt-1">
                                    {/* MODIFIÉ: Remplacement de className par "range-slider-good-low" */}
                                    <input type="range" min="1" max="25" name="vacanceLocative" value={data.vacanceLocative} onChange={handleInputChange} className="w-full range-slider-good-low" />
                                    <div className="font-semibold text-lg w-12 text-center">{data.vacanceLocative}</div>
                                    <button onClick={() => setIsVacancyEstimatorOpen(true)} title="Aide à l'évaluation" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><PercentIcon /></button>
                                </div></div>

                            </div>
                        </div>

                        <button onClick={calculateScore} className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                            Evaluer le Projet
                        </button>

                        {/* --- Section 4: Résultats --- */}
                        {result ? (
                            <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Résultat</h2>
                                    {notification.msg ? (
                                        <span className={`font-semibold animate-fade-in ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{notification.msg}</span>
                                    ) : (
                                        <button onClick={handleOpenSaveModal} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2">
                                            <SaveIcon /> Sauvegarder
                                        </button>
                                    )}
                                </div>
                                <div className={`text-center p-4 rounded-lg mb-4 ${result.grade === 'A' ? 'bg-green-100' : result.grade === 'B' ? 'bg-yellow-100' : 'bg-red-100'}`}><span className={`text-6xl font-black ${result.grade === 'A' ? 'text-green-600' : result.grade === 'B' ? 'text-yellow-600' : 'text-red-600'}`}>{result.grade}</span><p className="font-semibold text-lg mt-2">{result.motivation}</p><p className="font-mono text-sm mt-1">Score: {result.score}/100</p></div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm">Rendement Net</p><p className="text-xl font-bold text-blue-700">{result.rendementNet} %</p></div>
                                    <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm">Cash-Flow / mois</p><p className={`text-xl font-bold ${result.cashflowMensuel > 0 ? 'text-green-600' : 'text-red-600'}`}>{result.cashflowMensuel} €</p></div>
                                    <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm">Mensualité Crédit</p><p className="text-xl font-bold">{result.mensualiteCredit} €</p></div>
                                    <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm">Coût Total</p><p className="text-xl font-bold">{parseInt(result.coutTotal).toLocaleString('fr-BE')} €</p></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-transparent p-6 rounded-lg text-center text-gray-600">
                            </div>
                        )}

                        {/* ---  Assistant IA Général --- */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><BrainCircuitIcon /> Assistant Immobilier IA</h2>
                            <p className="text-sm text-gray-500 mb-3">Posez n'importe quelle question sur l'immobilier en Belgique (droit, fiscalité, marché, travaux, etc.).</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={geminiQuery}
                                    onChange={(e) => setGeminiQuery(e.target.value)}
                                    placeholder="Ex: Quelles sont les conditions pour le taux de TVA à 6% sur les rénovations ?"
                                    className="flex-grow p-2 border rounded-md"
                                />
                                <button
                                    onClick={handleGeneralQuery}
                                    disabled={isGeminiLoading}
                                    className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-purple-300"
                                >
                                    {isGeminiLoading ? 'Recherche...' : 'Interroger'}
                                </button>
                            </div>
                            
                            {/* --- NOUVELLE SECTION: BOUTONS PRE-PROMPTS --- */}
                            <div className="mt-4">
                              {prePromptConfig.map((group) => (
                                <div key={group.category} className="mb-3">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">{group.category}</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {group.prompts.map((prompt) => (
                                      <button
                                        key={prompt}
                                        onClick={() => setGeminiQuery(prompt)}
                                        className="text-sm bg-gray-100 text-gray-800 py-1 px-3 rounded-full hover:bg-gray-200 transition"
                                      >
                                        {prompt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* --- FIN NOUVELLE SECTION --- */}
                            
                            {geminiError && !isGeminiLoading && <p className="text-red-500 text-sm mt-2">{geminiError}</p>}
                            {isGeminiLoading && <div className="text-center p-4 text-sm text-gray-600">L'IA recherche la meilleure réponse...</div>}
                         
                            {geminiResponse && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                    <h3 className="font-semibold mb-2 text-gray-800">Réponse de l'assistant :</h3>
                                    <div className="text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none">{geminiResponse}</div>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    if (showWelcome) {
        return <WelcomePage onStart={handleStart} onNavigate={setPage} />;
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-10"><div className="max-w-4xl mx-auto p-4"><Logo /></div></header>

                        <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24 pt-20">
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    onNavigate={setPage}
                    onSignOut={signOut}
                    user={user}
                />
                <RenovationEstimatorModal isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} onApply={handleTravauxUpdate} />
                <TensionLocativeEstimatorModal isOpen={isTensionEstimatorOpen} onClose={() => setIsTensionEstimatorOpen(false)} onApply={handleTensionUpdate} />
                <VacancyEstimatorModal isOpen={isVacancyEstimatorOpen} onClose={() => setIsVacancyEstimatorOpen(false)} onApply={handleVacancyUpdate} currentTension={data.tensionLocative} />
                <ChargesEstimatorModal isOpen={isChargesEstimatorOpen} onClose={() => setIsChargesEstimatorOpen(false)} onApply={handleChargesUpdate} />
                <AcquisitionFeesEstimatorModal
                    isOpen={isAcquisitionFeesEstimatorOpen}
                    onClose={() => setIsAcquisitionFeesEstimatorOpen(false)}
                    onApply={handleAcquisitionFeesUpdate}
                    prixAchat={data.prixAchat}
                />
                <SaveAnalysisModal
                    isOpen={isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(false)}
                    onSave={handleConfirmSave}
                    onUpdate={handleUpdateAnalysis}
                    currentAnalysisId={currentAnalysisId}
                    projectName={projectNameForSave}
                    setProjectName={setProjectNameForSave}
                    error={saveError}
                    setError={setSaveError}
                />

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setAnalysisToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    title="Confirmer la suppression"
                >
                    <p>Êtes-vous sûr de vouloir supprimer définitivement cette analyse ?</p>
                    {analysisToDelete && (
                        <p className="font-bold mt-2">
                            "{analysisToDelete.project_name || analysisToDelete.data.projectName}"
                        </p>
                    )}
                    <p className="text-sm text-red-600 mt-2">Cette action est irréversible.</p>
                </ConfirmationModal>
                                {renderPage()}
                            </main>
                
                            <footer className="bg-white border-t-2 shadow-top">
                                <nav className="max-w-4xl mx-auto flex justify-around p-2 sticky bottom-0 left-0 right-0 bg-white">
                                    <button onClick={() => setPage('main')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'main' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><HomeIcon /><span className="text-xs font-medium">Analyse</span></button>
                                    <button onClick={() => setPage('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><DashboardIcon /><span className="text-xs font-medium">Dashboard</span></button>
                                    <button onClick={() => setPage('aide')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'aide' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><HelpIcon /><span className="text-xs font-medium">Aide</span></button>
                
                                    {user ? (
                                        <button onClick={() => setIsProfileModalOpen(true)} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'account' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                                            <UserIcon />
                                            <span className="text-xs font-medium">{user.user_metadata?.prenom ? `Hey ${user.user_metadata.prenom} !` : 'Profil'}</span>
                                        </button>
                                    ) : (
                                        <button onClick={() => setPage('auth')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'auth' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
                                            <UserIcon />
                                            <span className="text-xs font-medium">Connexion</span>
                                        </button>
                                    )}
                                </nav>
                                <div className="text-center py-4 border-t">
                                    <div className="text-sm text-gray-600 space-x-4">
                                        <button onClick={() => setPage('privacy')} className="hover:underline">Politique de Confidentialité</button>
                                        <span>•</span>
                                        <button onClick={() => setPage('terms')} className="hover:underline">Conditions d'Utilisation</button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">© 2025 Strady.imo - Tous droits réservés.</p>
                                </div>
                            </footer>
                
                            {showCookieBanner && <CookieBanner onAccept={handleCookieConsent} />}
                        </div>    );
}