import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Acquisition from './components/Acquisition';
import RenovationBuild from './components/RenovationBuild';
import Financing from './components/Financing';
import Rental from './components/Rental';
import Summary from './components/Summary';
import ProgressStepper from './components/ProgressStepper';
import FloatingActionButton from './components/FloatingActionButton'; 

// This constant remains unchanged
const initialProjectData = {
  propertyPrice: '', surfaceArea: '', propertyType: 'existing', region: 'wallonia',
  isPrimaryResidence: true, propertyAge: 15, isPrivateDwelling: true,
  renovationItems: [], personalContribution: '', loanDuration: 25, 
  interestRate: 3.5, monthlyRent: '', otherMonthlyIncome: '', 
  vacancyRate: 5, propertyTax: '', insurance: '', maintenance: '', 
  coOwnershipFees: '', otherExpenses: '',
};

function App() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState(initialProjectData);
  const [theme, setTheme] = useState('standard'); // 'standard', 'daylight', or 'dark'

  // State management functions (unchanged)
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetJourney = () => {
    setProjectData(initialProjectData);
    setCurrentStep(1);
  };
  const updateProjectData = (newData) => {
    setProjectData(prevData => ({ ...prevData, ...newData }));
  };
  
  // New theme handler to apply classes to the body element
  useEffect(() => {
    const body = document.body;
    // We use the theme classes defined in our index.css
    body.classList.remove('theme-daylight', 'dark'); 
    if (theme === 'daylight') {
      body.classList.add('theme-daylight');
    } else if (theme === 'dark') {
      body.classList.add('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto text-center mb-8">
        <img src="/Strady-imo.png" alt="Strady.imo Logo" className="h-12 sm:h-16 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{t('app_title')}</h1>
        <p className="text-text-secondary mt-2">{t('app_subtitle', 'Your guide to property investment in Belgium.')}</p>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-4xl mx-auto bg-bg-secondary border border-border-color rounded-xl shadow-lg p-6 sm:p-10">
        <ProgressStepper currentStep={currentStep} />
        
        {currentStep === 1 && <Acquisition data={projectData} updateData={updateProjectData} onNext={nextStep} />}
        {currentStep === 2 && <RenovationBuild data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <Financing data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <Rental data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 5 && <Summary data={projectData} onBack={prevStep} onReset={resetJourney} />}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center mt-8">
        <p className="text-text-secondary text-sm">&copy; 2025 Strady.imo. All rights reserved.</p>
      </footer>
      
      {/* Floating Action Button */}
      <FloatingActionButton theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default App;