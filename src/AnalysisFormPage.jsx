import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useModal } from './contexts/useModal';
import { useAuth } from './hooks/useAuth';
import { PencilIcon, PlusCircleIcon, CalculatorIcon, LayersIcon, ClipboardListIcon, EyeIcon, FileCheckIcon, SaveIcon, QuestionMarkIcon, HomeIcon, TrashIcon, Undo2Icon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, ListIcon, ListOrderedIcon, SparklesIcon } from './Icons';
import FormattedInput from './components/FormattedInput';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
    validationErrors,
    typeBienOptions,
    pebOptions,
}) => {
    const { user } = useAuth();
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [lastNoteContent, setLastNoteContent] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const undoTimeoutRef = useRef(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [objective, setObjective] = useState(() => localStorage.getItem('analysisObjective') || 'all');
    const [sliderStyle, setSliderStyle] = useState({});
    const objectiveButtonsRef = useRef({});

    const resultsRef = useRef(null);
    const notesTextareaRef = useRef(null);
    const { 
        setIsEstimatorOpen,
        setIsAcquisitionFeesEstimatorOpen,
        setIsRentSplitterOpen,
        setIsChargesEstimatorOpen,
        setIsScoreModalOpen,
        setSelectedMetric,
        setIsObjectivesInfoModalOpen,
        setIsMetricModalOpen,
        setIsAiAssistantModalOpen,
    } = useModal();

    useEffect(() => {
        if (result && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [result]);

    useEffect(() => {
        localStorage.setItem('analysisObjective', objective);
        const activeButton = objectiveButtonsRef.current[objective];
        if (activeButton) {
            setSliderStyle({
                width: `${activeButton.offsetWidth}px`,
                transform: `translateX(${activeButton.offsetLeft}px)`
            });
        }
    }, [objective]);

    const handleObjectiveChange = (newObjective) => {
        setObjective(newObjective);
    };

    const handleOpenMetricModal = (metric) => {
        setSelectedMetric(metric);
        setIsMetricModalOpen(true);
    };

    const handleDeleteNote = () => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        setLastNoteContent(data.property.description);
        handleDataChange('property.description', '');
        setShowUndo(true);
        undoTimeoutRef.current = setTimeout(() => {
            setShowUndo(false);
            setLastNoteContent(null);
        }, 5000); // 5 seconds to undo
    };

    const handleUndoDeleteNote = () => {
        if (lastNoteContent !== null) {
            handleDataChange('property.description', lastNoteContent);
        }
        setShowUndo(false);
        setLastNoteContent(null);
        if (undoTimeoutRef.current) {
            clearTimeout(undoTimeoutRef.current);
        }
    };

    const applyMarkdown = (syntax) => {
        const textarea = notesTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = data.property.description.substring(start, end);
        const beforeText = data.property.description.substring(0, start);
        const afterText = data.property.description.substring(end);

        const { startTag, endTag } = syntax;
        const newText = `${beforeText}${startTag}${selectedText}${endTag}${afterText}`;

        handleDataChange('property.description', newText);

        // Refocus and set cursor position after update
        textarea.focus();
        setTimeout(() => textarea.setSelectionRange(start + startTag.length, end + startTag.length), 0);
    };

    const handleNoteSelectionChange = () => {
        const textarea = notesTextareaRef.current;
        if (textarea) {
            setIsTextSelected(textarea.selectionStart !== textarea.selectionEnd);
        }
    };

    const applyListMarkdown = () => {
        const textarea = notesTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = data.property.description || '';

        const selectedText = value.substring(start, end);
        const beforeText = value.substring(0, start);
        const afterText = value.substring(end);

        const newText = beforeText + selectedText.split('\n').map(line => `* ${line}`).join('\n') + afterText;

        handleDataChange('property.description', newText);

        textarea.focus();
        setTimeout(() => textarea.setSelectionRange(start, end + (selectedText.split('\n').length * 2)), 0);
    };

    const applyOrderedListMarkdown = () => {
        const textarea = notesTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = data.property.description || '';

        const selectedText = value.substring(start, end);
        const beforeText = value.substring(0, start);
        const afterText = value.substring(end);

        const newSelectedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        const newText = beforeText + newSelectedText + afterText;

        handleDataChange('property.description', newText);

        textarea.focus();
        setTimeout(() => textarea.setSelectionRange(start, start + newSelectedText.length), 0);
    };

    const objectiveMetrics = useMemo(() => {
        if (!result) return {};
        return {
            all: [
                { label: 'Cash-Flow / mois', value: `${result.cashflowMensuel} €`, gradeSensitive: true, metricKey: 'cashflow' },
                { label: 'Rendement Net', value: `${result.rendementNet} %`, gradeSensitive: true, metricKey: 'rendementNet', auth: true },
                { label: 'Cash-on-Cash', value: result.cashOnCash === Infinity ? '∞' : (result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A'), gradeSensitive: true, metricKey: 'cashOnCash', auth: true },
                { label: 'Mensualité Crédit', value: `${result.mensualiteCredit} €`, gradeSensitive: false, metricKey: 'mensualiteCredit' }, // This comes from result, not data
                { label: 'Apport Personnel', value: `${parseInt(data.financing.apport).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'apport' },
                { label: 'Coût Total', value: `${parseInt(result.coutTotal).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'coutTotal' }, // This comes from result, not data
            ],
            cashflow: [
                { label: 'Cash-Flow / mois', value: `${result.cashflowMensuel} €`, gradeSensitive: true, metricKey: 'cashflow' },
                { label: 'Cash-on-Cash', value: result.cashOnCash === Infinity ? '∞' : (result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A'), gradeSensitive: true, metricKey: 'cashOnCash', auth: true },
                { label: 'Apport Personnel', value: `${parseInt(data.apport).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'apport' },
            ],
            rentabilite: [
                { label: 'Rendement Net', value: `${result.rendementNet} %`, gradeSensitive: true, metricKey: 'rendementNet', auth: true },
                { label: 'Cash-on-Cash', value: result.cashOnCash === Infinity ? '∞' : (result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A'), gradeSensitive: true, metricKey: 'cashOnCash', auth: true },
                { label: 'Cash-Flow / mois', value: `${result.cashflowMensuel} €`, gradeSensitive: true, metricKey: 'cashflow' },
            ],
            cout: [
                { label: 'Mensualité Crédit', value: `${result.mensualiteCredit} €`, gradeSensitive: false, metricKey: 'mensualiteCredit' },
                { label: 'Apport Personnel', value: `${parseInt(data.apport).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'apport' },
                { label: 'Coût Total', value: `${parseInt(result.coutTotal).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'coutTotal' },
            ]
        };
    }, [result, data.financing.apport]);

    const gradeColorClass = result ? (result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800') : '';


    return (
        <div className="space-y-8 animate-fade-in pb-24">
            {/* 
            {user && (
                <button
                    onClick={() => setIsAiAssistantModalOpen(true)}
                    className="fixed top-3/4 right-4 transform -translate-y-1/2 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 active:bg-purple-800 transition-all duration-300 z-30 transform hover:scale-110 print-hidden"
                    title="Ouvrir l'Assistant IA"
                >
                    <SparklesIcon />
                </button>
            )}
            */}
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
                        {typeBienOptions.map(opt => ( // Assuming typeBienOptions is still valid
                            <button key={opt} onClick={() => handleDataChange('property.typeBien', opt)} className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${data.property.typeBien === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Score PEB</label>
                    <div className="flex flex-wrap gap-2">
                        {pebOptions.map(opt => ( // Assuming pebOptions is still valid
                            <button key={opt} onClick={() => handleDataChange('property.peb', opt)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.property.peb === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="hidden"><label className="block text-sm font-medium">Nom du Projet</label><input type="text" name="projectName" value={data.projectName} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div>
                        <label className="block text-sm font-medium">Surface</label>
                        <FormattedInput
                            name="property.surface"
                            value={data.property.surface}
                            onChange={handleInputChange}
                            onFocus={handleNumericFocus}
                            onBlur={handleNumericBlur}
                            unit="m²"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Revenu Cadastral</label>
                        <FormattedInput
                            name="property.revenuCadastral"
                            value={data.property.revenuCadastral}
                            onChange={handleInputChange}
                            onFocus={handleNumericFocus}
                            onBlur={handleNumericBlur}
                            unit="€"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Adresse/ Ville / Commune <span className='text-red-400'>*</span></label>
                        <input 
                            type="text" name="property.ville" value={data?.property?.ville || ''} onChange={handleInputChange} required 
                            placeholder='Rue de Strady 1, 5000 Namur' 
                            className={`mt-1 w-full p-2 border rounded-md transition-all ${validationErrors?.['property.ville'] ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`} 
                        />
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">En ordre urbanistique ?</label>
                        <div className="flex gap-2">
                            <button onClick={() => handleDataChange('property.enOrdreUrbanistique', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.property.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Oui</button>
                            <button onClick={() => handleDataChange('property.enOrdreUrbanistique', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.property.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Non</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Électricité conforme ?</label>
                        <div className="flex gap-2">
                            <button onClick={() => handleDataChange('property.electriciteConforme', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.property.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Oui</button>
                            <button onClick={() => handleDataChange('property.electriciteConforme', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.property.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Non</button>
                        </div>
                    </div>
                </div>
                {user && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Notes</label>
                        {isEditingNotes || !data.property.description ? (
                            <div className="mt-1 border rounded-md">
                                <div className="flex items-center gap-1 p-1 bg-gray-100 border-b">
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '*', endTag: '*' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Gras" disabled={!isTextSelected}><BoldIcon className="h-4 w-4" /></button>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '_', endTag: '_' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Italique" disabled={!isTextSelected}><ItalicIcon className="h-4 w-4" /></button>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '<u>', endTag: '</u>' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Souligné" disabled={!isTextSelected}><UnderlineIcon className="h-4 w-4" /></button>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '~~', endTag: '~~' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Barré" disabled={!isTextSelected}><StrikethroughIcon className="h-4 w-4" /></button>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={applyListMarkdown} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Liste à puces" disabled={!isTextSelected}><ListIcon className="h-4 w-4" /></button>
                                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={applyOrderedListMarkdown} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title="Liste numérotée" disabled={!isTextSelected}><ListOrderedIcon className="h-4 w-4" /></button>
                                </div>
                                <textarea
                                    ref={notesTextareaRef}
                                    name="property.description"
                                    value={data.property.description}
                                    onChange={handleInputChange}
                                    onSelect={handleNoteSelectionChange}
                                    onBlur={() => {
                                        // The content is already saved in the state via onChange.
                                        setIsEditingNotes(false);
                                        setIsTextSelected(false);
                                    }}
                                    rows="4"
                                    className="w-full p-2 border-none rounded-b-md focus:ring-0"
                                    placeholder='Quartier calme, Prévoir travaux SDB, Gros œuvre OK...'
                                    //autoFocus
                                />
                            </div>
                        ) : (
                            <div className="relative group mt-1">
                                <div
                                    onClick={() => setIsEditingNotes(true)}
                                    className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border max-h-48 overflow-y-auto custom-scrollbar cursor-pointer hover:border-blue-300 transition-colors"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(data.property.description)) }}
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={handleDeleteNote} title="Effacer les notes" className="p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:bg-red-100">
                                        <TrashIcon className="h-4 w-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {showUndo && (
                    <div className="mt-2 flex justify-center items-center gap-2 text-sm">
                        <p className="text-gray-600">Note effacée.</p>
                        <button onClick={handleUndoDeleteNote} className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
                            <Undo2Icon className="h-4 w-4" /> Annuler
                        </button>
                    </div>
                )}
            </div>

            {/* --- Section 2: Coûts & Financement --- */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Financement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Prix d'achat</label>
                        <FormattedInput 
                        name="acquisition.prixAchat" 
                        value={data.acquisition.prixAchat} 
                        onChange={handleInputChange} 
                        onFocus={handleNumericFocus} 
                        onBlur={handleNumericBlur} 
                        unit="€" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coût travaux</label>
                        <div className="flex items-center gap-2">
                            <FormattedInput
                                name="acquisition.coutTravaux.total"
                                value={data.acquisition.coutTravaux.total}
                                onChange={handleInputChange}
                                onFocus={handleNumericFocus}
                                onBlur={handleNumericBlur}
                                unit="€"
                            />
                            <button onClick={() => setIsEstimatorOpen(true)} title="Estimer le coût des travaux" className="p-2 mt-1 bg-gray-200 hover:bg-gray-300 rounded-md"><CalculatorIcon /></button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Frais d'acquisition</label>
                        <div className="flex items-center gap-2">
                            <FormattedInput
                                name="acquisition.droitsEnregistrement"
                                value={data.acquisition.droitsEnregistrement}
                                onChange={handleInputChange}
                                onFocus={handleNumericFocus}
                                onBlur={handleNumericBlur}
                                unit="€"
                            />
                            <button onClick={() => setIsAcquisitionFeesEstimatorOpen(true)} className="mt-1 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" title="Calculateur détaillé"><CalculatorIcon /></button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Estimation auto. Pour un calcul précis, demandez à votre notaire une prévision des coûts (notaire.be)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Frais annexes</label>
                        <FormattedInput name="acquisition.fraisNotaire" value={data.acquisition.fraisNotaire} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} placeholder="Agence, hypothèque..." unit="€" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Quotité d'emprunt</label>
                        <p className="text-xs text-gray-500 mt-1 mb-2">Part du prix d'achat et des travaux financée par la banque. L'apport est calculé automatiquement.</p>
                        <div className="flex flex-wrap gap-2">
                            {[70, 80, 90, 100, 125].map((q) => (
                                <button key={q} type="button" onClick={() => handleInputChange({ target: { name: 'financing.quotite', value: q, type: 'number' } })} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.financing.quotite === q ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{q}%</button>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Apport personnel</label>
                        <div className="flex items-center gap-2">
                            <FormattedInput
                                name="financing.apport"
                                value={data.financing.apport}
                                onChange={handleInputChange}
                                onFocus={handleNumericFocus}
                                onBlur={handleNumericBlur}
                                unit="€"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{data.financing.quotite === 'custom' ? "L'apport est en mode manuel. Sélectionnez une quotité pour réactiver le calcul auto." : "Calculé (Frais + Part non-financée) basé sur la quotité."}</p>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Taux du crédit (%)</label><input type="number" step="0.1" min="0" name="financing.tauxCredit" value={data.financing.tauxCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Durée du crédit (années)</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" name="financing.dureeCredit" min="0" value={data.financing.dureeCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                            <div className="flex-shrink-0 flex gap-1">
                                {[15, 20, 25, 30].map(duree => (
                                    <button key={duree} onClick={() => handleDataChange('financing.dureeCredit', duree)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.financing.dureeCredit === duree ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`} title={`${duree} ans`}>{duree}</button>
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
                        <label className="block text-sm font-medium">Loyer hors charges</label>
                        <div className="flex items-center gap-2 mt-1">
                            <FormattedInput
                                name="rental.loyerEstime.total"
                                value={data.rental.loyerEstime.total}
                                onChange={handleInputChange}
                                onFocus={handleNumericFocus}
                                onBlur={handleNumericBlur}
                                unit="€/mois"
                                placeholder="900"
                            />
                            <button onClick={() => setIsRentSplitterOpen(true)} title="Répartir le loyer par unité" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><LayersIcon /></button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Charges d'exploitation</label>
                        <div className="flex items-center gap-2 mt-1">
                            <FormattedInput name="rental.chargesAnnuelles.total" value={Math.round(data.rental.chargesAnnuelles.total / 12)} onChange={(e) => handleDataChange('rental.chargesAnnuelles.total', e.target.value * 12)} onFocus={handleNumericFocus} onBlur={handleNumericBlur} unit="€/mois" />
                            <button onClick={() => setIsChargesEstimatorOpen(true)} title="Aide à l'évaluation des charges" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><ClipboardListIcon /></button>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={calculateScore} className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                Evaluer le Projet
            </button>
            

            {/* --- Section 4: Résultats --- */}
            {result && (
                <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
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
                    <div className="mb-4">
                        <div className="flex justify-center items-center gap-2">
                            <div className="relative flex justify-center bg-gray-100 rounded-full p-1 w-fit mx-auto">
                                <div className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-white rounded-full shadow transition-all duration-300 ease-in-out" style={sliderStyle}></div>
                                <button 
                                    ref={el => objectiveButtonsRef.current['all'] = el} 
                                    onClick={() => handleObjectiveChange('all')} 
                                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'all' ? 'text-blue-600' : 'text-gray-600'}`}
                                    title="Affiche toutes les métriques clés pour une analyse complète du projet."
                                >
                                    Vue d'ensemble
                                </button>
                                <button 
                                    ref={el => objectiveButtonsRef.current['cashflow'] = el} 
                                    onClick={() => handleObjectiveChange('cashflow')} 
                                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'cashflow' ? 'text-blue-600' : 'text-gray-600'}`}
                                    title="Met en avant le flux de trésorerie (cash-flow) pour évaluer le revenu passif généré chaque mois."
                                >
                                    Machine à Cash
                                </button>
                                <button 
                                    ref={el => objectiveButtonsRef.current['rentabilite'] = el} 
                                    onClick={() => handleObjectiveChange('rentabilite')} 
                                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'rentabilite' ? 'text-blue-600' : 'text-gray-600'}`}
                                    title="Se concentre sur les rendements (Rendement Net, CoC) pour mesurer la performance de l'investissement."
                                >
                                    Rentabilité
                                </button>
                                <button 
                                    ref={el => objectiveButtonsRef.current['cout'] = el} 
                                    onClick={() => handleObjectiveChange('cout')} 
                                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'cout' ? 'text-blue-600' : 'text-gray-600'}`}
                                    title="Détaille les coûts principaux (mensualité, apport) pour comprendre l'effort financier de l'acquisition."
                                >
                                    Coût de l'Achat
                                </button>
                                
                                <button onClick={() => setIsObjectivesInfoModalOpen(true)} className="text-gray-400 hover:text-blue-600" >
                                    <QuestionMarkIcon />
                                </button>
                            </div>
                                
                            
                        </div>
                    </div>
                    <div className={`grid grid-cols-1 ${objective === 'all' ? 'sm:grid-cols-3' : 'sm:grid-cols-3'} gap-4 text-center`}>
                        {objectiveMetrics[objective]
                            ?.filter(metric => !metric.auth || user)
                            .map(metric => (
                                <div key={metric.label} className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm flex items-center justify-center gap-1">
                                        {metric.label}
                                        <button onClick={() => handleOpenMetricModal(metric.metricKey)} className="text-gray-400 hover:text-blue-600">
                                            <QuestionMarkIcon />
                                        </button>
                                    </p>
                                    <p className={`text-xl font-bold ${metric.gradeSensitive ? gradeColorClass : ''}`}>
                                        {metric.value}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisFormPage;
