import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAnalysis } from './hooks/useAnalysis';
import { useAI } from './hooks/useAI';
import { useModal } from './contexts/useModal';
import { useNotification } from './contexts/useNotification';
import { useUserPlan } from './hooks/useUserPlan.js';
import { useAnalysesManager } from './hooks/useAnalysesManager.jsx';
import Layout from './Layout';
import Modals from './Modals';
import WelcomeHandler from './WelcomeHandler';
import AppRouter from './Router';
import CookieBanner from './CookieBanner';

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut, authPageInitialMode, setAuthPageInitialMode } = useAuth();
    const { showNotification } = useNotification();
    const {
        setIsSignOutModalOpen,
        setIsProfileModalOpen,
        setIsTensionEstimatorOpen,
        setIsVacancyEstimatorOpen,
        setIsChargesEstimatorOpen,
        setIsRentSplitterOpen,
        selectedMetric,
        setIsSaveModalOpen,
        setIsCreditModalOpen,
    } = useModal();

    const analysisHook = useAnalysis({ user, setNotification: showNotification });

    const [currentAnalysisId, setCurrentAnalysisId] = React.useState(null);
    const [isDuplicating, setIsDuplicating] = React.useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = React.useState(false);
    const [highlightedAnalysisId, setHighlightedAnalysisId] = React.useState(null);
    const [analysisToDuplicate, setAnalysisToDuplicate] = React.useState(null);
    const { userPlan, maxAnalyses, setUserPlan } = useUserPlan(user);

    const aiHook = useAI({
        user, userPlan, setUserPlan, setData: analysisHook.setData, setNotification: showNotification,
        setIsCreditModalOpen: setIsCreditModalOpen,
        currentData: analysisHook.data,
        setIsSaveModalOpen: setIsSaveModalOpen,
        calculateAndShowResult: analysisHook.calculateAndShowResult,
        isAnalysisComplete: analysisHook.isAnalysisComplete,
        saveAnalysis: analysisHook.saveAnalysis,
    });

    const analysesManager = useAnalysesManager({
        data: analysisHook.data,
        result: analysisHook.result,
        currentAnalysisId,
        setCurrentAnalysisId,
        maxAnalyses,
        userPlan,
        setNotification: showNotification,
        setData: analysisHook.setData,
        setResult: analysisHook.setResult,
        setFinances: analysisHook.setFinances,
        initialDataState: analysisHook.initialDataState,
        aiHook,
        saveAnalysis: analysisHook.saveAnalysis,
        setIsDuplicating,
    });

    React.useEffect(() => {
        if (user && location.pathname === '/auth') {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            if (hashParams.has('access_token') && hashParams.get('type') === 'recovery') {
                return;
            }
            showNotification("Vous êtes déjà connecté.", 'success');
            navigate('/ai-assistant');
        }
    }, [user, location.pathname, navigate, showNotification]);

    const handleSignOut = async () => {
        setIsSignOutModalOpen(false);
        setIsProfileModalOpen(false);
        await signOut();
        showNotification('Vous avez été déconnecté avec succès.', 'success');
        navigate('/auth');
    };

    const handleDuplicateAnalysis = (analysis) => {
        if (maxAnalyses !== -1 && analysesManager.analyses.length >= maxAnalyses) {
            showNotification(`Vous avez atteint votre limite de ${maxAnalyses} analyses. Impossible de dupliquer.`, 'error');
            return;
        }
        setAnalysisToDuplicate(analysis);
        setIsDuplicateModalOpen(true);
    };

    const handleConfirmDuplicate = async (originalAnalysis, newName) => {
        const duplicatedData = JSON.parse(JSON.stringify(originalAnalysis.data));
        duplicatedData.projectName = newName;

        const newAnalysis = await analysesManager.saveDuplicatedAnalysis(duplicatedData, originalAnalysis.result);

        if (newAnalysis) {
            showNotification("Analyse dupliquée et sauvegardée avec succès.", 'success');
            setIsDuplicateModalOpen(false);
            setAnalysisToDuplicate(null);
            
            setHighlightedAnalysisId(newAnalysis.id);
            setTimeout(() => {
                setHighlightedAnalysisId(null);
            }, 3000);
        }
    };

    const analysisProps = {
        ...analysisHook,
        currentAnalysisId,
        setCurrentAnalysisId,
        isDuplicating,
    };

    return (
        <WelcomeHandler user={user}>
            <Layout handleNewProject={analysesManager.handleNewProject}>
                <AppRouter
                    user={user}
                    userPlan={userPlan}
                    maxAnalyses={maxAnalyses}
                    analysesManager={analysesManager}
                    analysisProps={analysisProps}
                    aiHook={aiHook}
                    handleDuplicateAnalysis={handleDuplicateAnalysis}
                    highlightedAnalysisId={highlightedAnalysisId}
                    authPageInitialMode={authPageInitialMode}
                    setAuthPageInitialMode={setAuthPageInitialMode}
                    setIsProfileModalOpen={setIsProfileModalOpen}
                />
            </Layout>
            <Modals
                userPlan={userPlan}
                analyses={analysesManager.analyses}
                aiHook={aiHook}
                data={analysisHook.data}
                handleTravauxUpdate={analysisHook.handleTravauxUpdate}
                handleTensionUpdate={(newValue) => { analysisHook.handleTensionUpdate(newValue); setIsTensionEstimatorOpen(false); }}
                handleVacancyUpdate={(newValue) => { analysisHook.handleVacancyUpdate(newValue); setIsVacancyEstimatorOpen(false); }}
                handleChargesUpdate={(total, items) => { analysisHook.handleChargesUpdate(total, items); setIsChargesEstimatorOpen(false); }}
                handleRentSplitUpdate={(total, units) => { analysisHook.handleRentSplitUpdate(total, units); setIsRentSplitterOpen(false); }}
                currentAnalysisId={currentAnalysisId}
                selectedMetric={selectedMetric}
                handleSignOut={handleSignOut}
                handleSaveNewAnalysis={analysesManager.handleSaveNewAnalysis}
                handleConfirmDelete={analysesManager.handleConfirmDelete}
                onConfirmDuplicate={handleConfirmDuplicate}
            />
            <CookieBanner />
        </WelcomeHandler>
    );
};

export default AppContent;
