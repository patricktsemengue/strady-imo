import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LOAN_RATE_CACHE_DURATION } from '../config';
import { calculateRegistrationTax, calculateRenovationCost } from '../utils/calculations';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

// A small SVG icon for the reset button
const ResetIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5"></path></svg>;


function Financing({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const [loanRates, setLoanRates] = useState([]);
  const [isRateAuto, setIsRateAuto] = useState(true);

  // --- LOGIC (UNMODIFIED) ---
  useEffect(() => {
    const fetchRates = async () => { /* ... (unchanged) ... */ };
    // ... (caching logic is unchanged) ...
  }, []);

  useEffect(() => {
    if (isRateAuto && loanRates.length > 0) { /* ... (unchanged) ... */ }
  }, [data.loanDuration, loanRates, isRateAuto]);

  const handleInterestRateChange = (e) => {
    setIsRateAuto(false);
    updateData({ interestRate: parseFloat(e.target.value) || 0 });
  };

  const resetInterestRate = () => setIsRateAuto(true);

  const registrationTax = calculateRegistrationTax(data.propertyPrice, data.region, data.isPrimaryResidence);
  const { total: renovationCost } = calculateRenovationCost(data.renovationItems, data);
  const notaryFees = (data.propertyPrice || 0) * 0.015 + 1200;
  const totalProjectCost = (data.propertyPrice || 0) + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - (data.personalContribution || 0);
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

  // --- NEW JSX STRUCTURE ---
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <div>
            <label htmlFor="personal-contribution" className="block font-medium mb-2 text-text-secondary">{t('personal_contribution')}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">€</span>
              <input type="number" id="personal-contribution" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg pl-8 pr-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.personalContribution} onChange={(e) => updateData({ personalContribution: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          
          <div>
            <label htmlFor="loan-duration" className="block font-medium mb-2 text-text-secondary">{t('loan_duration')}</label>
            <select id="loan-duration" value={data.loanDuration} onChange={(e) => { setIsRateAuto(true); updateData({ loanDuration: parseInt(e.target.value, 10)})}} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50">
              <option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={25}>25</option><option value={30}>30</option>
            </select>
          </div>

          <div>
            <label htmlFor="interest-rate" className="block font-medium mb-2 text-text-secondary">{t('interest_rate')}</label>
            <div className="relative">
              <input type="number" step="0.01" id="interest-rate" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg pl-4 pr-12 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.interestRate} onChange={handleInterestRateChange} />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">%</span>
              {!isRateAuto && (
                <button onClick={resetInterestRate} title="Reset to auto-calculated rate" className="absolute inset-y-0 right-10 flex items-center px-2 text-text-secondary hover:text-accent-primary">
                  <ResetIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Summary/Info */}
        <div className="bg-bg-primary border border-border-color rounded-lg p-6 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">{t('financing_summary_title')}</h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-text-secondary">{t('property_price')}</span><span className="font-medium text-text-primary">{formatCurrency(data.propertyPrice)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">{t('reg_tax')}</span><span className="font-medium text-text-primary">{formatCurrency(registrationTax)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">{t('notary_fees')}</span><span className="font-medium text-text-primary">{formatCurrency(notaryFees)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">{t('renovation_cost')}</span><span className="font-medium text-text-primary">{formatCurrency(renovationCost)}</span></div>
              <div className="flex justify-between pt-2 border-t border-border-color"><strong className="text-text-primary">{t('total_est_cost')}</strong><strong className="text-text-primary">{formatCurrency(totalProjectCost)}</strong></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline p-4 bg-bg-secondary rounded-lg">
              <span className="font-semibold text-text-primary">{t('amount_to_borrow')}</span>
              <span className="text-2xl font-bold text-accent-primary">{formatCurrency(loanAmount > 0 ? loanAmount : 0)}</span>
            </div>
            <div className="flex justify-between items-baseline p-4 bg-bg-secondary rounded-lg">
              <span className="font-semibold text-text-primary">{t('est_monthly_payment')}</span>
              <span className="text-2xl font-bold text-accent-primary">{formatCurrency(monthlyPayment)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-10 flex justify-between">
        <button onClick={onBack} className="bg-bg-secondary text-text-primary border border-border-color font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('previous')}</button>
        <button onClick={onNext} className="bg-accent-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity">{t('next_rental')}</button>
      </div>
    </div>
  );
}

export default Financing;