import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAnalysis } from './hooks/useAnalysis';
import { useAI } from './hooks/useAI';
import { useModal } from './contexts/useModal';
import { useNotification } from './contexts/useNotification';
import { useUserPlan } from './hooks/useUserPlan.js';
import { useAnalysesManager } from './hooks/useAnalysesManager.js';

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
        typeBienOptions, pebOptions, handleDataChange, handleInputChange,
        handleNumericFocus, handleNumericBlur, calculateScore
    } = useAnalysis();

    const [currentAnalysisId, setCurrentAnalysisId] = React.useState(null);
    const { userPlan, maxAnalyses, setUserPlan } = useUserPlan(user);

    const aiHook = useAI({
        user, userPlan, setUserPlan, setData, setNotification: showNotification,
        typeBienOptions: [], setTypeBienOptions: () => {},
        setIsCreditModalOpen: setIsCreditModalOpen,
        setIsSaveModalOpen: setIsSaveModalOpen,
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
                            setCurrentAnalysisId={setCurrentAnalysisId}
                            handleOpenSaveModal={analysesManager.handleOpenSaveModal}
                            viewAnalysis={analysesManager.selectAnalysisToView}
                            data={data}
                            handleDataChange={handleDataChange}
                            handleInputChange={handleInputChange}
                            handleNumericFocus={handleNumericFocus}
                            handleNumericBlur={handleNumericBlur}
                            finances={finances}
                            result={result}
                            calculateScore={calculateScore}
                            typeBienOptions={typeBienOptions}
                            pebOptions={pebOptions}
                        />
                    } />
                    <Route path="/dashboard" element={<DashboardPage analyses={analysesManager.analyses} onLoad={analysesManager.loadAnalysis} onDelete={analysesManager.deleteAnalysis} onUpdateName={analysesManager.handleUpdateAnalysisName} maxAnalyses={maxAnalyses} onView={analysesManager.selectAnalysisToView} />} />
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
                {...aiHook}
                data={data}
                handleTravauxUpdate={handleTravauxUpdate}
                handleTensionUpdate={(newValue) => { handleTensionUpdate(newValue); setIsTensionEstimatorOpen(false); }}
                handleVacancyUpdate={(newValue) => { handleVacancyUpdate(newValue); setIsVacancyEstimatorOpen(false); }}
                handleChargesUpdate={(total, items) => { handleChargesUpdate(total, items); setIsChargesEstimatorOpen(false); }}
                handleRentSplitUpdate={(total, units) => { handleRentSplitUpdate(total, units); setIsRentSplitterOpen(false); }}
                handleAcquisitionFeesUpdate={(newValue) => { handleAcquisitionFeesUpdate(newValue); setIsAcquisitionFeesEstimatorOpen(false); }}
                handleConfirmSave={analysesManager.handleConfirmSave}
                handleUpdateAnalysis={analysesManager.handleUpdateAnalysis}
                currentAnalysisId={currentAnalysisId}
                projectNameForSave={analysesManager.projectNameForSave}
                setProjectNameForSave={analysesManager.setProjectNameForSave}
                saveError={analysesManager.saveError}
                setSaveError={analysesManager.setSaveError}
                analysisToDelete={analysesManager.analysisToDelete}
                handleConfirmDelete={analysesManager.handleConfirmDelete}
                selectedMetric={selectedMetric}
                authPageInitialMode={authPageInitialMode}
                setAuthPageInitialMode={setAuthPageInitialMode}
            />
            <CookieBanner />
        </WelcomeHandler>
    );
}
