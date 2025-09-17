import React from 'react';
import { useTranslation } from 'react-i18next';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function Rental({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const renovationCost = data.renovationItems.reduce((total, item) => {
    const COST_PER_SQM = { light: 250, medium: 750, heavy: 1500 };
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);
  const registrationTaxRate = data.region === 'flanders' ? 0.03 : 0.125;
  const registrationTax = (data.propertyPrice || 0) * registrationTaxRate;
  const notaryFees = (data.propertyPrice || 0) * 0.015 + 1200;
  const totalProjectCost = (data.propertyPrice || 0) + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - (data.personalContribution || 0);
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const annualMortgageCost = monthlyPayment * 12;

  const grossAnnualIncome = ((data.monthlyRent || 0) + (data.otherMonthlyIncome || 0)) * 12;
  const effectiveGrossIncome = grossAnnualIncome * (1 - (data.vacancyRate || 0) / 100);
  const totalAnnualExpenses = (data.propertyTax || 0) + (data.insurance || 0) + (data.maintenance || 0) + ((data.coOwnershipFees || 0) * 12) + ((data.otherExpenses || 0) * 12);
  const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;
  const monthlyCashFlow = annualCashFlow / 12;

  return (
    <div className="step-container">
      <h2>{t('step4_title')}</h2>
      <h4>{t('income_section')}</h4>
      <div className="form-group">
        <label>{t('monthly_rent')}</label>
        <input type="number" value={data.monthlyRent} onChange={(e) => updateData({ monthlyRent: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('other_income')}</label>
        <input type="number" value={data.otherMonthlyIncome} onChange={(e) => updateData({ otherMonthlyIncome: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('vacancy_rate')}</label>
        <input type="number" value={data.vacancyRate} onChange={(e) => updateData({ vacancyRate: parseFloat(e.target.value) || 0 })} />
      </div>
      <h4 style={{marginTop: '2rem'}}>{t('expenses_section')}</h4>
      <div className="form-group">
        <label>{t('property_tax')}</label>
        <input type="number" value={data.propertyTax} onChange={(e) => updateData({ propertyTax: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('insurance')}</label>
        <input type="number" value={data.insurance} onChange={(e) => updateData({ insurance: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('maintenance')}</label>
        <input type="number" value={data.maintenance} onChange={(e) => updateData({ maintenance: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>{t('co_ownership_fees')}</label>
        <input type="number" value={data.coOwnershipFees} onChange={(e) => updateData({ coOwnershipFees: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="cost-display">{t('noi')} {formatCurrency(netOperatingIncome)}</div>
      <div className={`cost-display ${monthlyCashFlow < 0 ? 'negative' : ''}`} style={{marginTop: '10px'}}>
        <strong>{t('monthly_cash_flow')} {formatCurrency(monthlyCashFlow)}</strong>
      </div>
      <div className="button-group">
        <button className="back-button" onClick={onBack}>{t('previous')}</button>
        <button className="next-button" onClick={onNext}>{t('next_summary')}</button>
      </div>
    </div>
  );
}

export default Rental;