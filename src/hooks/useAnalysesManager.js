import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useModal } from '../contexts/useModal';
import { analysisService } from '../services/analysisService';
import { calculateFinances } from '../utils/calculations';
import { supabase } from '../supabaseClient'; // Import supabase directly

export const useAnalysesManager = ({ data, result, currentAnalysisId, setCurrentAnalysisId, maxAnalyses, userPlan, setNotification, setData, setResult, setFinances, initialDataState, aiHook, saveAnalysis }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { setIsDeleteModalOpen, setIsSaveModalOpen, setIsAuthModalOpen } = useModal();

    const [analyses, setAnalyses] = React.useState([]);
    const [analysisToDelete, setAnalysisToDelete] = React.useState(null);
    const [viewingAnalysis, setViewingAnalysis] = React.useState(null);
    
    const [projectNameForSave, setProjectNameForSave] = React.useState('');
    const [saveError, setSaveError] = React.useState('');

    React.useEffect(() => {
        const loadAnalyses = async () => {
            const loadedAnalyses = user 
                ? await analysisService.loadAnalyses(user.id) 
                : JSON.parse(localStorage.getItem('immoAnalyses') || '[]');
            setAnalyses(loadedAnalyses);
        };
        loadAnalyses();
    }, [user]);

    const loadAnalysis = (id) => {
        const analysisToLoad = analyses.find(a => a.id === id);
        if (analysisToLoad) {
            setData(analysisToLoad.data || initialDataState);
            setResult(analysisToLoad.result);
            setFinances(calculateFinances(analysisToLoad.data || initialDataState));
            setCurrentAnalysisId(id);
            navigate('/');
            aiHook.resetAI();
        }
    };

    const handleNewProject = () => {
        setData(initialDataState);
        setResult(null);
        setCurrentAnalysisId(null);
        setFinances(calculateFinances(initialDataState));
        aiHook.resetAI();
        setNotification('Formulaire réinitialisé.', 'success');
        navigate('/');
    };
    
    const deleteAnalysis = (id) => {
        const analysis = analyses.find(a => a.id === id);
        if (analysis) {
            setAnalysisToDelete(analysis);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!analysisToDelete) return;
        const id = analysisToDelete.id;
        const success = user ? await analysisService.deleteAnalysis(id) : true;
        
        if (success) {
            const updatedAnalyses = analyses.filter(a => a.id !== id);
            setAnalyses(updatedAnalyses);
            if (!user) {
                localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
            }
            setNotification("Analyse supprimée.", 'success');
        } else {
            setNotification("Erreur lors de la suppression.", 'error');
        }
        
        setIsDeleteModalOpen(false);
        setAnalysisToDelete(null);
    };

    const selectAnalysisToView = (id) => {
        const analysisToView = analyses.find(a => a.id === id);
        if (analysisToView) {
            setViewingAnalysis(analysisToView);
            navigate('/view-analysis');
        }
    };

    const handleOpenSaveModal = () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        if (!data.property.ville || !data.property.ville.trim()) {
            setNotification('Le champ "Adresse/ Ville / Commune" est obligatoire.', 'error');
            return;
        }
        if (userPlan && analyses.length >= maxAnalyses && maxAnalyses !== -1) {
            setNotification(`Limite de ${maxAnalyses} analyses atteinte.`, 'error');
            return;
        }
        const parts = [data.property.typeBien, data.property.surface > 0 && `${data.property.surface}m²`, data.property.peb && data.property.peb !== 'N/C' && `PEB ${data.property.peb}`, data.property.ville].filter(Boolean);
        setProjectNameForSave(parts.join(' - ') || data.projectName);
        setSaveError('');
        setIsSaveModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        // Check if another analysis (not the current one) already has this name
        if (analyses.some(a => a.id !== data.property.uuid && (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà.');
            return;
        }

        const dataToSave = { ...data, projectName: projectNameForSave };
        setData(dataToSave);

        try {
            await saveAnalysis(); // This will perform an upsert
            const loadedAnalyses = await analysisService.loadAnalyses(user.id);
            setAnalyses(loadedAnalyses);
            setIsSaveModalOpen(false);
        } catch (error) {
            setSaveError(error.message);
        }
    };

    const handleSaveAsCopy = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        if (analyses.some(a => (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà.');
            return;
        }

        // Create a new data object for the copy, without the uuid
        const copyData = { ...data, projectName: projectNameForSave, property: { ...data.property, uuid: null } };
        setData(copyData); // Set the main state to this new copy

        // Wait for state to update then save. A small timeout ensures setData has completed.
        setTimeout(async () => {
            await saveAnalysis();
            const loadedAnalyses = await analysisService.loadAnalyses(user.id);
            setAnalyses(loadedAnalyses);
            setIsSaveModalOpen(false);
        }, 100);
    };

    const handleUpdateAnalysisName = async (id, newName) => {
        if (analyses.some(a => a.id !== id && (a.project_name || a.data.projectName) === newName)) {
            setNotification('Ce nom de projet existe déjà.', 'error');
            return;
        }
        const analysisToUpdate = analyses.find(a => a.id === id);
        if (!analysisToUpdate) return;
        const updatedData = { ...analysisToUpdate.data, projectName: newName };

        if (user) {
            // Use supabase.from... directly, as analysisService.upsertAnalysis is missing
            const { data: upserted, error } = await supabase
                .from('analyses')
                .update({ project_name: newName, data: updatedData })
                .eq('uuid', id)
                .select()
                .single();
            if (!upserted) {
                setNotification('Erreur lors de la mise à jour.', 'error');
                return;
            }
        }
        const updatedAnalyses = analyses.map(a => a.id === id ? { ...a, project_name: newName, data: updatedData } : a);
        if (!user) localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        setAnalyses(updatedAnalyses);
    };

    return {
        analyses,
        analysisToDelete,
        viewingAnalysis,
        loadAnalysis,
        handleNewProject,
        deleteAnalysis,
        handleConfirmDelete,
        selectAnalysisToView,
        projectNameForSave,
        setProjectNameForSave,
        saveError,
        setSaveError,
        handleOpenSaveModal,
        handleUpdate,
        handleSaveAsCopy,
        handleUpdateAnalysisName,
    };
};
