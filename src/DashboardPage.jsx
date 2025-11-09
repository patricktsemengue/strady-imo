import React from 'react';
import { ArrowUpDownIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TextCursorInputIcon, TrashIcon } from './Icons';

const DashboardPage = ({ analyses, onLoad, onDelete, onUpdateName, onBack, maxAnalyses, onView }) => {
    const [sortOrder, setSortOrder] = React.useState('createdAt');
    const [sortDirection, setSortDirection] = React.useState('desc');
    const [openMenuId, setOpenMenuId] = React.useState(null);

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

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes analyses</h1>
            <div className="mb-4 flex flex-wrap justify-center items-center gap-2">
                <div className="flex justify-center gap-2" role="group">
                    <button onClick={() => setSortOrder('createdAt')} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'createdAt' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Trier par Date</button>
                    <button onClick={() => setSortOrder('name')} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'name' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Trier par Nom</button>
                    <button onClick={() => setSortOrder('profitability')} className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${sortOrder === 'profitability' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}>Trier par Rentabilité</button>
                </div>
                <button
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-2.5 rounded-lg border-2 bg-white text-gray-700 border-gray-300 hover:border-blue-500 transition-all"
                    title={`Trier par ordre ${sortDirection === 'asc' ? 'décroissant' : 'croissant'}`}
                >
                    <ArrowUpDownIcon />
                </button>
            </div>

            <div className="space-y-4">
                {sortedAnalyses.length === 0 && emptySlotsCount === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucune analyse sauvegardée. Augmentez la limite dans les paramètres pour en ajouter.</p>
                )}
                {sortedAnalyses.map(analysis => (
                    <div key={analysis.id} className="relative p-4 border rounded-lg">
                        <div className="flex-grow pr-10">
                            {renamingId === analysis.id ? (
                                <input
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onBlur={handleConfirmRename}
                                    onKeyDown={handleRenameKeyDown}
                                    className="font-bold text-lg p-1 border rounded-md w-full"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="font-bold text-lg">{analysis.project_name || analysis.data.projectName}</h2>
                            )}
                            <p className="text-sm text-gray-600">{analysis.data.ville}</p>
                            {analysis.result && (
                                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                    <div className={`p-2 rounded-md ${analysis.result.grade.startsWith('A') ? 'bg-green-100 text-green-800' : analysis.result.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        <div className="text-xs font-medium">Score</div><div className="font-bold">{analysis.result.grade}</div>
                                    </div>
                                    <div className="p-2 bg-gray-100 rounded-md"><div className="text-xs font-medium">Rend. Net</div><div className="font-bold">{analysis.result.rendementNet}%</div></div>
                                    <div className="p-2 bg-gray-100 rounded-md"><div className="text-xs font-medium">Cash-Flow</div><div className="font-bold">{analysis.result.cashflowMensuel}€</div></div>
                                    <div className="p-2 bg-gray-100 rounded-md"><div className="text-xs font-medium">CoC</div><div className="font-bold">{analysis.result.cashOnCash !== null && isFinite(analysis.result.cashOnCash) ? `${analysis.result.cashOnCash.toFixed(1)}%` : 'N/A'}</div></div>
                                </div>
                            )}
                        </div>
                        <div className="absolute top-2 right-2 context-menu-container flex-shrink-0">
                            <button onClick={() => setOpenMenuId(openMenuId === analysis.id ? null : analysis.id)} className="p-2 rounded-full hover:bg-gray-100">
                                <EllipsisVerticalIcon />
                            </button>
                            {openMenuId === analysis.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border animate-fade-in-fast">
                                    <button onClick={() => { onLoad(analysis.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><PencilIcon /> Modifier</button>
                                    <button onClick={() => { onView(analysis.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><EyeIcon /> Visualiser</button>
                                    <button onClick={() => handleStartRename(analysis)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><TextCursorInputIcon /> Renommer</button>
                                    <button onClick={() => { onDelete(analysis.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><TrashIcon /> Supprimer</button>
                                </div>
                            )}
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

export default DashboardPage;