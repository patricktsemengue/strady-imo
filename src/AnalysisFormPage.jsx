import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from './contexts/useModal';
import { useAuth } from './hooks/useAuth';
import { PencilIcon, PlusCircleIcon, CalculatorIcon, LayersIcon, ClipboardListIcon, EyeIcon, FileCheckIcon, SaveIcon, QuestionMarkIcon, HomeIcon, TrashIcon, Undo2Icon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, ListIcon, ListOrderedIcon, SparklesIcon, CopyIcon } from './Icons';
import FormattedInput from './components/FormattedInput';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import ConfirmationDrawer from './components/ConfirmationDrawer';

// This component will hold the main analysis form
const AnalysisFormPage = ({ 
    currentAnalysisId,
    isDuplicating,
    handleUpdateAnalysis,
    handleOpenSaveDrawer,
    handleNewProject,
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
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isNewAnalysisModalOpen, setIsNewAnalysisModalOpen] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [lastNoteContent, setLastNoteContent] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const undoTimeoutRef = useRef(null);
    const [isTextSelected, setIsTextSelected] = useState(false);
    const [objective, setObjective] = useState(() => localStorage.getItem('analysisObjective') || 'all');
    const [sliderStyle, setSliderStyle] = useState({});
    const objectiveButtonsRef = useRef({});
    const projectNameInputRef = useRef(null);

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

    useEffect(() => {
        if (isDuplicating && projectNameInputRef.current) {
            projectNameInputRef.current.focus();
            projectNameInputRef.current.select();
        }
    }, [isDuplicating]);

    const handleObjectiveChange = (newObjective) => {
        setObjective(newObjective ? newObjective : 'all');
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
                { label: 'Apport Personnel', value: `${parseInt(data.financing.apport).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'apport' },
            ],
            rentabilite: [
                { label: 'Rendement Net', value: `${result.rendementNet} %`, gradeSensitive: true, metricKey: 'rendementNet', auth: true },
                { label: 'Cash-on-Cash', value: result.cashOnCash === Infinity ? '∞' : (result.cashOnCash !== null && isFinite(result.cashOnCash) ? `${result.cashOnCash.toFixed(2)} %` : 'N/A'), gradeSensitive: true, metricKey: 'cashOnCash', auth: true },
                { label: 'Cash-Flow / mois', value: `${result.cashflowMensuel} €`, gradeSensitive: true, metricKey: 'cashflow' },
            ],
            cout: [
                { label: 'Mensualité Crédit', value: `${result.mensualiteCredit} €`, gradeSensitive: false, metricKey: 'mensualiteCredit' },
                { label: 'Apport Personnel', value: `${parseInt(data.financing.apport).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'apport' },
                { label: 'Coût Total', value: `${parseInt(result.coutTotal).toLocaleString('fr-BE')} €`, gradeSensitive: false, metricKey: 'coutTotal' },
            ]
        };
    }, [result, data.financing.apport]);

    const gradeColorClass = result ? (result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800') : '';


    return (
        <>
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
                <div className="bg-white p-4 rounded-lg shadow-md print-hidden">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-800">{t('property_details')}</h2>
                    </div>
                    {user && (
                        <button
                            onClick={() => setIsNewAnalysisModalOpen(true)}
                            className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 active:bg-green-600 transition-all duration-300 z-30 transform hover:scale-110 print-hidden"
                            title={t('new_analysis')}
                        >
                            <PlusCircleIcon />
                        </button>
                    )}
                    {currentAnalysisId ? (
                        <div className="mb-4 p-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2 text-sm text-purple-800">
                            <PencilIcon />
                            <span>{t('editing_analysis')}<strong>{data.projectName}</strong></span>
                        </div>
                    ) : isDuplicating ? (
                        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-800">
                            <CopyIcon />
                            <span>{t('copy_of_analysis')}<strong>{data.projectName}</strong>{t('remember_to_rename')}</span>
                        </div>
                    ) : (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-800">
                            <PlusCircleIcon />
                            <span>{t('new_analysis')}</span>
                        </div>
                    )}
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">{t('property_type')}</label>
                        <div className="flex flex-wrap gap-2">
                            {typeBienOptions.map(opt => ( // Assuming typeBienOptions is still valid
                                <button key={opt} onClick={() => handleDataChange('property.typeBien', opt)} className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${data.property.typeBien === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">{t('peb_score')}</label>
                        <div className="flex flex-wrap gap-2">
                            {pebOptions.map(opt => ( // Assuming pebOptions is still valid
                                <button key={opt} onClick={() => handleDataChange('property.peb', opt)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.property.peb === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="hidden"><label className="block text-sm font-medium">{t('project_name')}</label><input ref={projectNameInputRef} type="text" name="projectName" value={data.projectName} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                        <div>
                            <label className="block text-sm font-medium">{t('surface')}</label>
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
                            <label className="block text-sm font-medium">{t('cadastral_income')}</label>
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
                            <label className="block text-sm font-medium">{t('address_city_commune')} <span className='text-red-400'>*</span></label>
                            <input 
                                type="text" name="property.ville" value={data?.property?.ville || ''} onChange={handleInputChange} required 
                                placeholder={t('address_placeholder')} 
                                className={`mt-1 w-full p-2 border rounded-md transition-all ${validationErrors?.['property.ville'] ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`} 
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">{t('urbanistic_order')}</label>
                            <div className="flex gap-2">
                                <button onClick={() => handleDataChange('property.enOrdreUrbanistique', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.property.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{t('yes')}</button>
                                <button onClick={() => handleDataChange('property.enOrdreUrbanistique', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.property.enOrdreUrbanistique ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{t('no')}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">{t('electricity_compliant')}</label>
                            <div className="flex gap-2">
                                <button onClick={() => handleDataChange('property.electriciteConforme', true)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.property.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{t('yes')}</button>
                                <button onClick={() => handleDataChange('property.electriciteConforme', false)} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${!data.property.electriciteConforme ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{t('no')}</button>
                            </div>
                        </div>
                    </div>
                    {user && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium">{t('notes')}</label>
                            {isEditingNotes || !data.property.description ? (
                                <div className="mt-1 border rounded-md">
                                    <div className="flex items-center gap-1 p-1 bg-gray-100 border-b">
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '*', endTag: '*' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('bold')} disabled={!isTextSelected}><BoldIcon className="h-4 w-4" /></button>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '_', endTag: '_' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('italic')} disabled={!isTextSelected}><ItalicIcon className="h-4 w-4" /></button>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '<u>', endTag: '</u>' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('underline')} disabled={!isTextSelected}><UnderlineIcon className="h-4 w-4" /></button>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => applyMarkdown({ startTag: '~~', endTag: '~~' })} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('strikethrough')} disabled={!isTextSelected}><StrikethroughIcon className="h-4 w-4" /></button>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={applyListMarkdown} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('bullet_list')} disabled={!isTextSelected}><ListIcon className="h-4 w-4" /></button>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={applyOrderedListMarkdown} className="p-1.5 rounded hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed" title={t('ordered_list')} disabled={!isTextSelected}><ListOrderedIcon className="h-4 w-4" /></button>
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
                                        placeholder={t('notes_placeholder')}
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
                                        <button onClick={handleDeleteNote} title={t('delete_notes')} className="p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:bg-red-100">
                                            <TrashIcon className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {showUndo && (
                        <div className="mt-2 flex justify-center items-center gap-2 text-sm">
                            <p className="text-gray-600">{t('note_deleted')}</p>
                            <button onClick={handleUndoDeleteNote} className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
                                <Undo2Icon className="h-4 w-4" /> {t('undo')}
                            </button>
                        </div>
                    )}
                </div>
    
                {/* --- Section 2: Coûts & Financement --- */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{t('financing')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="block text-sm font-medium text-gray-700">{t('purchase_price')}</label>
                            <FormattedInput 
                            name="acquisition.prixAchat" 
                            value={data.acquisition.prixAchat} 
                            onChange={handleInputChange} 
                            onFocus={handleNumericFocus} 
                            onBlur={handleNumericBlur} 
                            unit="€" />
                        </div>
    
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('work_cost')}</label>
                            <div className="flex items-center gap-2">
                                <FormattedInput
                                    name="acquisition.coutTravaux.total"
                                    value={data.acquisition.coutTravaux.total}
                                    onChange={handleInputChange}
                                    onFocus={handleNumericFocus}
                                    onBlur={handleNumericBlur}
                                    unit="€"
                                />
                                <button onClick={() => setIsEstimatorOpen(true)} title={t('estimate_work_cost')} className="p-2 mt-1 bg-gray-200 hover:bg-gray-300 rounded-md"><CalculatorIcon /></button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('acquisition_fees')}</label>
                            <div className="flex items-center gap-2">
                                <FormattedInput
                                    name="acquisition.droitsEnregistrement"
                                    value={data.acquisition.droitsEnregistrement}
                                    onChange={handleInputChange}
                                    onFocus={handleNumericFocus}
                                    onBlur={handleNumericBlur}
                                    unit="€"
                                />
                                <button onClick={() => setIsAcquisitionFeesEstimatorOpen(true)} className="mt-1 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" title={t('detailed_calculator')}><CalculatorIcon /></button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{t('acquisition_fees_estimation_note')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('additional_fees')}</label>
                            <FormattedInput name="acquisition.fraisNotaire" value={data.acquisition.fraisNotaire} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} placeholder={t('additional_fees_placeholder')} unit="€" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">{t('loan_quota')}</label>
                            <p className="text-xs text-gray-500 mt-1 mb-2">{t('loan_quota_note')}</p>
                            <div className="flex flex-wrap gap-2">
                                {[70, 80, 90, 100, 125].map((q) => (
                                    <button key={q} type="button" onClick={() => handleInputChange({ target: { name: 'financing.quotite', value: q, type: 'number' } })} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${data.financing.quotite === q ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>{q}%</button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">{t('personal_contribution')}</label>
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
                            <p className="text-xs text-gray-500 mt-1">{data.financing.quotite === 'custom' ? t('personal_contribution_note_manual') : t('personal_contribution_note_calculated')}</p>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700">{t('loan_rate')}</label><input type="number" step="0.1" min="0" name="financing.tauxCredit" value={data.financing.tauxCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" /></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('loan_duration')}</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input type="number" name="financing.dureeCredit" min="0" value={data.financing.dureeCredit} onChange={handleInputChange} onFocus={handleNumericFocus} onBlur={handleNumericBlur} className="mt-1 w-full p-2 border rounded-md" />
                                <div className="flex-shrink-0 flex gap-1">
                                    {[15, 20, 25, 30].map(duree => (
                                        <button key={duree} onClick={() => handleDataChange('financing.dureeCredit', duree)} className={`w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all ${data.financing.dureeCredit === duree ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`} title={`${duree} ${t('years_short')}`}>{duree}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-dashed"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div><p className="text-sm text-gray-600">{t('total_project_cost')}</p><p className="text-lg font-bold">{(finances?.coutTotalProjet || 0).toLocaleString('fr-BE')} €</p></div>
                        <div><p className="text-sm text-gray-600">{t('amount_to_finance')}</p><p className="text-lg font-bold text-blue-700">{(finances?.montantAFinancer || 0).toLocaleString('fr-BE')} €</p></div>
                        <div><p className="text-sm text-gray-600">{t('estimated_monthly_payment')}</p><p className="text-lg font-bold text-red-600">{(finances?.mensualiteEstimee || 0).toFixed(2)} €</p></div>
                    </div></div>
                </div>
    
                {/* --- Section 3: Analyse du Marché et du Loyer --- */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{t('rent_and_charges')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className="block text-sm font-medium">{t('rent_excluding_charges')}</label>
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
                                <button onClick={() => setIsRentSplitterOpen(true)} title={t('split_rent_by_unit')} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><LayersIcon /></button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">{t('operating_charges')}</label>
                            <div className="flex items-center gap-2 mt-1">
                                <FormattedInput name="rental.chargesAnnuelles.total" value={Math.round(data.rental.chargesAnnuelles.total / 12)} onChange={(e) => handleDataChange('rental.chargesAnnuelles.total', e.target.value * 12)} onFocus={handleNumericFocus} onBlur={handleNumericBlur} unit="€/mois" />
                                <button onClick={() => setIsChargesEstimatorOpen(true)} title={t('help_evaluate_charges')} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"><ClipboardListIcon /></button>
                            </div>
                        </div>
                    </div>
                </div>
    
                <button onClick={calculateScore} className="w-full bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
                    {t('evaluate_project')}
                </button>
                
    
                {/* --- Section 4: Résultats --- */}
                {result && (
                    <div ref={resultsRef} className="bg-white p-6 rounded-lg shadow-xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{t('results')}</h2>
                            <div className="flex gap-2">
                                {currentAnalysisId && (
                                    <button onClick={() => viewAnalysis(currentAnalysisId)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center gap-2" title={t('view_report')}>
                                        <EyeIcon /> {t('visualize')}
                                    </button>
                                )}
                                {currentAnalysisId ? (
                                    <button onClick={handleUpdateAnalysis} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-all" title={t('update_analysis')}>
                                        <FileCheckIcon /> {t('update')}
                                    </button>
                                ) : (
                                    <button onClick={handleOpenSaveDrawer} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all" title={t('save_analysis')}>
                                        <SaveIcon /> {t('save')}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={`text-center p-4 rounded-lg mb-4 ${result.grade === 'A' ? 'bg-green-100' : result.grade === 'B' ? 'bg-green-50' : result.grade === 'C' ? 'bg-yellow-50' : result.grade === 'D' ? 'bg-orange-50' : 'bg-red-100'}`}>
                            <span className={`text-6xl font-black ${result.grade === 'A' ? 'text-green-800' : result.grade === 'B' ? 'text-green-500' : result.grade === 'C' ? 'text-yellow-500' : result.grade === 'D' ? 'text-orange-500' : 'text-red-800'}`}>{result.grade}</span>
                            {result.yearsToRecover !== null && <p className="font-semibold text-md mt-2">{t('return_on_contribution_in')}{result.yearsToRecover.toFixed(0)}{t('years')}</p>}
                            <p className="font-mono text-sm mt-2">{result.motivation}</p>
                            <p className="font-mono text-sm mt-1 flex items-center justify-center">{t('strady_score')} <button onClick={() => setIsScoreModalOpen(true)} className="ml-1"><QuestionMarkIcon /></button></p>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-center items-center gap-2">
                                <div className="relative flex justify-center bg-gray-100 rounded-full p-1 w-fit mx-auto">
                                    <div className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-white rounded-full shadow transition-all duration-300 ease-in-out" style={sliderStyle}></div>
                                    <button 
                                        ref={el => objectiveButtonsRef.current['all'] = el} 
                                        onClick={() => handleObjectiveChange('all')} 
                                        className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'all' ? 'text-blue-600' : 'text-gray-600'}`}
                                        title={t('overview_description')}
                                    >
                                        {t('overview')}
                                    </button>
                                    <button 
                                        ref={el => objectiveButtonsRef.current['cashflow'] = el} 
                                        onClick={() => handleObjectiveChange('cashflow')} 
                                        className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'cashflow' ? 'text-blue-600' : 'text-gray-600'}`}
                                        title={t('cash_machine_description')}
                                    >
                                        {t('cash_machine')}
                                    </button>
                                    <button 
                                        ref={el => objectiveButtonsRef.current['rentabilite'] = el} 
                                        onClick={() => handleObjectiveChange('rentabilite')} 
                                        className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'rentabilite' ? 'text-blue-600' : 'text-gray-600'}`}
                                        title={t('profitability_description')}
                                    >
                                        {t('profitability')}
                                    </button>
                                    <button 
                                        ref={el => objectiveButtonsRef.current['cout'] = el} 
                                        onClick={() => handleObjectiveChange('cout')} 
                                        className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${objective === 'cout' ? 'text-blue-600' : 'text-gray-600'}`}
                                        title={t('cost_of_purchase_description')}
                                    >
                                        {t('cost_of_purchase')}
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
            <ConfirmationDrawer
                isOpen={isNewAnalysisModalOpen}
                onClose={() => setIsNewAnalysisModalOpen(false)}
                onConfirm={() => {
                    handleNewProject();
                    setIsNewAnalysisModalOpen(false);
                }}
                title={t('start_new_analysis_q')} 
                confirmText={t('yes_start')}
                confirmButtonVariant="danger"
            >
                <p>{t('unsaved_changes_lost')}</p>
            </ConfirmationDrawer>
        </>
    );
};

export default AnalysisFormPage;
