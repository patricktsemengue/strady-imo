import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import AIAssistantPage from './AIAssistantPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AppRouter = ({
    user,
    userPlan,
    maxAnalyses,
    analysesManager,
    analysisProps,
    aiHook,
    handleDuplicateAnalysis,
    highlightedAnalysisId,
    authPageInitialMode,
    setAuthPageInitialMode,
    setIsProfileModalOpen,
}) => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/welcome" element={<PublicRoute><WelcomePage onNavigate={navigate} /></PublicRoute>} />
            <Route path="/" element={
                user ? (
                    <AnalysisFormPage
                        analyses={analysesManager.analyses}
                        userPlan={userPlan}
                        maxAnalyses={maxAnalyses}
                        currentAnalysisId={analysisProps.currentAnalysisId}
                        isDuplicating={analysisProps.isDuplicating}
                        setCurrentAnalysisId={analysisProps.setCurrentAnalysisId}
                        handleUpdateAnalysis={analysesManager.handleUpdateAnalysis}
                        handleOpenSaveDrawer={analysesManager.handleOpenSaveDrawer}
                        handleNewProject={analysesManager.handleNewProject}
                        viewAnalysis={analysesManager.selectAnalysisToView}
                        data={analysisProps.data}
                        handleDataChange={analysisProps.handleDataChange}
                        handleInputChange={analysisProps.handleInputChange}
                        handleNumericFocus={analysisProps.handleNumericFocus}
                        handleNumericBlur={analysisProps.handleNumericBlur}
                        finances={analysisProps.finances}
                        result={analysisProps.result}
                        validationErrors={analysisProps.validationErrors}
                        calculateScore={analysisProps.calculateScore}
                        typeBienOptions={analysisProps.typeBienOptions}
                        pebOptions={analysisProps.pebOptions}
                    />
                ) : (
                    <Navigate to="/welcome" />
                )
            } />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage
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
                loadMoreAnalyses={analysesManager.loadMoreAnalyses}
                hasMore={analysesManager.hasMore}
                loading={analysesManager.loading}
            /></ProtectedRoute>} />
            <Route path="/auth" element={<PublicRoute><AuthPage onBack={() => navigate('/')} onNavigate={navigate} initialMode={authPageInitialMode} /></PublicRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage onBack={() => navigate('/')} onNavigate={navigate} userPlan={userPlan} analysesCount={analysesManager.analyses.length} /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackPage onBack={() => navigate('/')} /></ProtectedRoute>} />
            <Route path="/privacy" element={<PrivacyPolicyPage onBack={() => navigate('/')} />} />
            <Route path="/terms" element={<TermsOfServicePage onBack={() => navigate('/')} />} />
            <Route path="/plans" element={<ProtectedRoute><PlansPage userPlan={userPlan} onBack={() => navigate('/')} onNavigate={navigate} /></ProtectedRoute>} />
            <Route path="/aide" element={<HelpHubPage onNavigate={navigate} />} />
            <Route path="/user-manual" element={<UserManualPage onBack={() => navigate('/aide')} />} />
            <Route path="/knowledge" element={<KnowledgePage onBack={() => navigate('/aide')} />} />
            <Route path="/glossary" element={<GlossaryPage onBack={() => navigate('/aide')} />} />
            <Route path="/view-analysis" element={<AnalysisViewPage analysis={analysesManager.viewingAnalysis} scenarios={analysisProps.generatePriceScenarios(analysesManager.viewingAnalysis)} onBack={() => navigate('/dashboard')} />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage onBack={() => navigate('/')} maxAnalyses={maxAnalyses} /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage {...aiHook} userPlan={userPlan} handleNewProject={analysesManager.handleNewProject} /></ProtectedRoute>} />
        </Routes>
    );
}

export default AppRouter;
