import React from 'react';
import { useTranslation } from 'react-i18next';
import { COST_PER_SQM } from '../config';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function Summary({ data, onBack, onReset }) {
  const { t } = useTranslation();
  const renovationCost = data.renovationItems.reduce((total, item) => {
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);
  const registrationTaxRate = data.region === 'flanders' ? 0.03 : 0.125;
  const registrationTax = data.propertyPrice * registrationTaxRate;
  const notaryFees = data.propertyPrice * 0.015 + 1200;
  const totalProjectCost = data.propertyPrice + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - data.personalContribution;
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const annualMortgageCost = monthlyPayment * 12;
  const grossAnnualIncome = ((data.monthlyRent || 0) + (data.otherMonthlyIncome || 0)) * 12;
  const effectiveGrossIncome = grossAnnualIncome * (1 - (data.vacancyRate || 0) / 100);
  const totalAnnualExpenses = (data.propertyTax || 0) + (data.insurance || 0) + (data.maintenance || 0) + ((data.coOwnershipFees || 0) * 12);
  const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;
  const initialCashOutlay = data.personalContribution + registrationTax + notaryFees;
  const capRate = data.propertyPrice > 0 ? (netOperatingIncome / data.propertyPrice) * 100 : 0;
  const cashOnCashReturn = initialCashOutlay > 0 ? (annualCashFlow / initialCashOutlay) * 100 : 0;

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Strady-imo-Summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please ensure the backend server is running.');
    }
  };

  return (
    <div className="step-container">
      <h2>{t('step5_title')}</h2>
      <div className="summary-section">
        <h4>{t('acquisition_renovation')}</h4>
        <p><span>{t('property_price')}</span> <strong>{formatCurrency(data.propertyPrice)}</strong></p>
        <p><span>{t('renovation_cost')}</span> <strong>{formatCurrency(renovationCost)}</strong></p>
      </div>
      <div className="summary-section">
        <h4>{t('financing_overview')}</h4>
        <p><span>{t('total_est_cost')}</span> <strong>{formatCurrency(totalProjectCost)}</strong></p>
        <p><span>{t('initial_cash_outlay')}</span> <strong>{formatCurrency(initialCashOutlay)}</strong></p>
        <p><span>{t('loan_amount')}</span> <strong>{formatCurrency(loanAmount)}</strong></p>
        <p><span>{t('monthly_payment')}</span> <strong>{formatCurrency(monthlyPayment)}</strong></p>
      </div>
      <div className="summary-section">
        <h4>{t('rental_performance')}</h4>
        <p><span>{t('noi')}</span> <strong>{formatCurrency(netOperatingIncome)} / year</strong></p>
        <p><span>{t('annual_cash_flow')}</span> <strong style={{color: annualCashFlow >= 0 ? '#0b6e4f' : '#9e2b25'}}>{formatCurrency(annualCashFlow)}</strong></p>
      </div>
      <div className="summary-section metrics">
        <div className="metric-box">
          <strong>{cashOnCashReturn.toFixed(2)}%</strong>
          <span>{t('coc_return')}</span>
          <small>{t('coc_return_desc')}</small>
        </div>
        <div className="metric-box">
          <strong>{capRate.toFixed(2)}%</strong>
          <span>{t('cap_rate')}</span>
          <small>{t('cap_rate_desc')}</small>
        </div>
      </div>
      <div className="button-group">
        <button className="back-button" onClick={onBack}>{t('previous')}</button>
        <button className="next-button" onClick={handleExport}>{t('export_pdf')}</button>
      </div>
      <button onClick={onReset} className="reset-button">{t('reset_journey')}</button>
    </div>
  );
}

export default Summary;