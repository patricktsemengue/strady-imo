import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAnalysis } from './hooks/useAnalysis';
import { useAI } from './hooks/useAI';
import { useModal } from './contexts/useModal';
import { useNotification } from './contexts/useNotification';
import { useUserPlan } from './hooks/useUserPlan.js';
import { useAnalysesManager } from './hooks/useAnalysesManager.jsx';

import Layout from './Layout';
import Modals from './Modals';
import WelcomePage from './WelcomePage';
import DashboardPage from './DashboardPage';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage';
import FeedbackPage from './FeedbackPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsOfServicePage from './TermsOfServicePage';
import PlansPage from './PlansPage';
import HelpHubPage from './HelpHubPage';
import UserManualPage from './UserManualPage';
import KnowledgePage from './KnowledgePage';
import GlossaryPage from './GlossaryPage';
import AnalysisViewPage from './AnalysisViewPage';
import SettingsPage from './SettingsPage';
import AnalysisFormPage from './AnalysisFormPage';
import CookieBanner from './CookieBanner';
import WelcomeHandler from './WelcomeHandler';
import AIAssistantPage from './AIAssistantPage';
import 'highlight.js/styles/github-dark.css';
import './logo.css';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut, authPageInitialMode, setAuthPageInitialMode } = useAuth();
    const { showNotification } = useNotification();
    const {
        setIsSignOutModalOpen,
        setIsProfileModalOpen,
        setIsEstimatorOpen,
        setIsTensionEstimatorOpen,
        setIsVacancyEstimatorOpen,
        setIsChargesEstimatorOpen,
        setIsRentSplitterOpen,
        setIsAcquisitionFeesEstimatorOpen,
        selectedMetric,
        setIsSaveModalOpen,
        setIsCreditModalOpen,
    } = useModal();

    const {
        data, setData, result, setResult, finances, setFinances,
        handleTravauxUpdate, handleTensionUpdate,
        handleVacancyUpdate, handleChargesUpdate, handleRentSplitUpdate,
        handleAcquisitionFeesUpdate, generatePriceScenarios, initialDataState,
        validationErrors, typeBienOptions, pebOptions, handleDataChange, handleInputChange,
        handleNumericFocus, handleNumericBlur, calculateScore, saveAnalysis, isAnalysisComplete,
        calculateAndShowResult
    } = useAnalysis({ user, setNotification: showNotification });

    const [currentAnalysisId, setCurrentAnalysisId] = React.useState(null);
    const [isDuplicating, setIsDuplicating] = React.useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = React.useState(false);
    const [highlightedAnalysisId, setHighlightedAnalysisId] = React.useState(null);
    const [analysisToDuplicate, setAnalysisToDuplicate] = React.useState(null);
    const { userPlan, maxAnalyses, setUserPlan } = useUserPlan(user);

    const aiHook = useAI({
        user, userPlan, setUserPlan, setData, setNotification: showNotification,
        setIsCreditModalOpen: setIsCreditModalOpen,
        currentData: data, // Pass the current analysis data to the AI hook
        setIsSaveModalOpen: setIsSaveModalOpen,
        calculateAndShowResult,
        isAnalysisComplete,
        saveAnalysis,
    });

    const analysesManager = useAnalysesManager({
        data,
        result,
        currentAnalysisId,
        setCurrentAnalysisId,
        maxAnalyses,
        userPlan,
        setNotification: showNotification,
        setData,
        setResult,
        setFinances,
        initialDataState,
        aiHook,
        saveAnalysis, // Pass the saveAnalysis function here
        setIsDuplicating, // Pass the setter to reset duplication state
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

        // Use the new function from the manager to save the copy directly
        const newAnalysis = await analysesManager.saveDuplicatedAnalysis(duplicatedData, originalAnalysis.result);

        if (newAnalysis) {
            showNotification("Analyse dupliquée et sauvegardée avec succès.", 'success');
            setIsDuplicateModalOpen(false);
            setAnalysisToDuplicate(null);
            
            // Set the ID to be highlighted
            setHighlightedAnalysisId(newAnalysis.id);
            setTimeout(() => {
                setHighlightedAnalysisId(null);
            }, 3000); // Highlight lasts for 3 seconds
        }
        // Error notification is handled inside saveNewAnalysis
    };

    return (
        <WelcomeHandler user={user}>
            <Layout handleNewProject={analysesManager.handleNewProject}>
                <Routes>
                    <Route path="/" element={
                        <AnalysisFormPage
                            analyses={analysesManager.analyses}
                            userPlan={userPlan}
                            maxAnalyses={maxAnalyses}
                            currentAnalysisId={currentAnalysisId}
                            isDuplicating={isDuplicating}
                            setCurrentAnalysisId={setCurrentAnalysisId}
                            handleUpdateAnalysis={analysesManager.handleUpdateAnalysis}
                            handleOpenSaveDrawer={analysesManager.handleOpenSaveDrawer}
                            handleNewProject={analysesManager.handleNewProject}
                            viewAnalysis={analysesManager.selectAnalysisToView}
                            data={data}
                            handleDataChange={handleDataChange}
                            handleInputChange={handleInputChange}
                            handleNumericFocus={handleNumericFocus}
                            handleNumericBlur={handleNumericBlur}
                            finances={finances}
                            result={result}
                            validationErrors={validationErrors}
                            calculateScore={calculateScore}
                            typeBienOptions={typeBienOptions}
                            pebOptions={pebOptions}
                        />
                    } />
                    <Route path="/dashboard" element={
                        <DashboardPage
                            user={user}
                            onProfileClick={() => setIsProfileModalOpen(true)}
                            analyses={analysesManager.analyses}
                            onLoad={analysesManager.loadAnalysis}
                            onDelete={analysesManager.deleteAnalysis}
                            onUpdateName={analysesManager.handleUpdateAnalysisName}
                            maxAnalyses={maxAnalyses}
                            onView={analysesManager.selectAnalysisToView}
                            onDuplicate={handleDuplicateAnalysis}
                            onUpgrade={() => navigate('/plans')}
                            highlightedAnalysisId={highlightedAnalysisId}
                        />} />
                    <Route path="/auth" element={<AuthPage onBack={() => navigate('/')} onNavigate={navigate} initialMode={authPageInitialMode} />} />
                    <Route path="/account" element={<AccountPage onBack={() => navigate('/')} onNavigate={navigate} userPlan={userPlan} analysesCount={analysesManager.analyses.length} />} />
                    <Route path="/feedback" element={<FeedbackPage onBack={() => navigate('/')} />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage onBack={() => navigate('/')} />} />
                    <Route path="/terms" element={<TermsOfServicePage onBack={() => navigate('/')} />} />
                    <Route path="/plans" element={<PlansPage userPlan={userPlan} onBack={() => navigate('/')} onNavigate={navigate} />} />
                    <Route path="/aide" element={<HelpHubPage onNavigate={navigate} />} />
                    <Route path="/user-manual" element={<UserManualPage onBack={() => navigate('/aide')} />} />
                    <Route path="/knowledge" element={<KnowledgePage onBack={() => navigate('/aide')} />} />
                    <Route path="/glossary" element={<GlossaryPage onBack={() => navigate('/aide')} />} />
                    <Route path="/view-analysis" element={<AnalysisViewPage analysis={analysesManager.viewingAnalysis} scenarios={generatePriceScenarios(analysesManager.viewingAnalysis)} onBack={() => navigate('/dashboard')} />} />
                    <Route path="/settings" element={<SettingsPage onBack={() => navigate('/')} maxAnalyses={maxAnalyses} />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage {...aiHook} userPlan={userPlan} handleNewProject={analysesManager.handleNewProject} />} />
                </Routes>
            </Layout>
            <Modals
                userPlan={userPlan}
                analyses={analysesManager.analyses}
                handleSignOut={handleSignOut}
                aiHook={aiHook}
                data={data}
                handleTravauxUpdate={handleTravauxUpdate}
                handleTensionUpdate={(newValue) => { handleTensionUpdate(newValue); setIsTensionEstimatorOpen(false); }}
                handleVacancyUpdate={(newValue) => { handleVacancyUpdate(newValue); setIsVacancyEstimatorOpen(false); }}
                handleChargesUpdate={(total, items) => { handleChargesUpdate(total, items); setIsChargesEstimatorOpen(false); }}
                handleRentSplitUpdate={(total, units) => { handleRentSplitUpdate(total, units); setIsRentSplitterOpen(false); }}
                handleSaveNewAnalysis={analysesManager.handleSaveNewAnalysis}
                projectNameForSave={analysesManager.projectNameForSave}
                onConfirmDuplicate={handleConfirmDuplicate}
                handleSaveAsCopy={analysesManager.handleSaveAsCopy}
                handletAnalysisId={currentAnalysisId}r
                setProjectNameForSave={analysesManager.setProjectNameForSave}
                saveError={analysesManager.saveError}
                setSaveError={analysesManager.setSaveError}
                analysisToDelete={analysesManager.analysisToDelete}
                handleConfirmDelete={analysesManager.handleConfirmDelete}
                isDuplicateModalOpen={isDuplicateModalOpen}
                setIsDuplicateModalOpen={setIsDuplicateModalOpen}
                analysisToDuplicate={analysisToDuplicate}
                selectedMetric={selectedMetric}
                authPageInitialMode={authPageInitialMode}
                setAuthPageInitialMode={setAuthPageInitialMode}
            />
            <CookieBanner />
        </WelcomeHandler>
    );
}
