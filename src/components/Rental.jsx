// src/components/Rental.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateRegistrationTax, calculateRenovationCost } from '../utils/calculations';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Rental({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();

  // --- LOGIC (UNMODIFIED) ---
  const { total: renovationCost } = calculateRenovationCost(data.renovationItems, data);
  const registrationTax = calculateRegistrationTax(data.propertyPrice, data.region, data.isPrimaryResidence);
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

  // --- NEW JSX STRUCTURE ---
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          {/* Income Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-text-primary">{t('income_section')}</h4>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('monthly_rent')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.monthlyRent} onChange={(e) => updateData({ monthlyRent: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('vacancy_rate')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.vacancyRate} onChange={(e) => updateData({ vacancyRate: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
          
          {/* Expenses Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-text-primary">{t('expenses_section')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('property_tax')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.propertyTax} onChange={(e) => updateData({ propertyTax: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('insurance')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.insurance} onChange={(e) => updateData({ insurance: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('maintenance')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.maintenance} onChange={(e) => updateData({ maintenance: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block font-medium mb-2 text-text-secondary text-sm">{t('co_ownership_fees')}</label>
                <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.coOwnershipFees} onChange={(e) => updateData({ coOwnershipFees: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary/Info */}
        <div className="bg-bg-primary border border-border-color rounded-lg p-6 flex flex-col justify-center space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-text-secondary">{t('noi')}</h3>
            <p className="text-3xl font-bold text-text-primary">{formatCurrency(netOperatingIncome)}</p>
          </div>
          <div className={`p-6 rounded-lg text-center ${monthlyCashFlow >= 0 ? 'bg-positive-bg text-positive-text' : 'bg-negative-bg text-negative-text'}`}>
            <h3 className="font-semibold opacity-80">{t('monthly_cash_flow')}</h3>
            <p className="text-4xl font-bold">{formatCurrency(monthlyCashFlow)}</p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-10 flex justify-between">
        <button onClick={onBack} className="bg-bg-secondary text-text-primary border border-border-color font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('previous')}</button>
        <button onClick={onNext} className="bg-accent-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity">{t('next_summary')}</button>
      </div>
    </div>
  );
}

export default Rental;