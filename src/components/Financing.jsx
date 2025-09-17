import React from 'react';
import { useTranslation } from 'react-i18next';
import { COST_PER_SQM } from '../config';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function Financing({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const registrationTaxRate = data.region === 'flanders' ? 0.03 : 0.125;
  const registrationTax = (data.propertyPrice || 0) * registrationTaxRate;
  const notaryFees = (data.propertyPrice || 0) * 0.015 + 1200;
  const renovationCost = data.renovationItems.reduce((total, item) => {
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);
  const totalProjectCost = (data.propertyPrice || 0) + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - (data.personalContribution || 0);
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

  return (
    <div className="step-container">
      <h2>{t('step3_title')}</h2>
      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h4>{t('cost_breakdown_title')}</h4>
        <p><span>{t('property_price')}</span> <span>{formatCurrency(data.propertyPrice)}</span></p>
        <p><span>{t('reg_tax')}</span> <span>{formatCurrency(registrationTax)}</span></p>
        <p><span>{t('notary_fees')}</span> <span>{formatCurrency(notaryFees)}</span></p>
        <p><span>{t('renovation_cost')}</span> <span>{formatCurrency(renovationCost)}</span></p><hr/>
        <p><strong>{t('total_est_cost')}</strong> <strong>{formatCurrency(totalProjectCost)}</strong></p>
      </div>
      <div className="form-group">
        <label>{t('personal_contribution')}</label>
        <input type="number" value={data.personalContribution} onChange={(e) => updateData({ personalContribution: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('loan_duration')}</label>
        <input type="number" value={data.loanDuration} onChange={(e) => updateData({ loanDuration: parseInt(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('interest_rate')}</label>
        <input type="number" step="0.01" value={data.interestRate} onChange={(e) => updateData({ interestRate: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="cost-display">{t('amount_to_borrow')} {formatCurrency(loanAmount > 0 ? loanAmount : 0)}</div>
      <div className="cost-display" style={{marginTop: '10px'}}>{t('est_monthly_payment')} {formatCurrency(monthlyPayment)}</div>
      <div className="button-group">
        <button className="back-button" onClick={onBack}>{t('previous')}</button>
        <button className="next-button" onClick={onNext}>{t('next_rental')}</button>
      </div>
    </div>
  );
}

export default Financing;