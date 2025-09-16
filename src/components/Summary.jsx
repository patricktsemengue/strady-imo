import React from 'react';

// A simple helper for formatting currency
const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function Summary({ data, onBack, onReset }) {
  // --- Re-run all calculations for a complete and consistent summary ---

  // 1. Costs
  const renovationCost = data.renovationItems.reduce((total, item) => {
    const COST_PER_SQM = { light: 250, medium: 750, heavy: 1500 };
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);
  const registrationTaxRate = data.region === 'flanders' ? 0.03 : 0.125;
  const registrationTax = data.propertyPrice * registrationTaxRate;
  const notaryFees = data.propertyPrice * 0.015 + 1200;
  const totalProjectCost = data.propertyPrice + registrationTax + notaryFees + renovationCost;

  // 2. Financing
  const loanAmount = totalProjectCost - data.personalContribution;
  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = (data.loanDuration || 0) * 12;
  const monthlyPayment = P > 0 && r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const annualMortgageCost = monthlyPayment * 12;

  // 3. Rental Performance
  const grossAnnualIncome = ((data.monthlyRent || 0) + (data.otherMonthlyIncome || 0)) * 12;
  const effectiveGrossIncome = grossAnnualIncome * (1 - (data.vacancyRate || 0) / 100);
  const totalAnnualExpenses = (data.propertyTax || 0) + (data.insurance || 0) + (data.maintenance || 0) + ((data.coOwnershipFees || 0) * 12);
  const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;

  // 4. Key Investment Metrics
  const initialCashOutlay = data.personalContribution + registrationTax + notaryFees;
  const capRate = data.propertyPrice > 0 ? (netOperatingIncome / data.propertyPrice) * 100 : 0;
  const cashOnCashReturn = initialCashOutlay > 0 ? (annualCashFlow / initialCashOutlay) * 100 : 0;

  return (
    <div className="step-container">
      <h2>5. Project Summary & ROI</h2>

      <div className="summary-section">
        <h4>Acquisition & Renovation</h4>
        <p><span>Property Price:</span> <strong>{formatCurrency(data.propertyPrice)}</strong></p>
        <p><span>Total Renovation Cost:</span> <strong>{formatCurrency(renovationCost)}</strong></p>
      </div>

      <div className="summary-section">
        <h4>Financing Overview</h4>
        <p><span>Total Project Cost:</span> <strong>{formatCurrency(totalProjectCost)}</strong></p>
        <p><span>Your Initial Cash Outlay:</span> <strong>{formatCurrency(initialCashOutlay)}</strong></p>
        <p><span>Loan Amount:</span> <strong>{formatCurrency(loanAmount)}</strong></p>
        <p><span>Monthly Mortgage Payment:</span> <strong>{formatCurrency(monthlyPayment)}</strong></p>
      </div>

      <div className="summary-section">
        <h4>Rental Performance</h4>
        <p><span>Net Operating Income (NOI):</span> <strong>{formatCurrency(netOperatingIncome)} / year</strong></p>
        <p><span>Annual Cash Flow:</span> <strong style={{color: annualCashFlow >= 0 ? '#0b6e4f' : '#9e2b25'}}>{formatCurrency(annualCashFlow)}</strong></p>
      </div>

      <div className="summary-section metrics">
        <h4>Key Investment Metrics</h4>
        <div className="metric-box">
          <strong>{cashOnCashReturn.toFixed(2)}%</strong>
          <span>Cash-on-Cash Return</span>
          <small>Your annual return on the cash you invested.</small>
        </div>
        <div className="metric-box">
          <strong>{capRate.toFixed(2)}%</strong>
          <span>Capitalization Rate</span>
          <small>The property's return rate without factoring in the loan.</small>
        </div>
      </div>

      <div className="button-group">
        <button className="back-button" onClick={onBack}>← Previous</button>
        <button className="next-button" onClick={() => alert('PDF export functionality coming soon!')}>Export to PDF</button>
      </div>
      <button onClick={onReset} className="reset-button">Start New Journey</button>
    </div>
  );
}

export default Summary;