import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
    const [isTensionEstimatorOpen, setIsTensionEstimatorOpen] = useState(false);
    const [isVacancyEstimatorOpen, setIsVacancyEstimatorOpen] = useState(false);
    const [isChargesEstimatorOpen, setIsChargesEstimatorOpen] = useState(false);
    const [isRentSplitterOpen, setIsRentSplitterOpen] = useState(false);
    const [isAcquisitionFeesEstimatorOpen, setIsAcquisitionFeesEstimatorOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);

    const value = {
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
        selectedMetric, setSelectedMetric,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};