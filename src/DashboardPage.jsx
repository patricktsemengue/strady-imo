import React from 'react';
import { ArrowUpDownIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TextCursorInputIcon, TrashIcon, HomeIcon, PlusCircleIcon, CopyIcon, WalletIcon } from './Icons';

const DashboardPage = ({ analyses, onLoad, onDelete, onUpdateName, maxAnalyses, onView, onDuplicate, onUpgrade, highlightedAnalysisId }) => {
    const [sortOrder, setSortOrder] = React.useState('createdAt');
    const [sortDirection, setSortDirection] = React.useState('desc');
    const [openMenuId, setOpenMenuId] = React.useState(null);

    const isLimitReached = React.useMemo(() => {
        if (maxAnalyses === -1) return false; // unlimited plan
        return analyses.length >= maxAnalyses;
    }, [analyses.length, maxAnalyses]);


    // Logique améliorée pour l'affichage des emplacements vides
    const emptySlotsCount = React.useMemo(() => {
        if (maxAnalyses === -1) { // Cas "illimité"
            return 3;
        }
        const availableSlots = maxAnalyses - analyses.length;
        // On affiche au maximum 3 slots, ou moins si la limite est plus basse.
        return Math.min(Math.max(0, availableSlots), 3);
    }, [analyses.length, maxAnalyses]);
    const emptySlots = Array.from({ length: emptySlotsCount });

    // --- États pour le renommage ---
    const [renamingId, setRenamingId] = React.useState(null);
    const [renameValue, setRenameValue] = React.useState('');

    const sortedAnalyses = React.useMemo(() => {
        return [...analyses].sort((a, b) => {
            let comparison = 0;
            if (sortOrder === 'name') {
                const nameA = a.data.projectName || '';
                const nameB = b.data.projectName || '';
                comparison = nameA.localeCompare(nameB);
            } else if (sortOrder === 'profitability') {
                const rentaA = a.result ? parseFloat(a.result.rendementNet) : -Infinity;
                const rentaB = b.result ? parseFloat(b.result.rendementNet) : -Infinity;
                comparison = rentaB - rentaA;
            } else { // Default to sorting by creation date
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                comparison = dateB - dateA;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [analyses, sortOrder, sortDirection]);

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (openMenuId && !event.target.closest('.context-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [openMenuId]);

    const handleStartRename = (analysis) => {
        setRenamingId(analysis.id);
        setRenameValue(analysis.project_name || analysis.data.projectName);
        setOpenMenuId(null);
    };

    const handleConfirmRename = () => {
        if (renamingId && renameValue.trim()) {
            onUpdateName(renamingId, renameValue.trim());
        }
        setRenamingId(null);
    };

    const handleRenameKeyDown = (e) => {
        if (e.key === 'Enter') handleConfirmRename();
        if (e.key === 'Escape') setRenamingId(null);
    };

    const handleDeleteClick = (analysis) => {
        onDelete(analysis); // This function should trigger the confirmation modal
        setOpenMenuId(null);
    };

    const handleDuplicateClick = (analysis) => {
        onDuplicate(analysis); // Pass the full analysis object
        setOpenMenuId(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Mes analyses</h1>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-sm font-medium text-gray-600">Trier par:</span>
                    <div className="flex justify-center gap-2" role="group">
                        <button onClick={() => setSortOrder('createdAt')} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'createdAt' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Date</button>
                        <button onClick={() => setSortOrder('name')} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'name' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Nom</button>
                        <button onClick={() => setSortOrder('profitability')} className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'profitability' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Renta.</button>
                    </div>
                    <button
                        onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-blue-500 transition-all"
                        title={`Trier par ordre ${sortDirection === 'asc' ? 'décroissant' : 'croissant'}`}
                    >
                        <ArrowUpDownIcon />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedAnalyses.length === 0 && emptySlotsCount === 0 && (
                    <div className="md:col-span-2 text-center text-gray-500 py-8">
                        <p>Aucune analyse sauvegardée. Augmentez la limite dans les paramètres pour en ajouter.</p>
                    </div>
                )}
                {sortedAnalyses.map(analysis => (
                    <div 
                        key={analysis.id} 
                        className={`relative bg-white p-4 border rounded-lg flex flex-col shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 ${
                            analysis.id === highlightedAnalysisId ? 'animate-flash' : ''
                        }`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-grow pr-2">
                                {renamingId === analysis.id ? (
                                    <input
                                        type="text"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onBlur={handleConfirmRename}
                                        onKeyDown={handleRenameKeyDown}
                                        className="font-bold text-lg p-1 border border-blue-400 ring-2 ring-blue-200 rounded-md w-full"
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <h2 className="font-bold text-lg text-gray-800 break-words" title={analysis.project_name || analysis.data.projectName}>{analysis.project_name || analysis.data.projectName}</h2>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1"><HomeIcon className="h-4 w-4" /> {analysis.data.ville}</p>
                                    </>
                                )}
                            </div>
                            <div className="relative context-menu-container flex-shrink-0">
                                <button onClick={() => setOpenMenuId(openMenuId === analysis.id ? null : analysis.id)} className="p-2 rounded-full hover:bg-gray-100">
                                    <EllipsisVerticalIcon />
                                </button>
                                {openMenuId === analysis.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border animate-fade-in-fast">
                                        <button onClick={() => { onLoad(analysis.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><PencilIcon /> Modifier</button>
                                        <button onClick={() => { onView(analysis.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><EyeIcon /> Visualiser</button>
                                        <button onClick={() => handleStartRename(analysis)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><TextCursorInputIcon /> Renommer</button>
                                        <button 
                                            onClick={!isLimitReached ? () => handleDuplicateClick(analysis) : undefined} 
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${isLimitReached ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                            disabled={isLimitReached}
                                            title={isLimitReached ? "Vous avez atteint votre limite d'analyses." : "Dupliquer l'analyse"}
                                        >
                                            <CopyIcon /> Dupliquer
                                        </button>
                                        <button onClick={() => handleDeleteClick(analysis)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><TrashIcon /> Supprimer</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {analysis.result && (
                            <div className="mt-auto pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div className={`p-2 rounded-lg ${analysis.result.grade.startsWith('A') ? 'bg-green-100 text-green-800' : analysis.result.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="text-xs font-medium">Score</div><div className="font-bold">{analysis.result.grade}</div>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg"><div className="text-xs font-medium">Rend. Net</div><div className="font-bold">{analysis.result.rendementNet}%</div></div>
                                <div className="p-2 bg-gray-50 rounded-lg"><div className="text-xs font-medium">Cash-Flow</div><div className="font-bold">{analysis.result.cashflowMensuel}€</div></div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <div className="text-xs font-medium">CoC</div><div className="font-bold">{analysis.result.cashOnCash === Infinity ? '∞' : (analysis.result.cashOnCash !== null && isFinite(analysis.result.cashOnCash) ? `${analysis.result.cashOnCash.toFixed(1)}%` : 'N/A')}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {emptySlots.map((_, index) => (
                    <div 
                        key={`empty-${index}`} 
                        className={`p-8 border-2 border-dashed rounded-lg flex flex-col justify-center items-center transition-colors ${isLimitReached ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer'}`}
                        onClick={!isLimitReached ? () => onLoad(null) : undefined}
                        title={isLimitReached ? "Vous avez atteint votre limite d'analyses." : "Créer une nouvelle analyse"}
                    >
                        <PlusCircleIcon className="h-10 w-10 mb-2" />
                        <p className="font-semibold">Nouvelle analyse</p>
                    </div>
                ))}
                {analyses.length >= maxAnalyses && maxAnalyses > 0 && maxAnalyses !== -1 && (
                    <div className="md:col-span-2 p-4 border border-orange-200 bg-orange-50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                        <div>
                            <p className="font-semibold text-orange-800">Vous avez atteint votre limite de {maxAnalyses} analyses.</p>
                            <p className="text-sm text-orange-700">Passez au plan supérieur pour continuer à sauvegarder vos projets.</p>
                        </div>
                        <button onClick={onUpgrade} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 flex-shrink-0 flex items-center gap-2">
                            <WalletIcon />
                            <span>Voir les abonnements</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;