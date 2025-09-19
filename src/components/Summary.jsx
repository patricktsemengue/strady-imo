import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateRegistrationTax, calculateRenovationCost } from '../utils/calculations';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Summary({ data, onBack, onReset }) {
  const { t } = useTranslation();
  
  // --- LOGIC (UNMODIFIED) ---
  const registrationTax = calculateRegistrationTax(data.propertyPrice, data.region, data.isPrimaryResidence);
  const { total: renovationCost } = calculateRenovationCost(data.renovationItems, data);
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

  const handleExport = async () => { /* ... (unchanged) ... */ };

  // --- NEW JSX STRUCTURE ---
  return (
    <div className="space-y-8">
      {/* Section 1: Costs */}
      <div className="bg-bg-primary border border-border-color rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-text-primary border-b border-border-color pb-2">{t('acquisition_renovation')}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">{t('property_price')}</span><strong className="text-text-primary">{formatCurrency(data.propertyPrice)}</strong></div>
          <div className="flex justify-between"><span className="text-text-secondary">{t('renovation_cost')}</span><strong className="text-text-primary">{formatCurrency(renovationCost)}</strong></div>
        </div>
      </div>
      
      {/* Section 2: Financing */}
      <div className="bg-bg-primary border border-border-color rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-text-primary border-b border-border-color pb-2">{t('financing_overview')}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">{t('initial_cash_outlay')}</span><strong className="text-text-primary">{formatCurrency(initialCashOutlay)}</strong></div>
          <div className="flex justify-between"><span className="text-text-secondary">{t('loan_amount')}</span><strong className="text-text-primary">{formatCurrency(loanAmount)}</strong></div>
          <div className="flex justify-between"><span className="text-text-secondary">{t('monthly_payment')}</span><strong className="text-text-primary">{formatCurrency(monthlyPayment)}</strong></div>
        </div>
      </div>
      
      {/* Section 3: Performance & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-primary border border-border-color rounded-lg p-6 text-center">
          <h4 className="font-semibold text-text-secondary">{t('annual_cash_flow')}</h4>
          <p className={`text-4xl font-bold ${annualCashFlow >= 0 ? 'text-positive-text' : 'text-negative-text'}`}>{formatCurrency(annualCashFlow)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-bg-primary border border-border-color rounded-lg p-4">
            <h4 className="font-semibold text-text-secondary text-sm">{t('coc_return')}</h4>
            <p className="text-2xl font-bold text-accent-primary">{cashOnCashReturn.toFixed(2)}%</p>
          </div>
          <div className="bg-bg-primary border border-border-color rounded-lg p-4">
            <h4 className="font-semibold text-text-secondary text-sm">{t('cap_rate')}</h4>
            <p className="text-2xl font-bold text-accent-primary">{capRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-10 flex justify-between items-center">
        <button onClick={onBack} className="bg-bg-secondary text-text-primary border border-border-color font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('previous')}</button>
        <div className="flex space-x-4">
          <button onClick={handleExport} className="bg-accent-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity">{t('export_pdf')}</button>
          <button onClick={onReset} className="text-text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-bg-primary">{t('reset_journey')}</button>
        </div>
      </div>
    </div>
  );
}

export default Summary;