import React from 'react';
import { useModal } from './contexts/useModal';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CopyIcon, SaveIcon } from './Icons';
import ConfirmationModal from './ConfirmationModal';
import ProfileModal from './ProfileModal';
import AiAssistantModal from './AiAssistantModal';
import WorkEstimatorModal from './WorkEstimatorModal';
import TensionLocativeEstimatorModal from './TensionLocativeEstimatorModal';
import VacancyEstimatorModal from './VacancyEstimatorModal';
import ChargesEstimatorModal from './ChargesEstimatorModal';
import RentSplitterModal from './RentSplitterModal';
import AcquisitionFeesEstimatorModal from './AcquisitionFeesEstimatorModal';
import MetricExplanationModal from './MetricExplanationModal';
import ScoreExplanationModal from './ScoreExplanationModal';
import SaveAnalysisModal from './SaveAnalysisModal';
import ObjectivesInfoModal from './ObjectivesInfoModal';

const DuplicateAnalysisModal = ({ isOpen, onClose, onConfirm, analysis }) => {
    const [newName, setNewName] = React.useState('');
    const [error, setError] = React.useState('');
    const inputRef = React.useRef(null);
    const MAX_LENGTH = 80;

    React.useEffect(() => {
        if (isOpen && analysis) {
            const originalName = analysis.project_name || analysis.data.projectName;
            setNewName(`${originalName} (copie)`);
            setError('');
            // Focus and select the input text when modal opens
            setTimeout(() => inputRef.current?.select(), 100);
        }
    }, [isOpen, analysis]);

    const handleConfirm = () => {
        if (!newName.trim()) {
            setError('Le nom ne peut pas être vide.');
            return;
        }
        onConfirm(analysis, newName.trim());
    };

    if (!isOpen) return null;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="Dupliquer l'analyse"
            confirmText="Dupliquer et Sauvegarder"
            Icon={CopyIcon}
        >
            <p className="mb-4 text-sm text-gray-600">Veuillez entrer un nouveau nom pour la copie de l'analyse :</p>
            <input ref={inputRef} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={MAX_LENGTH} className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`} />
            <div className="text-right text-xs text-gray-500 mt-1">{newName.length}/{MAX_LENGTH}</div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </ConfirmationModal>
    );
};
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
    handleConfirmSave,
    handleUpdate,
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
            <ProfileModal
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
            <ConfirmationModal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={handleSignOut}
                title="Confirmation de déconnexion"
                confirmText="Se déconnecter"
            >
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <p className="mt-2 text-sm text-gray-600">Toute analyse non sauvegardée sera perdue.</p>
            </ConfirmationModal>

            <WorkEstimatorModal 
                isOpen={isEstimatorOpen} 
                onClose={() => setIsEstimatorOpen(false)}
                onSave={(total, items) => {
                    handleTravauxUpdate(total, items);
                    setIsEstimatorOpen(false);
                }} 
                initialValue={data?.coutTravaux || 0} 
            />
            <TensionLocativeEstimatorModal isOpen={isTensionEstimatorOpen} onClose={() => setIsTensionEstimatorOpen(false)} onApply={handleTensionUpdate} />
            <VacancyEstimatorModal isOpen={isVacancyEstimatorOpen} onClose={() => setIsVacancyEstimatorOpen(false)} onApply={handleVacancyUpdate} currentTension={data?.tensionLocative} />
            <ChargesEstimatorModal isOpen={isChargesEstimatorOpen} onClose={() => setIsChargesEstimatorOpen(false)} onApply={handleChargesUpdate} data={data} />
            <RentSplitterModal isOpen={isRentSplitterOpen} onClose={() => setIsRentSplitterOpen(false)} onApply={handleRentSplitUpdate} initialUnits={data?.rentUnits} />
            <AcquisitionFeesEstimatorModal
                isOpen={isAcquisitionFeesEstimatorOpen}
                onClose={() => setIsAcquisitionFeesEstimatorOpen(false)}
                onApply={handleAcquisitionFeesUpdate} 
                prixAchat={data?.prixAchat}
                revenuCadastral={data?.property.revenuCadastral}
            />
            <MetricExplanationModal
                isOpen={isMetricModalOpen}
                onClose={() => setIsMetricModalOpen(false)}
                metric={selectedMetric}
            />
            <ScoreExplanationModal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} />
            <SaveAnalysisModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleConfirmSave}
                onUpdate={handleUpdate}
                currentAnalysisId={currentAnalysisId}
                projectName={projectNameForSave}
                setProjectName={setProjectNameForSave}
                error={saveError}
                setError={setSaveError}
            />
            <ConfirmationModal
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
            </ConfirmationModal>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la Suppression"
                confirmText="Supprimer"
            >
                <p>Êtes-vous sûr de vouloir supprimer l'analyse : <strong>{analysisToDelete?.project_name || analysisToDelete?.data.projectName}</strong> ?</p>
                <p className="mt-2 text-sm text-red-600">Cette action est irréversible.</p>
            </ConfirmationModal>
            <ConfirmationModal
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
            </ConfirmationModal>

            <ObjectivesInfoModal
                isOpen={isObjectivesInfoModalOpen}
                onClose={() => setIsObjectivesInfoModalOpen(false)}
            />
            <AiAssistantModal
                isOpen={isAiAssistantModalOpen}
                onClose={() => setIsAiAssistantModalOpen(false)}
                {...aiHook}
            />
            <DuplicateAnalysisModal
                isOpen={isDuplicateModalOpen}
                onClose={() => setIsDuplicateModalOpen(false)}
                onConfirm={onConfirmDuplicate}
                analysis={analysisToDuplicate}
            />
        </>
    );
};

export default Modals;
