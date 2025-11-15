import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useModal } from '../contexts/useModal';
import { analysisService } from '../services/analysisService';
import { calculateFinances } from '../utils/calculations';

export const useAnalysesManager = ({ data, result, currentAnalysisId, setCurrentAnalysisId, maxAnalyses, userPlan, setNotification, setData, setResult, setFinances, initialDataState, aiHook }) => {
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
        if (!data.ville || !data.ville.trim()) {
            setNotification('Le champ "Adresse/ Ville / Commune" est obligatoire.', 'error');
            return;
        }
        if (userPlan && analyses.length >= maxAnalyses && maxAnalyses !== -1) {
            setNotification(`Limite de ${maxAnalyses} analyses atteinte.`, 'error');
            return;
        }
        const parts = [data.typeBien, data.surface > 0 && `${data.surface}m²`, data.peb && data.peb !== 'N/C' && `PEB ${data.peb}`, data.ville].filter(Boolean);
        setProjectNameForSave(parts.join(' - ') || data.projectName);
        setSaveError('');
        setIsSaveModalOpen(true);
    };

    const handleUpdateAnalysis = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        if (analyses.some(a => a.id !== currentAnalysisId && (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà.');
            return;
        }
        const currentDataWithNewName = { ...data, projectName: projectNameForSave };
        const updatedAnalysis = user ? await analysisService.updateAnalysis(currentAnalysisId, { project_name: projectNameForSave, ville: currentDataWithNewName.ville, data: currentDataWithNewName, result: result }) : null;
        if (user && !updatedAnalysis) {
            setSaveError("Erreur lors de la mise à jour cloud");
            return;
        }
        const updatedAnalyses = analyses.map(a => a.id === currentAnalysisId ? (user ? updatedAnalysis : { ...a, data: currentDataWithNewName, result: result, project_name: projectNameForSave, ville: currentDataWithNewName.ville }) : a);
        setAnalyses(updatedAnalyses);
        if (!user) localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        setIsSaveModalOpen(false);
        setNotification(`'${projectNameForSave}' a été mis à jour !`, 'success');
    };

    const handleConfirmSave = async () => {
        if (!projectNameForSave.trim()) {
            setSaveError('Le nom du projet ne peut pas être vide.');
            return;
        }
        if (currentAnalysisId !== null) {
            const originalAnalysis = analyses.find(a => a.id === currentAnalysisId);
            if (originalAnalysis && (originalAnalysis.project_name || originalAnalysis.data.projectName) === projectNameForSave) {
                setSaveError('Pour sauvegarder une copie, veuillez changer le nom du projet.');
                return;
            }
        }
        if (analyses.some(a => (a.project_name || a.data.projectName) === projectNameForSave)) {
            setSaveError('Ce nom de projet existe déjà.');
            return;
        }
        const currentDataWithNewName = { ...data, projectName: projectNameForSave };
        const newAnalysisData = { user_id: user.id, project_name: projectNameForSave, ville: currentDataWithNewName.ville, data: currentDataWithNewName, result: result, created_at: new Date().toISOString() };
        const newCloudAnalysis = user ? await analysisService.saveAnalysis(newAnalysisData) : { ...newAnalysisData, id: Date.now() };
        if (user && !newCloudAnalysis) {
            setSaveError("Erreur lors de la sauvegarde cloud");
            return;
        }
        const updatedAnalyses = [newCloudAnalysis, ...analyses];
        setAnalyses(updatedAnalyses);
        if (!user) localStorage.setItem('immoAnalyses', JSON.stringify(updatedAnalyses));
        setCurrentAnalysisId(newCloudAnalysis.id);
        setIsSaveModalOpen(false);
        setNotification(`'${projectNameForSave}' a été sauvegardé !`, 'success');
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
            const { error } = await analysisService.updateAnalysis(id, { project_name: newName, data: updatedData });
            if (error) {
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
        handleUpdateAnalysis,
        handleConfirmSave,
        handleUpdateAnalysisName,
    };
};
