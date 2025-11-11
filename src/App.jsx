import React from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage';
import { prePromptConfig, scoreConfig } from './config.js';
import FeedbackPage from './FeedbackPage'; // Le nouveau formulaire unifié
import PrivacyPolicyPage from './PrivacyPolicyPage'; //
import TermsOfServicePage from './TermsOfServicePage'; //
import HelpHubPage from './HelpHubPage';
import UserManualPage from './UserManualPage';
import KnowledgePage from './KnowledgePage';
import GlossaryPage from './GlossaryPage';
import AnalysisViewPage from './AnalysisViewPage';
import ConfirmationModal from './ConfirmationModal';
import PlansPage from './PlansPage';
import WelcomePage from './WelcomePage';
import DashboardPage from './DashboardPage';
import {
    StarIcon, WalletIcon, HomeIcon, HelpIcon, UserIcon, LogOutIcon, SettingsIcon,
    DashboardIcon, CalculatorIcon, PlusCircleIcon, PlusIcon, TrashIcon, TrendingUpIcon,
    PercentIcon, ClipboardListIcon, SaveIcon, FileCheckIcon, SparklesIcon, EyeIcon, EllipsisVerticalIcon,
    AlertTriangleIcon, PencilIcon, ChevronDownIcon, InfoIcon, QuestionMarkIcon
} from './Icons';


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

// --- Fonction utilitaire pour ID unique ---
let idCounter = 0;
const generateUniqueId = () => {
    return `${Date.now()}-${idCounter++}`;
};

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

