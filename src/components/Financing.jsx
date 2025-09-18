import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LOAN_RATE_CACHE_DURATION } from '../config';
import { calculateRegistrationTax, calculateRenovationCost } from '../utils/calculations';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function Financing({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const [loanRates, setLoanRates] = useState([]);
  const [isRateAuto, setIsRateAuto] = useState(true);

  // Effect to fetch and cache loan rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/loan-rates');
        if (!response.ok) throw new Error('Failed to fetch rates');
        const rates = await response.json();
        setLoanRates(rates);
        localStorage.setItem('loanRates', JSON.stringify(rates));
        localStorage.setItem('loanRatesTimestamp', Date.now());
      } catch (error) {
        console.error("Could not fetch loan rates from server:", error);
      }
    };

    const cachedRates = localStorage.getItem('loanRates');
    const cachedTimestamp = localStorage.getItem('loanRatesTimestamp');
    
    if (cachedRates && cachedTimestamp && (Date.now() - cachedTimestamp < LOAN_RATE_CACHE_DURATION)) {
      setLoanRates(JSON.parse(cachedRates));
    } else {
      fetchRates();
    }
  }, []);

  // Effect to auto-update the interest rate when loan duration changes
  useEffect(() => {
    if (isRateAuto && loanRates.length > 0) {
      const rateData = loanRates.find(r => parseInt(r.duration, 10) === data.loanDuration);
      if (rateData) {
        updateData({ interestRate: parseFloat(rateData.rate) });
      }
    }
  }, [data.loanDuration, loanRates, isRateAuto]);

  const handleInterestRateChange = (e) => {
    setIsRateAuto(false); // User is overriding, disable auto-updates
    updateData({ interestRate: parseFloat(e.target.value) || 0 });
  };
  
  const registrationTax = calculateRegistrationTax(data.propertyPrice, data.region, data.isPrimaryResidence);
  const { total: renovationCost } = calculateRenovationCost(data.renovationItems, data);
  const notaryFees = (data.propertyPrice || 0) * 0.015 + 1200;
  const totalProjectCost = (data.propertyPrice || 0) + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - (data.personalContribution || 0);
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

  return (
    <div className="step-container">
      <h2>{t('step3_title')}</h2>
      <div style={{ padding: '1rem', backgroundColor: 'var(--background-color)', borderRadius: '8px', marginBottom: '1.5rem' }}>
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
        <select value={data.loanDuration} onChange={(e) => { setIsRateAuto(true); updateData({ loanDuration: parseInt(e.target.value, 10)})}}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('interest_rate')}</label>
        <input type="number" step="0.01" value={data.interestRate} onChange={handleInterestRateChange} />
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