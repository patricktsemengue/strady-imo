import React from 'react';
import { useTranslation } from 'react-i18next';

function ProgressStepper({ currentStep }) {
  const { t } = useTranslation();
  const steps = ['acquisition', 'renovation', 'financing', 'rental', 'summary'];
  const totalSteps = steps.length;

  // Calculate the width of the progress bar
  const progressPercentage = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <ol 
      className="progress-stepper"
      style={{ '--stepper-progress': `${progressPercentage}%` }} // Pass width to CSS
    >
      {steps.map((stepKey, index) => {
        const stepNumber = index + 1;
        let stepClass = 'step';
        if (stepNumber === currentStep) {
          stepClass += ' active';
        } else if (stepNumber < currentStep) {
          stepClass += ' completed';
        }

        return (
          <li key={stepKey} className={stepClass}>
            <div className="step-indicator">{stepNumber}</div>
            <div className="step-label">{t(`stepper.${stepKey}`)}</div>
          </li>
        );
      })}
    </ol>
  );
}

export default ProgressStepper;