// --- Composant pour la page des paramètres (version lue depuis .env) ---
const SettingsPage = ({ onBack, maxAnalyses }) => {
    // const SettingsPage = ({ onBack }) => {
    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Paramètres</h1>
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


// --- Modals d'estimation (Travaux, Tension, Vacance, Charges, Frais d'acquisition) ---
const RenovationEstimatorModal = ({ isOpen, onClose, onApply }) => {
    const [items, setItems] = React.useState([{ id: generateUniqueId(), object: 'Cuisine', type: 'Rénovation complète', cost: 8000 }]);
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
                    <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(Math.round(totalCost), items)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
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

const ChargesEstimatorModal = ({ isOpen, onClose, onApply, data }) => {
    const [items, setItems] = React.useState([
        { id: generateUniqueId(), object: 'Précompte immobilier', periodicity: 'An', price: data.revenuCadastral ? Math.round(data.revenuCadastral * 1.25) : 0 },
        { id: generateUniqueId(), object: 'Assurance PNO', periodicity: 'An', price: 250 },
        { id: generateUniqueId(), object: 'Charges copropriété non-récup.', periodicity: 'Mois', price: 50 },
        { id: generateUniqueId(), object: 'Vacance locative', periodicity: 'Mois', price: data.loyerEstime ? Math.round(data.loyerEstime * 0.1) : 0 },
    ]);
    const addItem = () => setItems([...items, { id: generateUniqueId(), object: '', periodicity: 'Mois', price: 0 }]);
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
                <h2 className="text-2xl font-bold mb-4">Estimation des charges d'exploitation</h2>
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
                    <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(Math.round(totalMonthlyCost), items)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
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
                <h2 className="text-2xl font-bold mb-4">Calcul de frais d'acte d'achat immobilier</h2>
                <div className="mb-4 text-sm">
                <span className="text-gray-600">Les calculs de nos simulateurs sont indicatifs. Pour plus de précisions, demandez à votre notaire une prévision du coût des démarches.</span>
                </div>
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

// --- Composant Modal pour l'explication du score ---
const ScoreExplanationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const scores = [
        { grade: 'A', text: "Votre cashflow net permet de reconstituer votre apport en moins de 5 ans.", color: "text-green-800" }, // vert foncé
        { grade: 'B', text: "Votre cashflow net permet de reconstituer votre apport entre 5 et 10 ans.", color: "text-green-500" }, // vert clair
        { grade: 'C', text: "Votre cashflow net permet de reconstituer votre apport entre 10 et 15 ans.", color: "text-yellow-500" }, // jaune
        { grade: 'D', text: "Votre cashflow net permet de reconstituer votre apport entre 15 et 20 ans.", color: "text-orange-500" }, // orange
        { grade: 'E', text: "Votre cashflow net ne permet pas la reconstitution de votre apport en moins de 20 ans.", color: "text-red-800" } // rouge très foncé
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Échelle des scores Strady</h2>
                <div className="space-y-4">
                    {scores.map(score => (
                        <div key={score.grade} className="flex items-start">
                            <div className={`text-2xl font-black w-10 text-center ${score.color}`}>{score.grade}</div>
                            <div className="ml-4">
                                <p className="text-gray-700">{score.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Fermer</button>
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
                <h2 className="text-2xl font-bold mb-4">{isUpdateMode ? "Que souhaitez-vous faire ?" : "Sauvegarder l'Analyse"}</h2>

                {isUpdateMode ? (
                    <div className="text-gray-600 mb-4 space-y-2">
                        <p>Vous modifiez une analyse existante.</p>
                        <p>• <strong>Mettre à jour :</strong> Écrase les données de l'analyse actuelle avec vos modifications.</p>
                        <p>• <strong>Créer une nouvelle analyse :</strong> Garde l'analyse originale intacte et sauvegarde vos modifications comme une nouvelle entrée.</p>
                    </div>
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
                            <button onClick={onUpdate} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">Mettre à jour</button>
                            <button onClick={onSave} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Créer une nouvelle analyse</button>
                        </>
                    ) : (
                        <button onClick={onSave} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Confirmer</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Composant Modal pour l'explication des métriques ---
const MetricExplanationModal = ({ isOpen, onClose, metric }) => {
    if (!isOpen || !metric) return null;

    const explanations = {
        rendementNet: {
            title: "Rendement Net",
            explanation: "Le rendement net mesure la rentabilité de votre investissement en prenant en compte les charges annuelles (hors crédit). C'est un indicateur clé pour comparer la performance intrinsèque de différents biens.",
            formula: "((Loyer Annuel Brut - Charges Annuelles) / Coût Total d'Acquisition) x 100"
        },
        cashOnCash: {
            title: "Cash-on-Cash (CoC)",
            explanation: "Le 'Cash-on-Cash' (ou retour sur fonds propres) mesure le rendement de l'argent que vous avez personnellement investi (votre apport). C'est l'indicateur le plus important pour évaluer l'efficacité de votre mise de départ.",
            formula: "(Cash-Flow Annuel Net / Apport Personnel) x 100"
        }
        ,
        cashflow: {
            title: "Cash-Flow / mois",
            explanation: "Le cash-flow est l'argent qu'il vous reste (ou que vous devez ajouter) chaque mois une fois que toutes les charges et la mensualité du crédit ont été payées. C'est le principal indicateur de la rentabilité de votre trésorerie.",
            formula: "Loyer Mensuel - Charges Mensuelles - Mensualité du Crédit"
        },
        mensualiteCredit: {
            title: "Mensualité Crédit",
            explanation: "C'est le montant que vous remboursez chaque mois à la banque pour votre prêt hypothécaire. Ce montant inclut à la fois le capital et les intérêts.",
            formula: "Calcul basé sur le montant financé, le taux et la durée du crédit."
        },
        coutTotal: {
            title: "Coût Total d'Acquisition",
            explanation: "C'est le montant total que vous devez débourser pour acquérir le bien, incluant le prix d'achat, les travaux, les frais d'acquisition (notaire, droits d'enregistrement) et les frais annexes (hypothèque, agence).",
            formula: "Prix d'Achat + Coût Travaux + Frais d'Acquisition + Frais Annexes"
        }
    };

    const content = explanations[metric];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                <p className="text-gray-700 mb-4">{content.explanation}</p>
                <p className="p-3 bg-gray-100 rounded-md border text-center font-mono text-sm text-gray-800">{content.formula}</p>
                <div className="flex justify-end mt-6"><button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Fermer</button></div>
            </div>
        </div>
    );
};


// --- Composant Modal de Profil ---
const ProfileModal = ({ isOpen, onClose, onNavigate, onSignOut, user, userPlan, analyses }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">Profil</h2>
                            {user.user_metadata?.prenom && <p className="text-sm text-gray-500">Connecté en tant que {user.user_metadata.prenom}</p>}
                        </div>
                        {userPlan && (
                            <div className="text-right text-sm">
                                <p className="font-semibold text-blue-600">{userPlan.profile_plans.plan_name}</p>
                                <p className="text-gray-500">Crédits IA: {userPlan.current_ai_credits === -1 ? 'Illimités' : userPlan.current_ai_credits}</p>
                                <p className="text-gray-500">Analyses: {userPlan.profile_plans.stored_analysis === -1 ? 'Illimitées' : `${analyses.length} / ${userPlan.profile_plans.stored_analysis}`}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-2">
                    <button onClick={() => { onNavigate('account'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <SettingsIcon />
                        <span>Mon profil</span>
                    </button>
                    <button onClick={() => { onNavigate('plans'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">
                        <WalletIcon />
                        <span>Abonnement</span>
                    </button>
                    <button onClick={() => { onNavigate('feedback'); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100" title="Signaler un bug, faire une suggestion...">
                        <StarIcon />
                        <span>Feedback & Support</span>
                    </button>
                    <button onClick={() => { onSignOut(); onClose(); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>


                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Composant pour la notification ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
 
    const styles = {
        success: {
            bg: 'bg-green-600',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        },
        error: {
            bg: 'bg-red-600',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        }
    };
 
    const currentStyle = styles[type] || styles.success;
 
    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-2xl text-white z-50 flex items-center gap-4 animate-fade-in-down ${currentStyle.bg}`}>
            <div className="flex-shrink-0">{currentStyle.icon}</div>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 font-bold text-xl opacity-70 hover:opacity-100">&times;</button>
        </div>
    );
};

// --- Composant principal de l'application ---
export default function App() {
    const [page, setPageInternal] = React.useState('main');

    const setPage = (newPage) => {
        console.log('Navigating to page:', newPage);
        setPageInternal(newPage);
    };

    // Utilisation de notre Contexte d'Authentification
    const { user, signOut } = useAuth();

    const [showWelcome, setShowWelcome] = React.useState(() => {
        const expiry = localStorage.getItem('welcomeExpiry');
        if (!expiry) return true;
        return parseInt(expiry) < Date.now();
    });

    const initialDataState = {
        projectName: 'Nouveau Projet', prixAchat: 180000, coutTravaux: 15000, fraisAcquisition: 26100, fraisAnnexe: 2000, apport: 40000, tauxCredit: 3.5, dureeCredit: 25,
        ville: '',
        descriptionBien: '',// 'Appartement 2 chambres, bon état',
        typeBien: 'Appartement',
        surface: 85,
        peb: 'C',
        revenuCadastral: 1000,
        tensionLocative: 7, loyerEstime: 900, chargesMensuelles: 100, vacanceLocative: 8,
        quotite: 80,
        chargesDetail: [], travauxDetail: [], enOrdreUrbanistique: false,
        electriciteConforme: false,
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
    const [maxAnalyses, setMaxAnalyses] = React.useState(3); // Default for logged-out users
    const [allSettingsConfigured, setAllSettingsConfigured] = React.useState(false);
    const [isDataLoading, setIsDataLoading] = React.useState(true);
    const [tempNumericValue, setTempNumericValue] = React.useState(null);
    const [currentAnalysisId, setCurrentAnalysisId] = React.useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [analysisToDelete, setAnalysisToDelete] = React.useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [authPageInitialMode, setAuthPageInitialMode] = React.useState('signIn');
    const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
    const [userPlan, setUserPlan] = React.useState(null);
    const [redirectAfterLogin, setRedirectAfterLogin] = React.useState(null);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
    const [isScoreModalOpen, setIsScoreModalOpen] = React.useState(false);
    const [viewingAnalysis, setViewingAnalysis] = React.useState(null);
    const [isMetricModalOpen, setIsMetricModalOpen] = React.useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = React.useState(false);
    const [isLegalMenuOpen, setIsLegalMenuOpen] = React.useState(false);
    const [selectedMetric, setSelectedMetric] = React.useState(null);

    // --- NOUVEAUX ÉTATS POUR L'ASSISTANT IA ---
    const [aiInput, setAiInput] = React.useState(''); // Pour le textarea (texte ou URL)
    const [aiPrompt, setAiPrompt] = React.useState(''); // Pour le bouton de prompt rapide cliqué
    const [showAiResponseActions, setShowAiResponseActions] = React.useState(false); // Pour afficher/cacher les boutons Sauvegarder/Ignorer
    const [isApplyingAi, setIsApplyingAi] = React.useState(false); // Pour l'état de chargement du bouton "Appliquer"
    const [isAiAssistantOpen, setIsAiAssistantOpen] = React.useState(false);
    // -----------------------------------------

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

    const handleOpenMetricModal = (metric) => {
        setSelectedMetric(metric);
        setIsMetricModalOpen(true);
    };

    const dureeOptions = [15, 20, 25, 30];

    // Convertir les options en état pour les rendre modifiables
    const [typeBienOptions, setTypeBienOptions] = React.useState(['Appartement', 'Maison', 'Immeuble', 'Commerce', 'Autre']);
    const [pebOptions, setPebOptions] = React.useState(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'N/C']);


    // --- ASSISTANT IA GÉNÉRAL (MODIFIÉ) ---
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
        /*
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
        */

        // --- POINT D'ENTRÉE ---
        if (user) {
            // 1. Utilisateur connecté
            // syncLocalAnalyses(user.id); // Vérifier s'il y a des données locales à synchroniser
            loadAnalysesFromCloud(user.id); // Charger les données du cloud
        } else {
            // 2. Utilisateur déconnecté
            loadAnalysesFromLocal();
        }

    }, [user]);

    React.useEffect(() => {
        const fetchUserPlan = async () => {
            if (user) {
                const { data: planData, error } = await supabase
                    .from('user_profile_plans')
                    .select(`
                        current_ai_credits,
                        profile_plans (
                            plan_name,
                            ai_credits,
                            stored_analysis
                        )
                    `)
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
                    console.error("Error fetching user plan:", error);
                } else if (planData) {
                    setUserPlan(planData);
                    setMaxAnalyses(planData.profile_plans.stored_analysis);
                }
            } else {
                setUserPlan(null);
                setMaxAnalyses(3); // Reset to default for logged-out users
            }
        };

        fetchUserPlan();
    }, [user, page]); // Also re-fetch when page changes to 'plans' to get updated info

    const handleStart = (destination = 'main') => {
        const newExpiry = Date.now() + (cacheDuration * 60 * 60 * 1000);
        localStorage.setItem('welcomeExpiry', newExpiry);
        setShowWelcome(false);
        setPage(destination); // Redirige vers la page d'analyse ou le dashboard
    };

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isLegalMenuOpen && !event.target.closest('.legal-menu-container')) {
                setIsLegalMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isLegalMenuOpen]);

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

        @media print {
            .print-hidden { display: none; }
            .print-block { display: block; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .printable-area { box-shadow: none; border: none; }
            main { padding: 0; }
            header, footer { display: none; }
        }
        `;
        styleElement.innerHTML += `
        @keyframes pulse-badge {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        @keyframes fade-in-down {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        `;
        document.head.appendChild(fontLink);
        document.head.appendChild(styleElement);

        // Check if all settings are configured
        // const apiKey = localStorage.getItem('geminiApiKey');
        //const cacheDuration = localStorage.getItem('welcomeCacheDuration');
        //const maxAnalysesStored = localStorage.getItem('maxAnalyses');


        if (apiKey && cacheDuration && maxAnalysesStored) {
            setAllSettingsConfigured(true);
        }

        return () => { document.head.removeChild(fontLink); document.head.removeChild(styleElement); };
    }, []);

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
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            // Si un utilisateur connecté arrive sur la page 'auth', on le redirige vers le dashboard,
            // SAUF s'il est dans un flux de récupération de mot de passe (ce qui sera géré par AuthPage).
            if (hashParams.has('access_token') && hashParams.get('type') === 'recovery') {
                return;
            }
            setNotification({ msg: "Vous êtes déjà connecté.", type: 'success' });
            setPage('dashboard');
            return;

            // Redirige vers le dashboard ou la page en attente
            if (redirectAfterLogin) {
                setPage(redirectAfterLogin);
                setRedirectAfterLogin(null);
            } else {
                // --- NOUVELLE LOGIQUE ---
                // Vérifier si la page d'accueil doit être montrée en respectant le cache
                const expiry = localStorage.getItem('welcomeExpiry');
                const shouldShowWelcome = !expiry || parseInt(expiry) < Date.now();

                if (shouldShowWelcome) {
                    setShowWelcome(true);
                } else {
                    setPage('dashboard'); // Sinon, aller directement au tableau de bord
                }
            }
        }
    }, [user, page, redirectAfterLogin]);

    const handleSignOut = async () => {
        // Fermer toutes les modales
        setIsSignOutModalOpen(false);
        setIsProfileModalOpen(false);
        // Déconnecter l'utilisateur
        await signOut();
        // Réinitialiser l'état de l'analyse en cours
        setData(initialDataState);
        setResult(null);
        setCurrentAnalysisId(null);
        // Afficher la notification et rediriger
        setNotification({ msg: 'Vous avez été déconnecté avec succès.', type: 'success' });
        setShowWelcome(false); // S'assure que la page d'accueil n'est pas affichée
        setPage('auth'); // Redirige vers la page de connexion
    };


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

    const handleTravauxUpdate = (total, items) => {
        setData(d => ({ ...d, coutTravaux: total, travauxDetail: items }));
        setIsEstimatorOpen(false);
        // La ligne de calcul d'apport a été supprimée, l'useEffect s'en charge
    };
    // const handleTravauxUpdate = (newValue) => {
    //     setData(d => ({ ...d, coutTravaux: newValue }));
    //     setIsEstimatorOpen(false);
    // };
    const handleTensionUpdate = (newValue) => { setData(d => ({ ...d, tensionLocative: newValue })); setIsTensionEstimatorOpen(false); };
    const handleVacancyUpdate = (newValue) => { setData(d => ({ ...d, vacanceLocative: newValue })); setIsVacancyEstimatorOpen(false); };
    const handleChargesUpdate = (total, items) => {
        setData(d => ({ ...d, chargesMensuelles: total, chargesDetail: items }));
        setIsChargesEstimatorOpen(false);
    };

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

        const rendementNet = finances.coutTotalProjet > 0 ? ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / finances.coutTotalProjet) * 100 : 0;
        
        const cashflowMensuel = (data.loyerEstime || 0) - (data.chargesMensuelles || 0) - finances.mensualiteEstimee;
        const cashflowAnnuel = cashflowMensuel * 12;

        let grade = 'E';
        let motivation = "Rendement faible ou négatif.";
        let score = 0;
        let yearsToRecover = null;
        let cashOnCash = null;

        if ((data.apport || 0) <= 0) {
            if (cashflowAnnuel > 0) { // Infinite return
                const bestScore = scoreConfig.cashflowScore[0];
                grade = bestScore.grade;
                motivation = bestScore.comment;
                score = 100;
                yearsToRecover = 0;
                cashOnCash = Infinity;
            } else { // No investment, no return
                const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
                grade = worstScore.grade;
                motivation = worstScore.comment;
                score = 10;
            }
        } else if (cashflowAnnuel <= 0) {
            const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
            grade = worstScore.grade;
            motivation = worstScore.comment;
            score = 10;
            cashOnCash = (cashflowAnnuel / data.apport) * 100;
        } else {
            yearsToRecover = (data.apport || 0) / cashflowAnnuel;
            cashOnCash = (cashflowAnnuel / data.apport) * 100;
            
            const foundTier = scoreConfig.cashflowScore.find(tier => yearsToRecover >= tier.minYears && yearsToRecover < tier.maxYears);

            if (foundTier) {
                grade = foundTier.grade;
                motivation = foundTier.comment;
            } else {
                // Should not happen if config is correct, but as a fallback
                const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
                grade = worstScore.grade;
                motivation = worstScore.comment;
            }
            
            // Map grades to a 0-100 score for the UI
            switch(grade) {
                case 'A': score = 95; break;
                case 'B': score = 80; break;
                case 'C': score = 60; break;
                case 'D': score = 40; break;
                case 'E': score = 20; break;
                default: score = 0;
            }
        }

        const newResult = {
            rendementNet: isFinite(rendementNet) ? rendementNet.toFixed(2) : '0.00',
            cashflowMensuel: cashflowMensuel.toFixed(2),
            mensualiteCredit: finances.mensualiteEstimee.toFixed(2),
            coutTotal: finances.coutTotalProjet.toFixed(0),
            grade,
            motivation,
            score: Math.round(score),
            yearsToRecover,
            cashOnCash
        };

        setResult(newResult);
        setNotification({ msg: '', type: '' });
    };

    const handleOpenSaveModal = () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (!data.ville || !data.ville.trim()) {
            setNotification({ msg: 'Le champ "Adresse/ Ville / Commune" est obligatoire.', type: 'error' });
            setTimeout(() => setNotification({ msg: '', type: '' }), 5000);
            return;
        }

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
                    result: result,
                    created_at: new Date().toISOString()
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
            const newAnalysis = { id: generateUniqueId(), data: currentDataWithNewName, result: result };
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
            const loadedData = analysisToLoad.data || initialDataState;
            setData(loadedData);
            setResult(analysisToLoad.result);
            // Recalculer les finances immédiatement pour éviter l'erreur de rendu
            setFinances(calculateFinances(loadedData));
            setCurrentAnalysisId(id);
            setPage('main');

            // --- RÉINITIALISATION DE L'ASSISTANT IA ---
            setAiInput('');
            setAiPrompt('');
            setGeminiResponse('');
            setGeminiError('');
            setShowAiResponseActions(false);
            setIsAiAssistantOpen(false); // On ferme l'accordéon pour une interface propre
        }
    };

    const viewAnalysis = (id) => {
        const analysisToView = analyses.find(a => a.id === id);
        if (analysisToView) {
            setViewingAnalysis(analysisToView);
            setPage('view-analysis');
        }
    };


    const handleNewProject = () => {
        setData(initialDataState);
        setResult(null);
        setCurrentAnalysisId(null);
        setFinances(calculateFinances(initialDataState));

        // Réinitialisation de l'assistant IA
        setAiInput('');
        setAiPrompt('');
        setGeminiResponse('');
        setGeminiError('');
        setShowAiResponseActions(false);
        setIsAiAssistantOpen(false);

        setNotification({ msg: 'Formulaire réinitialisé pour un nouveau projet.', type: 'success' });
        setTimeout(() => setNotification({ msg: '', type: '' }), 4000);

        setPage('main'); // Redirige vers la page d'analyse
    };

    const handleUpdateAnalysisName = async (id, newName) => {
        // Vérifier si le nom existe déjà (en excluant l'analyse actuelle)
        if (analyses.some(a => a.id !== id && (a.project_name || a.data.projectName) === newName)) {
            setNotification({ msg: 'Ce nom de projet existe déjà.', type: 'error' });
            setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
            return;
        }

        const analysisToUpdate = analyses.find(a => a.id === id);
        if (!analysisToUpdate) return;

        // Mettre à jour la propriété 'projectName' dans l'objet 'data'
        const updatedData = { ...analysisToUpdate.data, projectName: newName };

        if (user) {
            const { error } = await supabase
                .from('analyses')
                .update({ project_name: newName, data: updatedData })
                .eq('id', id);
            if (error) { /* Gérer l'erreur */ return; }
        } else {
            const updatedAnalyses = analyses.map(a => a.id === id ? { ...a, project_name: newName, data: updatedData } : a);
            localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        }

        // Mettre à jour l'état local pour un rafraîchissement immédiat
        setAnalyses(analyses.map(a => a.id === id ? { ...a, project_name: newName, data: updatedData } : a));
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
        const systemPrompt = `Tu es un assistant expert polyvalent dans le domaine de l'immobilier en Belgique. Ton rôle est d'analyser des annonces, des textes ou des questions et de fournir des réponses structurées. Si on te demande d'extraire des informations, présente-les de façon claire, cohérente et concise. Pour une annonce, voici les champs importants : Type de bien, score PEB, Surface, Revenu Cadastral, Prix, Adresse, Conformité électrique, Conformité urbanistique, conformité locative, travaux à prévoir, travaux votés en AG, travaux de mise en conformité, et autres informations pertinentes pour un investisseur. Si une information n'est pas présente, indique "Non spécifié". Si la question sort du cadre de l'immobilier belge, décline poliment en commençant ta réponse par "Je suis désolé", tente de rediriger l'utilisateur vers des ressources appropriées.`;
        
        // Construit le prompt final
        const finalPrompt = `${aiPrompt}\n\nVoici le contexte à analyser (texte ou URL) :\n\n${aiInput}`;
        
        callGeminiAPI(systemPrompt, finalPrompt, setIsGeminiLoading, setGeminiError, (response) => {
            setGeminiResponse(response);
            if (response) { 
                const isOutOfScopeResponse = /désolé|sort de mon cadre|ma spécialité|mon rôle est limité|sort du cadre de l'immobilier/i.test(response);
                setShowAiResponseActions(!isOutOfScopeResponse);

                // Décompter un crédit si la réponse est pertinente et que l'utilisateur est connecté
                if (!isOutOfScopeResponse && user && userPlan && userPlan.current_ai_credits !== -1) {
                    const newCreditCount = Math.max(0, userPlan.current_ai_credits - 1);

                    // Mettre à jour l'état local immédiatement
                    setUserPlan(prevPlan => ({
                        ...prevPlan,
                        current_ai_credits: newCreditCount
                    }));

                    // Mettre à jour la base de données en arrière-plan
                    const decrementCredits = async () => {
                        const { error } = await supabase
                            .from('user_profile_plans')
                            .update({ current_ai_credits: newCreditCount })
                            .eq('user_id', user.id);
                        if (error) {
                            console.error("Erreur lors de la mise à jour des crédits :", error);
                        }
                    };
                    decrementCredits();
                }
            }
        });
    };

    const handleSaveAiResponse = () => {
        setData(prev => ({ ...prev, descriptionBien: (prev.descriptionBien || '') + '\n\n--- Réponse IA ---\n' + geminiResponse }));
        setShowAiResponseActions(false); // Cache les boutons
        setNotification({ msg: 'Réponse IA ajoutée aux notes !', type: 'success' });
        setTimeout(() => setNotification({ msg: '', type: '' }), 4000);
    };

    const handleIgnoreAiResponse = () => {
        setShowAiResponseActions(false); // Cache simplement les boutons
    };

    const handleApplyAiResponse = () => {
        setIsApplyingAi(true);

        // Un léger délai pour s'assurer que l'état de chargement est visible
        setTimeout(() => {
            const responseText = geminiResponse;
            let updatedData = {};

            const extract = (regex) => {
                const match = responseText.match(regex);
                return match ? match[1].trim() : null;
            };

            const typeBien = extract(/\*\*Type de bien:\*\*\s*(.*)/i);
            if (typeBien && !typeBienOptions.includes(typeBien)) {
                setTypeBienOptions(prev => [...prev, typeBien]);
            }
            if (typeBien) updatedData.typeBien = typeBien;

            const peb = extract(/\*\*Score PEB:\*\*\s*([A-G]\+?)/i);
            if (peb) updatedData.peb = peb;

            const surface = extract(/\*\*Surface:\*\*\s*(\d+)/i);
            if (surface) updatedData.surface = parseInt(surface, 10);

            const revenuCadastral = extract(/\*\*Revenu Cadastral:\*\*\s*([\d\s.,]+)/i);
            if (revenuCadastral) updatedData.revenuCadastral = parseInt(revenuCadastral.replace(/[.\s€]/g, ''), 10);

            const prixAchatMatch = extract(/\*\*Prix:\*\*.*?((\d{1,3}(?:[.\s]?\d{3})*))[,€]?/i);
            if (prixAchatMatch) updatedData.prixAchat = parseInt(prixAchatMatch.replace(/[.\s]/g, ''), 10);

            const adresse = extract(/\*\*Adresse:\*\*\s*(.*)/i);
            if (adresse) updatedData.ville = adresse;

            const electricite = extract(/\*\*Conformité électrique:\*\*\s*(.*)/i);
            if (electricite) updatedData.electriciteConforme = !/non\s*conforme/i.test(electricite);

            const urbanisme = extract(/\*\*Conformité urbanistique:\*\*\s*(.*)/i);
            if (urbanisme) updatedData.enOrdreUrbanistique = !/non\s*conforme|demande\s*en\s*cours/i.test(urbanisme);

            const loyer = extract(/Revenu locatif actuel\s*:\s*([\d.,]+)€/i);
            if (loyer) updatedData.loyerEstime = parseInt(loyer.replace(/[.,\s]/g, ''), 10);

            // --- NOUVELLE LOGIQUE : EXTRACTION DES TAUX D'INTÉRÊT ---
            // Priorité 1: Chercher le taux pour 25 ans par défaut.
            let tauxMatch = responseText.match(/Taux(?:.*?)sur\s*25\s*ans\s*:\s*([\d,.]+)%/i);
            
            if (tauxMatch) {
                // Taux pour 25 ans trouvé, on l'applique et on met à jour la durée.
                const tauxExtrait = parseFloat(tauxMatch[1].replace(',', '.'));
                if (!isNaN(tauxExtrait)) {
                    updatedData.tauxCredit = tauxExtrait;
                    updatedData.dureeCredit = 25; // Mettre à jour la durée pour correspondre
                }
            } else {
                // Priorité 2 (fallback): Chercher le taux pour la durée actuelle du formulaire.
                const currentDuree = data.dureeCredit;
                tauxMatch = responseText.match(new RegExp(`Taux(?:.*?)sur\\s*${currentDuree}\\s*ans\\s*:\\s*([\\d,.]+)%`, "i"));
                if (tauxMatch) {
                    const tauxExtrait = parseFloat(tauxMatch[1].replace(',', '.'));
                    if (!isNaN(tauxExtrait)) {
                        updatedData.tauxCredit = tauxExtrait;
                    }
                }
            }

            if (Object.keys(updatedData).length > 0) {
                setData(prev => ({ ...prev, ...updatedData }));
                setNotification({ msg: 'Les informations ont été appliquées au formulaire !', type: 'success' });
            } else {
                setNotification({ msg: "Aucune information n'a pu être extraite de la réponse.", type: 'error' });
            }

            setShowAiResponseActions(false);
            setTimeout(() => setNotification({ msg: '', type: '' }), 2000);
            setIsApplyingAi(false);
        }, 100);
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

    const handleAiAssistantToggle = () => {
        const hasCredits = userPlan && (userPlan.current_ai_credits > 0 || userPlan.current_ai_credits === -1);
        if (user && !hasCredits) {
            setNotification({
                msg: "Vous n'avez plus de crédits IA. Rechargez pour continuer.",
                type: 'error'
            });
            setTimeout(() => {
                setNotification({ msg: '', type: '' });
                setPage('plans'); // Navigate to plans page
            }, 2500);
        } else {
            setIsAiAssistantOpen(!isAiAssistantOpen);
        }
    };

    const checkAiCredits = () => {
        const hasNoCredits = user && userPlan && userPlan.current_ai_credits === 0;
        if (hasNoCredits) {
            setIsCreditModalOpen(true); // Ouvre la modale de confirmation
            return false; // Indique que l'utilisateur n'a pas de crédits
        }
        return true; // Indique que l'utilisateur a des crédits
    };

    const getAiButtonTooltip = () => {
        if (isGeminiLoading) {
            return "L'IA est déjà en train de réfléchir...";
        }
        if (!aiInput) {
            return "Veuillez coller le texte d'une annonce ou une URL.";
        }
        if (!aiPrompt) {
            return "Veuillez choisir une action à effectuer.";
        }
        if (userPlan && userPlan.current_ai_credits === 0) {
            return "Vous n'avez plus de crédits IA.";
        }
        return "Lancer l'analyse par l'IA"; // Texte par défaut quand le bouton est actif
    };

// --- NOUVEAU COMPOSANT : AccordionSection ---
const AccordionSection = ({ id, title, icon, isOpen, onToggle, children }) => (
    <div className="bg-white rounded-lg shadow-md transition-all duration-300">
        <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => onToggle(id)}
        >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                {icon}
                <span>{title}</span>
            </h2>
            <ChevronDownIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
            <div className="p-4 border-t animate-fade-in">{children}</div>
        )}
    </div>
);

    const renderPage = () => {
        console.log('Rendering page:', page);
        switch (page) {
            case 'aide': return <HelpHubPage onNavigate={setPage} />;
            case 'user-manual': return <UserManualPage onBack={() => setPage('aide')} />;
            case 'knowledge': return <KnowledgePage onBack={() => setPage('aide')} />;
            case 'glossary': return <GlossaryPage onBack={() => setPage('aide')} />;
            case 'view-analysis': return <AnalysisViewPage analysis={viewingAnalysis} onBack={() => setPage('dashboard')} />;
            case 'settings': return <SettingsPage onBack={() => setPage('main')} maxAnalyses={maxAnalyses} />;
            case 'dashboard': return <DashboardPage analyses={analyses} onLoad={loadAnalysis} onDelete={deleteAnalysis} onUpdateName={handleUpdateAnalysisName} maxAnalyses={maxAnalyses} onView={viewAnalysis} />;
            case 'auth': return <AuthPage onBack={() => setPage('main')} onNavigate={setPage} initialMode={authPageInitialMode} setNotification={setNotification} />;
            case 'account': return <AccountPage onBack={() => setPage('main')} onNavigate={setPage} userPlan={userPlan} analysesCount={analyses.length} setNotification={setNotification} />;
            case 'feedback': return <FeedbackPage onBack={() => setPage('main')} setNotification={setNotification} />;
            case 'privacy': return <PrivacyPolicyPage onBack={() => setPage('main')} />;
            case 'terms': return <TermsOfServicePage onBack={() => setPage('main')} />;
            case 'plans': return <PlansPage userPlan={userPlan} onBack={() => setPage('main')} setNotification={setNotification} onNavigate={setPage} />;
            default:

                // --- NOUVEL ÉTAT POUR L'ACCORDÉON ---
                const [activeSection, setActiveSection] = React.useState('bien');
                const handleToggleSection = (sectionId) => {
                    setActiveSection(activeSection === sectionId ? null : sectionId);
                };

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
                        <AccordionSection 
                            id="bien"
                            title="1. Bien Immobilier"
                            icon={<HomeIcon />}
                            isOpen={activeSection === 'bien'}
                            onToggle={handleToggleSection}
                        >

                            {/* --- Indicateur d'état (Nouveau / Édition) --- */}
                            {currentAnalysisId ? (
                                <div className="mb-4 p-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2 text-sm text-purple-800">
                                    <PencilIcon />
                                    <span>Édition de : <strong>{data.projectName}</strong></span>
                                </div>
                            ) : (
                                <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-800">
                                    <PlusCircleIcon />
                                    <span>Nouvelle Analyse</span>
                                </div>
                            )}
                            

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

                            {/* --- NOM, VILLE, SURFACE, RC --- */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">                                
                                <div class="hidden"><label className="block text-sm font-medium">Nom du Projet</label><input type="text" name="projectName" value={data.projectName} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Surface (m²)</label><input type="number" name="surface" value={data.surface} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Revenu Cadastral (€)</label><input type="number" name="revenuCadastral" value={data.revenuCadastral} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                                <div><label className="block text-sm font-medium">Adresse/ Ville / Commune <span className='text-red-400'>*</span></label><input type="text" name="ville" value={data.ville} onChange={handleInputChange} required placeholder='Rue de Strady 1, 5000 Namur' className="mt-1 w-full p-2 border rounded-md" /></div>
                            </div>

                            
                            {/* --- Urbanisme et Électricité --- */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">En ordre urbanistique ?</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDataChange('enOrdreUrbanistique', true)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => handleDataChange('enOrdreUrbanistique', false)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Électricité conforme ?</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDataChange('electriciteConforme', true)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => handleDataChange('electriciteConforme', false)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                            </div>


                            {/* --- NOTES --- */}
                            <div className="mt-4"><label className="block text-sm font-medium">Notes</label><textarea name="descriptionBien" value={data.descriptionBien} onChange={handleInputChange} rows="4" className="mt-1 w-full p-2 border rounded-md" placeholder='Quartier calme, Prévoir travaux SDB, Gros œuvre OK...'></textarea></div>
                        </AccordionSection>

                        {/* ---  Assistant IA Général (Déplacé et modifiable) --- */}
                        {user && (
                        <AccordionSection
                            id="ia"
                            title="2. Assistant Immobilier IA (Optionnel)"
                            icon={<SparklesIcon />}
                            isOpen={activeSection === 'ia'}
                            onToggle={handleToggleSection}
                        >
                            {userPlan && userPlan.current_ai_credits === 0 && (
                                <p className="text-sm text-red-600 mb-3">Vous n'avez plus de crédits IA. <span className="underline cursor-pointer" onClick={() => setPage('plans')}>Rechargez</span> pour utiliser cette fonctionnalité.</p>
                            )}
                            
                            {isAiAssistantOpen && (
                                <div className="mt-4 pt-4 border-t animate-fade-in">
                                    <p className="text-sm text-gray-500 mb-3">Collez le texte d'une annonce ou une URL, choisissez une action, puis interrogez l'IA.</p>
                                     
                                    <div className="space-y-4">
                                        <textarea
                                            name="aiInput"
                                            value={aiInput}
                                            onChange={(e) => {
                                                if (checkAiCredits()) setAiInput(e.target.value);
                                            }}
                                            rows="5"
                                            placeholder="Collez un texte, une URL..."
                                            className="w-full p-2 border rounded-md"
                                        />

                                        <div className="mt-4">
                                        {prePromptConfig.map((group) => (
                                            <div key={group.category} className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">{group.category}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {group.prompts.map((promptText) => (
                                                <button
                                                    key={promptText}
                                                    onClick={() => {
                                                        if (checkAiCredits()) setAiPrompt(promptText);
                                                    }}
                                                    className={`text-sm py-1 px-3 rounded-full transition border-2 ${aiPrompt === promptText ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-100 text-gray-800 border-gray-100 hover:border-gray-300'}`}
                                                >
                                                    {promptText}
                                                </button>
                                                ))}
                                            </div>
                                            </div>
                                        ))}
                                        </div>

                                        <button
                                            onClick={handleGeneralQuery}
                                            disabled={isGeminiLoading || !aiInput || !aiPrompt || (userPlan && userPlan.current_ai_credits === 0)}
                                            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 disabled:bg-purple-300 disabled:cursor-help"
                                            title={getAiButtonTooltip()}
                                        >
                                            {isGeminiLoading ? 'Recherche...' : "Interroger l'IA"}
                                        </button>
                                    </div>

                                    {geminiError && !isGeminiLoading && <p className="text-red-500 text-sm mt-2">{geminiError}</p>}
                                    {isGeminiLoading && <div className="text-center p-4 text-sm text-gray-600">L'IA recherche la meilleure réponse...</div>}
                                
                                    {geminiResponse && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                            <h3 className="font-semibold mb-2 text-gray-800">Réponse de l'assistant :</h3>
                                            <div className="text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none mb-4">{geminiResponse}</div>
                                            <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                                <div className="flex-shrink-0 text-yellow-500 pt-0.5">
                                                    <AlertTriangleIcon />
                                                </div>
                                                <p className="text-xs text-yellow-800"><strong>Avertissement :</strong> L'assistant IA peut commettre des erreurs. Pensez à toujours vérifier les informations importantes par vous-même.</p>
                                            </div>
                                            {showAiResponseActions && (
                                                (() => {
                                                    // Vérifier si au moins une donnée pertinente peut être extraite
                                                    const isPriceExtractable = geminiResponse.match(/\*\*Prix:\*\*.*?((\d{1,3}(?:[.\s]?\d{3})*))/i);
                                                    const isSurfaceExtractable = geminiResponse.match(/\*\*Surface:\*\*\s*(\d+)/i);
                                                    const isRateExtractable = geminiResponse.match(/Taux(?:.*?)sur\s*\d{1,2}\s*ans\s*:\s*([\d,.]+)%/i);
                                                    const canApply = isPriceExtractable || isSurfaceExtractable || isRateExtractable;

                                                return (
                                                <div className="flex justify-end gap-3 border-t pt-3">
                                                    <button onClick={handleIgnoreAiResponse} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Ignorer</button>
                                                    <button 
                                                        onClick={handleApplyAiResponse} 
                                                        disabled={isApplyingAi || !canApply}
                                                        className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                                                        title={!canApply ? "Aucune donnée pertinente (prix, surface, taux) n'a été trouvée." : "Appliquer les données au formulaire"}
                                                    >
                                                        {isApplyingAi ? 'Application...' : 'Appliquer au formulaire'}
                                                    </button>
                                                    <button onClick={handleSaveAiResponse} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Sauvegarder dans les notes</button>
                                                </div>
                                                )
                                            })()
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </AccordionSection>
                        )}

                        <AccordionSection
                            id="financement"
                            title="3. Financement"
                            icon={<WalletIcon />}
                            isOpen={activeSection === 'financement'}
                            onToggle={handleToggleSection}
                        >
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
                                    <p className="text-xs text-gray-500 mt-1">Estimation auto. Pour un calcul précis, demandez à votre notaire une prévision des coûts (notaire.be)</p>
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
                                <div><p className="text-sm text-gray-600">Montant à financer</p><p className="text-lg font-bold text-blue-700">{(finances.montantAFinancer || 0).toLocaleString('fr-BE')} €</p></div>
                                <div><p className="text-sm text-gray-600">Mensualité estimée</p><p className="text-lg font-bold text-red-600">{(finances.mensualiteEstimee || 0).toFixed(2)} €</p></div>
                            </div>
                        </AccordionSection>

                        <AccordionSection
                            id="loyer"
                            title="4. Loyer et Charges"
                            icon={<TrendingUpIcon />}
                            isOpen={activeSection === 'loyer'}
                            onToggle={handleToggleSection}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><label className="block text-sm font-medium">Loyer hors charges (€/mois)</label><input type="number" name="loyerEstime" value={data.loyerEstime} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" placeholder="900 € HC"/></div>
                                <div><label className="block text-sm font-medium">Charges d'exploitation (€/mois)</label><div className="flex items-center gap-2 mt-1"><input type="number" name="chargesMensuelles" value={data.chargesMensuelles} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="w-full p-2 border rounded-md" /><button onClick={() => setIsChargesEstimatorOpen(true)} title="Aide à l'évaluation des charges" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><ClipboardListIcon /></button></div></div>

                                <div className="md:col-span-2 hidden"><label className="block text-sm font-medium">Tension locative (1-10)</label><div className="flex items-center gap-2 mt-1">
                                    {/* MODIFIÉ: Ajout de className="range-slider-good-high" */}
                                    <input type="range" min="1" max="10" name="tensionLocative" value={data.tensionLocative} onChange={handleInputChange} className="w-full range-slider-good-high" />
                                    <div className="font-semibold text-lg w-12 text-center">{data.tensionLocative}</div>
                                    <button onClick={() => setIsTensionEstimatorOpen(true)} title="Aide à l'évaluation" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><TrendingUpIcon /></button>
                                </div></div>

                                <div className="md:col-span-2 hidden"><label className="block text-sm font-medium">Vacance locative (%)</label><div className="flex items-center gap-2 mt-1">
                                    {/* MODIFIÉ: Remplacement de className par "range-slider-good-low" */}
                                    <input type="range" min="1" max="25" name="vacanceLocative" value={data.vacanceLocative} onChange={handleInputChange} className="w-full range-slider-good-low" />
                                    <div className="font-semibold text-lg w-12 text-center">{data.vacanceLocative}</div>
                                    <button onClick={() => setIsVacancyEstimatorOpen(true)} title="Aide à l'évaluation" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><PercentIcon /></button>
                                </div></div>

                            </div>                        
                        </AccordionSection>

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
                                        <div className="flex gap-2">
                                            {currentAnalysisId && (
                                                <button onClick={() => viewAnalysis(currentAnalysisId)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2" title="Visualiser le rapport de synthèse">
                                                    <EyeIcon /> Visualiser
                                                </button>
                                            )}
                                            <button
                                                onClick={handleOpenSaveModal}
                                                className={`text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all ${currentAnalysisId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                                                title={currentAnalysisId ? "Met à jour l'analyse actuelle" : "Sauvegarder l'analyse"}>
                                                {currentAnalysisId ? <FileCheckIcon /> : <SaveIcon />}
                                                {currentAnalysisId ? 'Mettre à jour' : 'Sauvegarder'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={`text-center p-4 rounded-lg mb-4 ${
                                    result.grade === 'A' ? 'bg-green-100' :
                                    result.grade === 'B' ? 'bg-green-50' :
                                    result.grade === 'C' ? 'bg-yellow-50' :
                                    result.grade === 'D' ? 'bg-orange-50' :
                                    'bg-red-100'
                                }`}>
                                    <span className={`text-6xl font-black ${
                                        result.grade === 'A' ? 'text-green-800' :
                                        result.grade === 'B' ? 'text-green-500' :
                                        result.grade === 'C' ? 'text-yellow-500' :
                                        result.grade === 'D' ? 'text-orange-500' :
                                        'text-red-800'
                                    }`}>{result.grade}</span>
                                    {result.yearsToRecover !== null && <p className="font-semibold text-md mt-2">Retour sur apport en {result.yearsToRecover.toFixed(0)} ans</p>}
                                    <p className="font-mono text-sm mt-2">{result.motivation}</p>
                                    <p className="font-mono text-sm mt-1 flex items-center justify-center">
                                        Score Strady 
                                        <button onClick={() => setIsScoreModalOpen(true)} className="ml-1">
                                            <QuestionMarkIcon />
                                        </button>
                                    </p>                                        
                                    </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                 
                                    {user && (
                                        <>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm flex items-center justify-center gap-1">
                                                    Rendement Net
                                                    <button onClick={() => handleOpenMetricModal('rendementNet')} className="text-gray-400 hover:text-blue-600">
                                                        <QuestionMarkIcon />
                                                    </button>
                                                </p>
                                                <p className={`text-xl font-bold ${
                                                result.grade === 'A' ? 'text-green-800' :
                                                result.grade === 'B' ? 'text-green-500' :
                                                result.grade === 'C' ? 'text-yellow-500' :
                                                result.grade === 'D' ? 'text-orange-500' :
                                                'text-red-800'
                                            }`}>{result.rendementNet} %</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm flex items-center justify-center gap-1">
                                                    Cash-on-Cash
                                                    <button onClick={() => handleOpenMetricModal('cashOnCash')} className="text-gray-400 hover:text-blue-600">
                                                        <QuestionMarkIcon />
                                                    </button>
                                                </p>
                                                <p className={`text-xl font-bold ${
                                                result.grade === 'A' ? 'text-green-800' :
                                                result.grade === 'B' ? 'text-green-500' :
                                                result.grade === 'C' ? 'text-yellow-500' :
                                                result.grade === 'D' ? 'text-orange-500' :
                                                'text-red-800'
                                            }`}>{result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                    
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm flex items-center justify-center gap-1">
                                            Cash-Flow / mois
                                            <button onClick={() => handleOpenMetricModal('cashflow')} className="text-gray-400 hover:text-blue-600">
                                                <QuestionMarkIcon />
                                            </button>
                                        </p>
                                        <p className={`text-xl font-bold ${
                                        result.grade === 'A' ? 'text-green-800' :
                                        result.grade === 'B' ? 'text-green-500' :
                                        result.grade === 'C' ? 'text-yellow-500' :
                                        result.grade === 'D' ? 'text-orange-500' :
                                        'text-red-800'
                                    }`}>{result.cashflowMensuel} €</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm flex items-center justify-center gap-1">
                                            Mensualité Crédit
                                            <button onClick={() => handleOpenMetricModal('mensualiteCredit')} className="text-gray-400 hover:text-blue-600">
                                                <QuestionMarkIcon />
                                            </button>
                                        </p><p className="text-xl font-bold">{result.mensualiteCredit} €</p></div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm flex items-center justify-center gap-1">
                                            Coût Total
                                            <button onClick={() => handleOpenMetricModal('coutTotal')} className="text-gray-400 hover:text-blue-600">
                                                <QuestionMarkIcon />
                                            </button>
                                        </p><p className="text-xl font-bold">{parseInt(result.coutTotal).toLocaleString('fr-BE')} €</p></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-transparent p-6 rounded-lg text-center text-gray-600">
                            </div>
                        )}
                    </div>
                );
        }
    };

    if (showWelcome) {
        return <WelcomePage onStart={handleStart} onNavigate={setPage} user={user} />;
    }

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-10"><div className="max-w-4xl mx-auto p-4"><Logo /></div></header>
            <Notification 
                message={notification.msg} 
                type={notification.type} 
                onClose={() => setNotification({ msg: '', type: '' })} 
            />

                        <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24 pt-20">
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    onNavigate={setPage}
                    onSignOut={() => setIsSignOutModalOpen(true)}
                    user={user}
                    userPlan={userPlan}
                    analyses={analyses}
                />
                <RenovationEstimatorModal isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} onApply={handleTravauxUpdate} />
                <TensionLocativeEstimatorModal isOpen={isTensionEstimatorOpen} onClose={() => setIsTensionEstimatorOpen(false)} onApply={handleTensionUpdate} />
                <VacancyEstimatorModal isOpen={isVacancyEstimatorOpen} onClose={() => setIsVacancyEstimatorOpen(false)} onApply={handleVacancyUpdate} currentTension={data.tensionLocative} />
                <ChargesEstimatorModal isOpen={isChargesEstimatorOpen} onClose={() => setIsChargesEstimatorOpen(false)} onApply={handleChargesUpdate} data={data} />
                <AcquisitionFeesEstimatorModal
                    isOpen={isAcquisitionFeesEstimatorOpen}
                    onClose={() => setIsAcquisitionFeesEstimatorOpen(false)}
                    onApply={handleAcquisitionFeesUpdate}
                    prixAchat={data.prixAchat}
                />
                <MetricExplanationModal 
                    isOpen={isMetricModalOpen} 
                    onClose={() => setIsMetricModalOpen(false)} 
                    metric={selectedMetric} 
                />
                <ScoreExplanationModal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} />
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
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onConfirm={() => {
                setAuthPageInitialMode('signUp');
                setPage('auth');
                setIsAuthModalOpen(false);
            }}
            title="Accédez à toutes les fonctionnalités"
            confirmText="Créer un compte"
        >
            <p>Pour sauvegarder et gérer vos analyses, veuillez créer un compte gratuit.</p>
            <p className="mt-2 text-sm text-gray-600">C'est rapide et vous permettra de conserver votre historique.</p>
        </ConfirmationModal>

        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmer la Suppression"
            confirmText="Supprimer"
        >
            <p>Êtes-vous sûr de vouloir supprimer l'analyse : <strong>{analysisToDelete?.project_name || analysisToDelete?.data.projectName}</strong> ?</p>
            <p className="mt-2 text-sm text-red-600">Cette action est irréversible.</p>
        </ConfirmationModal>
        
        <ConfirmationModal
            isOpen={isCreditModalOpen}
            onClose={() => setIsCreditModalOpen(false)}
            onConfirm={() => {
                setPage('plans');
                setIsCreditModalOpen(false);
            }}
            title="Crédits IA épuisés"
            confirmText="Voir les abonnements"
        >
            <p>Vous n'avez plus de crédits pour utiliser l'assistant IA.</p>
            <p className="mt-2 text-sm text-gray-600">Pour continuer à bénéficier de l'analyse intelligente, veuillez recharger vos crédits.</p>
        </ConfirmationModal>

        <ConfirmationModal
            isOpen={isSignOutModalOpen}
            onClose={() => setIsSignOutModalOpen(false)}
            onConfirm={handleSignOut}
            title="Confirmation de déconnexion"
            confirmText="Se déconnecter"
        >
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <p className="mt-2 text-sm text-gray-600">Toute analyse non sauvegardée sera perdue.</p>
        </ConfirmationModal>

                                {/* --- NOUVEAU : Floating Action Button (FAB) pour l'évaluation --- */}
                                {!result && (
                                    <button
                                        onClick={calculateScore}
                                        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:bg-amber-500 transition-all duration-300 z-30 transform hover:scale-110 hover:shadow-xl"
                                        title="Évaluer le Projet"
                                    >
                                        <CalculatorIcon />
                                    </button>
                                )}

                                {renderPage()}
                            </main>

                            <footer className="bg-white border-t-2 shadow-top sticky bottom-0 left-0 right-0 z-20 print:hidden">
                                {/* --- FAB (Floating Action Button) --- */}
                                {/* Le FAB n'est visible que sur les pages où il est pertinent */}
                                {['dashboard', 'view-analysis'].includes(page) && (
                                    <button
                                        onClick={handleNewProject}
                                        className="absolute bottom-full right-6 mb-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:bg-amber-500 transition-all duration-300 z-30 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-400/50"
                                        title="Nouvelle analyse"
                                    >
                                        <PlusIcon />
                                    </button>
                                )}
                                <nav className="max-w-4xl mx-auto flex justify-around p-2">
                                    <button onClick={() => setPage('main')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'main' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><HomeIcon /><span className="text-xs font-medium">Analyse</span></button>
                                    {user && (
                                    <button onClick={() => setPage('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><DashboardIcon /><span className="text-xs font-medium">Mes analyses</span></button>
                                    )}
                                    <button onClick={() => setPage('aide')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${page === 'aide' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><HelpIcon /><span className="text-xs font-medium">Aide</span></button>
                                    {/** 
                                    <button onClick={() => setShowWelcome(true)} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${showWelcome ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}><StarIcon /><span className="text-xs font-medium">Accueil</span></button>
                                     **/}
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
                                <div className="relative text-center py-4 border-t legal-menu-container">
                                    {isLegalMenuOpen && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-md shadow-lg z-30 border animate-fade-in-fast">
                                            <button onClick={() => { setPage('privacy'); setIsLegalMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Politique de Confidentialité
                                            </button>
                                            <button onClick={() => { setPage('terms'); setIsLegalMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Conditions d'Utilisation
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex justify-center items-center gap-4">
                                        <p className="text-xs text-gray-500">© 2025 Strady.imo</p>
                                        <button 
                                            onClick={() => setIsLegalMenuOpen(!isLegalMenuOpen)} 
                                            className="text-gray-400 hover:text-blue-600"
                                            title="Informations légales"
                                        >
                                            <InfoIcon />
                                        </button>
                                    </div>
                                </div>
                            </footer>
                
                            {showCookieBanner && <CookieBanner onAccept={handleCookieConsent} />}
                        </div>
    );
}