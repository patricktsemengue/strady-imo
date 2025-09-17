import React from 'react';
import { useTranslation } from 'react-i18next';

function ProgressStepper({ currentStep }) {
  const { t } = useTranslation();
  const steps = ['acquisition', 'renovation', 'financing', 'rental', 'summary'];

  return (
    <ol className="progress-stepper">
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