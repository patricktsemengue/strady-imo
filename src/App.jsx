import React, { useState } from 'react';
import Acquisition from './components/Acquisition';
import RenovationBuild from './components/RenovationBuild';
import Financing from './components/Financing';
import Rental from './components/Rental';
import Summary from './components/Summary';
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  const resetJourney = () => {
    setProjectData(initialProjectData);
    setCurrentStep(1);
  };

  const updateProjectData = (newData) => {
    setProjectData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <div className="app-container">
      <header><h1>Strady . imo</h1></header>
      <main>
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