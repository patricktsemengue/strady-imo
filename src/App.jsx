import React, { useState } from 'react';
import Acquisition from './components/Acquisition';
import RenovationBuild from './components/RenovationBuild';
import Financing from './components/Financing';
import Rental from './components/Rental';
import Summary from './components/Summary';
import ProgressStepper from './components/ProgressStepper';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import './App.css';

const initialProjectData = {
  propertyPrice: '', propertyType: 'existing', region: 'wallonia',
  renovationItems: [],
  personalContribution: '', loanDuration: 25, interestRate: 3.5,
  monthlyRent: '', otherMonthlyIncome: '', vacancyRate: 5, propertyTax: '',
  insurance: '', maintenance: '', coOwnershipFees: '', otherExpenses: '',
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState(initialProjectData);
  const [theme, setTheme] = useState('light');

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetJourney = () => {
    setProjectData(initialProjectData);
    setCurrentStep(1);
  };
  const updateProjectData = (newData) => {
    setProjectData(prevData => ({ ...prevData, ...newData }));
  };
  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-container" data-theme={theme}>
      <header>
        <h1>Strady . imo</h1>
        <LanguageSwitcher />
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </header>
      <main>
        <ProgressStepper currentStep={currentStep} />
        
        {currentStep === 1 && <Acquisition data={projectData} updateData={updateProjectData} onNext={nextStep} />}
        {currentStep === 2 && <RenovationBuild data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <Financing data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <Rental data={projectData} updateData={updateProjectData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 5 && <Summary data={projectData} onBack={prevStep} onReset={resetJourney} />}
      </main>
    </div>
  );
}

export default App;