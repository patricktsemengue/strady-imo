import React from 'react';

function Rental({ data, updateData, onNext, onBack }) {
  // --- RECALCULATE MORTGAGE (needed for cash flow) ---
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

  // --- RENTAL CALCULATIONS ---
  const grossAnnualIncome = ((data.monthlyRent || 0) + (data.otherMonthlyIncome || 0)) * 12;
  const effectiveGrossIncome = grossAnnualIncome * (1 - (data.vacancyRate || 0) / 100);
  
  const totalAnnualExpenses = 
    (data.propertyTax || 0) + 
    (data.insurance || 0) + 
    (data.maintenance || 0) + 
    ((data.coOwnershipFees || 0) * 12) +
    ((data.otherExpenses || 0) * 12);
    
  const netOperatingIncome = effectiveGrossIncome - totalAnnualExpenses;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;
  const monthlyCashFlow = annualCashFlow / 12;

  return (
    <div className="step-container">
      <h2>4. Rental Income & Cash Flow</h2>

      <h4>Income</h4>
      <div className="form-group">
        <label>Estimated Monthly Rent (€)</label>
        <input type="number" value={data.monthlyRent} onChange={(e) => updateData({ monthlyRent: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>Other Monthly Income (€) (e.g., parking)</label>
        <input type="number" value={data.otherMonthlyIncome} onChange={(e) => updateData({ otherMonthlyIncome: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>Vacancy Rate (%)</label>
        <input type="number" value={data.vacancyRate} onChange={(e) => updateData({ vacancyRate: parseFloat(e.target.value) || 0 })} />
      </div>

      <h4 style={{marginTop: '2rem'}}>Expenses</h4>
      <div className="form-group">
        <label>Annual Property Tax (€) (Précompte)</label>
        <input type="number" value={data.propertyTax} onChange={(e) => updateData({ propertyTax: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>Annual Insurance (€)</label>
        <input type="number" value={data.insurance} onChange={(e) => updateData({ insurance: parseFloat(e.target.value) || 0 })} />
      </div>
       <div className="form-group">
        <label>Annual Maintenance Budget (€)</label>
        <input type="number" value={data.maintenance} onChange={(e) => updateData({ maintenance: parseFloat(e.target.value) || 0 })} />
      </div>
       <div className="form-group">
        <label>Monthly Co-ownership Fees (€)</label>
        <input type="number" value={data.coOwnershipFees} onChange={(e) => updateData({ coOwnershipFees: parseFloat(e.target.value) || 0 })} />
      </div>

      <div className="cost-display">Net Operating Income (NOI) / Year: €{netOperatingIncome.toLocaleString('fr-BE', { maximumFractionDigits: 0 })}</div>
      <div className={`cost-display ${monthlyCashFlow < 0 ? 'negative' : ''}`} style={{marginTop: '10px'}}>
        <strong>Est. Monthly Cash Flow: €{monthlyCashFlow.toLocaleString('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
      </div>

      <div className="button-group">
        <button className="back-button" onClick={onBack}>← Previous</button>
        <button className="next-button" onClick={onNext}>Next: View Summary →</button>
      </div>
    </div>
  );
}

export default Rental;