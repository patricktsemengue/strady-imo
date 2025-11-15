import React from 'react';
import { useModal } from './contexts/useModal';
import { useAuth } from './hooks/useAuth';
import { PencilIcon, PlusCircleIcon, CalculatorIcon, LayersIcon, ClipboardListIcon, EyeIcon, FileCheckIcon, SaveIcon, QuestionMarkIcon } from './Icons';

// This component will hold the main analysis form
const AnalysisFormPage = ({ 
    currentAnalysisId,
    handleOpenSaveModal,
    viewAnalysis,
    data,
    handleDataChange,
    handleInputChange,
    handleNumericFocus,
    handleNumericBlur,
    finances,
    result,
    calculateScore,
    typeBienOptions,
    pebOptions,
}) => {
    const { user } = useAuth();
    const { 
        setIsEstimatorOpen,
        setIsAcquisitionFeesEstimatorOpen,
        setIsRentSplitterOpen,
        setIsChargesEstimatorOpen,
        setIsScoreModalOpen,
        setSelectedMetric,
        setIsMetricModalOpen,
    } = useModal();

    const handleOpenMetricModal = (metric) => {
        setSelectedMetric(metric);
        setIsMetricModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* --- Section 1: Détails du Bien --- */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Bien immobilier</h2>
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
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="hidden"><label className="block text-sm font-medium">Nom du Projet</label><input type="text" name="projectName" value={data.projectName} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Surface (m²)</label><input type="number" name="surface" value={data.surface} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Revenu Cadastral (€)</label><input type="number" name="revenuCadastral" value={data.revenuCadastral} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">Adresse/ Ville / Commune <span className='text-red-400'>*</span></label><input type="text" name="ville" value={data.ville} onChange={handleInputChange} required placeholder='Rue de Strady 1, 5000 Namur' className="mt-1 w-full p-2 border rounded-md" /></div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">En ordre urbanistique ?</label>
                        <div className="flex gap-2">
                            <button onClick={() => handleDataChange('enOrdreUrbanistique', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Oui</button>
                            <button onClick={() => handleDataChange('enOrdreUrbanistique', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Non</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Électricité conforme ?</label>
                        <div className="flex gap-2">
                            <button onClick={() => handleDataChange('electriciteConforme', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Oui</button>
                            <button onClick={() => handleDataChange('electriciteConforme', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Non</button>
                        </div>
                    </div>
                </div>
                <div className="mt-4"><label className="block text-sm font-medium">Notes</label><textarea name="descriptionBien" value={data.descriptionBien} onChange={handleInputChange} rows="4" className="mt-1 w-full p-2 border rounded-md" placeholder='Quartier calme, Prévoir travaux SDB, Gros œuvre OK...'></textarea></div>
            </div>

            {/* --- Section 2: Coûts & Financement --- */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Financement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Prix d'achat (€)</label><input type="number" name="prixAchat" value={data.prixAchat} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Coût travaux (€)</label><div className="flex items-center gap-2"><input type="number" name="coutTravaux" value={data.coutTravaux} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /><button onClick={() => setIsEstimatorOpen(true)} title="Estimer le coût des travaux" className="p-2 mt-1 bg-gray-200 hover:bg-gray-300 rounded-md"><CalculatorIcon /></button></div></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Frais d'acquisition (€)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" name="fraisAcquisition" value={data.fraisAcquisition} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                            <button onClick={() => setIsAcquisitionFeesEstimatorOpen(true)} className="mt-1 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" title="Calculateur détaillé"><CalculatorIcon /></button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Estimation auto. Pour un calcul précis, demandez à votre notaire une prévision des coûts (notaire.be)</p>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Frais annexes (€)</label><input type="number" name="fraisAnnexe" value={data.fraisAnnexe} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} placeholder="Agence, hypothèque..." className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Quotité d'emprunt</label>
                        <p className="text-xs text-gray-500 mt-1 mb-2">Part du prix d'achat et des travaux financée par la banque. L'apport est calculé automatiquement.</p>
                        <div className="flex flex-wrap gap-2">
                            {[70, 80, 90, 100, 125].map((q) => (
                                <button key={q} type="button" onClick={() => handleInputChange({ target: { name: 'quotite', value: q, type: 'number' } })} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.quotite === q ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{q}%</button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Apport personnel (€)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" name="apport" value={data.apport} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{data.quotite === 'custom' ? "L'apport est en mode manuel. Sélectionnez une quotité pour réactiver le calcul auto." : "Calculé (Frais + Part non-financée) basé sur la quotité."}</p>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Taux du crédit (%)</label><input type="number" step="0.1" name="tauxCredit" value={data.tauxCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Durée du crédit (années)</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" name="dureeCredit" value={data.dureeCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                            <div className="flex-shrink-0 flex gap-1">
                                {[15, 20, 25, 30].map(duree => (
                                    <button key={duree} onClick={() => handleDataChange('dureeCredit', duree)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.dureeCredit === duree ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`} title={`${duree} ans`}>{duree}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-dashed"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-gray-600">Coût total du projet</p><p className="text-lg font-bold">{finances.coutTotalProjet.toLocaleString('fr-BE')} €</p></div>
                    <div><p className="text-sm text-gray-600">Montant à financer</p><p className="text-lg font-bold text-blue-700">{(finances.montantAFinancer || 0).toLocaleString('fr-BE')} €</p></div>
                    <div><p className="text-sm text-gray-600">Mensualité estimée</p><p className="text-lg font-bold text-red-600">{(finances.mensualiteEstimee || 0).toFixed(2)} €</p></div>
                </div></div>
            </div>

            {/* --- Section 3: Analyse du Marché et du Loyer --- */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Loyer et charge</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium">Loyer hors charges (€/mois)</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" name="loyerEstime" value={data.loyerEstime} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="w-full p-2 border rounded-md" placeholder="900 € HC" />
                            <button onClick={() => setIsRentSplitterOpen(true)} title="Répartir le loyer par unité" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><LayersIcon /></button>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium">Charges d'exploitation (€/mois)</label><div className="flex items-center gap-2 mt-1"><input type="number" name="chargesMensuelles" value={data.chargesMensuelles} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="w-full p-2 border rounded-md" /><button onClick={() => setIsChargesEstimatorOpen(true)} title="Aide à l'évaluation des charges" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><ClipboardListIcon /></button></div></div>
                </div>
            </div>

            <button onClick={calculateScore} className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                Evaluer le Projet
            </button>

            {/* --- Section 4: Résultats --- */}
            {result && (
                <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Résultat</h2>
                        <div className="flex gap-2">
                            {currentAnalysisId && (
                                <button onClick={() => viewAnalysis(currentAnalysisId)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2" title="Visualiser le rapport de synthèse">
                                    <EyeIcon /> Visualiser
                                </button>
                            )}
                            <button onClick={handleOpenSaveModal} className={`text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all ${currentAnalysisId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`} title={currentAnalysisId ? "Mettre à jour ou sauvegarder une copie" : "Sauvegarder l'analyse"}>
                                {currentAnalysisId ? <FileCheckIcon /> : <SaveIcon />}
                                {currentAnalysisId ? 'Mettre à jour / Copier' : 'Sauvegarder'}
                            </button>
                        </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg mb-4 ${result.grade === 'A' ? 'bg-green-100' : result.grade === 'B' ? 'bg-green-50' : result.grade === 'C' ? 'bg-yellow-50' : result.grade === 'D' ? 'bg-orange-50' : 'bg-red-100'}`}>
                        <span className={`text-6xl font-black ${result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800'}`}>{result.grade}</span>
                        {result.yearsToRecover !== null && <p className="font-semibold text-md mt-2">Retour sur apport en {result.yearsToRecover.toFixed(0)} ans</p>}
                        <p className="font-mono text-sm mt-2">{result.motivation}</p>
                        <p className="font-mono text-sm mt-1 flex items-center justify-center">Score Strady <button onClick={() => setIsScoreModalOpen(true)} className="ml-1"><QuestionMarkIcon /></button></p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                        {user && (
                            <>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm flex items-center justify-center gap-1">Rendement Net <button onClick={() => handleOpenMetricModal('rendementNet')} className="text-gray-400 hover:text-blue-600"><QuestionMarkIcon /></button></p>
                                    <p className={`text-xl font-bold ${result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800'}`}>{result.rendementNet} %</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm flex items-center justify-center gap-1">Cash-on-Cash <button onClick={() => handleOpenMetricModal('cashOnCash')} className="text-gray-400 hover:text-blue-600"><QuestionMarkIcon /></button></p>
                                    <p className={`text-xl font-bold ${result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800'}`}>
                                        {result.cashOnCash === Infinity ? '∞' : (result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A')}
                                    </p>
                                </div>
                            </>
                        )}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm flex items-center justify-center gap-1">Cash-Flow / mois <button onClick={() => handleOpenMetricModal('cashflow')} className="text-gray-400 hover:text-blue-600"><QuestionMarkIcon /></button></p>
                            <p className={`text-xl font-bold ${result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800'}`}>{result.cashflowMensuel} €</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm flex items-center justify-center gap-1">Mensualité Crédit <button onClick={() => handleOpenMetricModal('mensualiteCredit')} className="text-gray-400 hover:text-blue-600"><QuestionMarkIcon /></button></p><p className="text-xl font-bold">{result.mensualiteCredit} €</p></div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm flex items-center justify-center gap-1">Coût Total <button onClick={() => handleOpenMetricModal('coutTotal')} className="text-gray-400 hover:text-blue-600"><QuestionMarkIcon /></button></p><p className="text-xl font-bold">{parseInt(result.coutTotal).toLocaleString('fr-BE')} €</p></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisFormPage;
