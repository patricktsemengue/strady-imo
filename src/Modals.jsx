import React from 'react';
import { useModal } from './contexts/useModal';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CopyIcon, SaveIcon } from './Icons';
import ConfirmationDrawer from './components/ConfirmationDrawer';
import ProfileDrawer from './components/ProfileDrawer';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import WorkEstimatorDrawer from './components/WorkEstimatorDrawer';
import TensionLocativeEstimatorDrawer from './components/TensionLocativeEstimatorDrawer';
import VacancyEstimatorDrawer from './components/VacancyEstimatorDrawer';
import ChargesEstimatorDrawer from './components/ChargesEstimatorDrawer';
import RentSplitterDrawer from './components/RentSplitterDrawer';
import AcquisitionFeesEstimatorDrawer from './components/AcquisitionFeesEstimatorDrawer';
import MetricExplanationDrawer from './components/MetricExplanationDrawer';
import ScoreExplanationDrawer from './components/ScoreExplanationDrawer';
import SaveAnalysisDrawer from './components/SaveAnalysisDrawer';
import ObjectivesInfoDrawer from './components/ObjectivesInfoDrawer';

import DuplicateAnalysisDrawer from './components/DuplicateAnalysisDrawer';
const Modals = ({
    userPlan,
    analyses,
    handleSignOut,
    aiHook,
    handleTravauxUpdate,
    data,
    handleTensionUpdate,
    handleVacancyUpdate,
    handleChargesUpdate,
    handleRentSplitUpdate,
    handleAcquisitionFeesUpdate,
    handleSaveNewAnalysis,
    onConfirmDuplicate,
    currentAnalysisId,
    projectNameForSave,
    setProjectNameForSave,
    saveError,
    setSaveError,
    analysisToDelete,
    handleConfirmDelete,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    analysisToDuplicate,
}) => {
    const {
        isEstimatorOpen, setIsEstimatorOpen,
        isTensionEstimatorOpen, setIsTensionEstimatorOpen,
        isVacancyEstimatorOpen, setIsVacancyEstimatorOpen,
        isChargesEstimatorOpen, setIsChargesEstimatorOpen,
        isRentSplitterOpen, setIsRentSplitterOpen,
        isAcquisitionFeesEstimatorOpen, setIsAcquisitionFeesEstimatorOpen,
        isSaveModalOpen, setIsSaveModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        isAuthModalOpen, setIsAuthModalOpen,
        isProfileModalOpen, setIsProfileModalOpen,
        isSignOutModalOpen, setIsSignOutModalOpen,
        isScoreModalOpen, setIsScoreModalOpen,
        isMetricModalOpen, setIsMetricModalOpen,
        isCreditModalOpen, setIsCreditModalOpen,
        isObjectivesInfoModalOpen, setIsObjectivesInfoModalOpen,
        isAiAssistantModalOpen, setIsAiAssistantModalOpen,
        selectedMetric,
    } = useModal();
    const { user, setAuthPageInitialMode } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <ProfileDrawer
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onNavigate={(path) => {
                    navigate(path);
                    setIsProfileModalOpen(false);
                }}
                onSignOut={() => setIsSignOutModalOpen(true)}
                user={user}
                userPlan={userPlan}
                analyses={analyses}
            />
            <ConfirmationDrawer
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={handleSignOut}
                title="Confirmation de déconnexion"
                confirmText="Se déconnecter"
            >
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <p className="mt-2 text-sm text-gray-600">Toute analyse non sauvegardée sera perdue.</p>
            </ConfirmationDrawer>

            <WorkEstimatorDrawer 
                isOpen={isEstimatorOpen} 
                onClose={() => setIsEstimatorOpen(false)}
                onSave={(total, items) => {
                    handleTravauxUpdate(total, items);
                    setIsEstimatorOpen(false);
                }} 
                initialValue={data?.coutTravaux || 0} 
            />
            <TensionLocativeEstimatorDrawer isOpen={isTensionEstimatorOpen} onClose={() => setIsTensionEstimatorOpen(false)} onApply={handleTensionUpdate} />
            <VacancyEstimatorDrawer isOpen={isVacancyEstimatorOpen} onClose={() => setIsVacancyEstimatorOpen(false)} onApply={handleVacancyUpdate} currentTension={data?.tensionLocative} />
            <ChargesEstimatorDrawer isOpen={isChargesEstimatorOpen} onClose={() => setIsChargesEstimatorOpen(false)} onApply={handleChargesUpdate} data={data} />
            <RentSplitterDrawer isOpen={isRentSplitterOpen} onClose={() => setIsRentSplitterOpen(false)} onApply={handleRentSplitUpdate} initialUnits={data?.rentUnits} />
            <AcquisitionFeesEstimatorDrawer
                isOpen={isAcquisitionFeesEstimatorOpen}
                onClose={() => setIsAcquisitionFeesEstimatorOpen(false)}
                onApply={handleAcquisitionFeesUpdate} 
                prixAchat={data?.prixAchat}
                revenuCadastral={data?.property.revenuCadastral}
            />
            <MetricExplanationDrawer
                isOpen={isMetricModalOpen}
                onClose={() => setIsMetricModalOpen(false)}
                metric={selectedMetric}
            />
            <ScoreExplanationDrawer isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} />
            <SaveAnalysisDrawer
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveNewAnalysis}
                currentAnalysisId={currentAnalysisId}
                projectName={projectNameForSave}
                setProjectName={setProjectNameForSave}
                error={saveError}
                setError={setSaveError}
            />
            <ConfirmationDrawer
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onConfirm={() => {
                    setAuthPageInitialMode('signUp');
                    navigate('/auth');
                    setIsAuthModalOpen(false);
                }}
                title="Accédez à toutes les fonctionnalités"
                confirmText="Créer un compte"
            >
                <p>Pour sauvegarder et gérer vos analyses, veuillez créer un compte gratuit.</p>
                <p className="mt-2 text-sm text-gray-600">C'est rapide et vous permettra de conserver votre historique.</p>
            </ConfirmationDrawer>
            <ConfirmationDrawer
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la Suppression"
                confirmText="Supprimer"
            >
                <p>Êtes-vous sûr de vouloir supprimer l'analyse : <strong>{analysisToDelete?.project_name || analysisToDelete?.data.projectName}</strong> ?</p>
                <p className="mt-2 text-sm text-red-600">Cette action est irréversible.</p>
            </ConfirmationDrawer>
            <ConfirmationDrawer
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
                onConfirm={() => {
                    navigate('/plans');
                    setIsCreditModalOpen(false);
                }}
                title="Crédits IA épuisés"
                confirmText="Voir les abonnements"
            >
                <p>Vous n'avez plus de crédits pour utiliser l'assistant IA.</p>
                <p className="mt-2 text-sm text-gray-600">Pour continuer à bénéficier de l'analyse intelligente, veuillez recharger vos crédits.</p>
            </ConfirmationDrawer>

            <ObjectivesInfoDrawer
                isOpen={isObjectivesInfoModalOpen}
                onClose={() => setIsObjectivesInfoModalOpen(false)}
            />
            <AiAssistantDrawer
                isOpen={isAiAssistantModalOpen}
                onClose={() => setIsAiAssistantModalOpen(false)}
                {...aiHook}
            />
            <DuplicateAnalysisDrawer
                isOpen={isDuplicateModalOpen}
                onClose={() => setIsDuplicateModalOpen(false)}
                onConfirm={onConfirmDuplicate}
                analysis={analysisToDuplicate}
            />
        </>
    );
};

export default Modals;