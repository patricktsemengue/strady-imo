import React from 'react';

function Financing({ data, updateData, onNext, onBack }) {
  // --- Calculations ---
  const registrationTaxRate = data.region === 'flanders' ? 0.03 : 0.125;
  const registrationTax = data.propertyPrice * registrationTaxRate;
  const notaryFees = data.propertyPrice * 0.015 + 1200;
  const renovationCost = data.renovationItems.reduce((total, item) => {
    const COST_PER_SQM = { light: 250, medium: 750, heavy: 1500 };
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);

  const totalProjectCost = data.propertyPrice + registrationTax + notaryFees + renovationCost;
  const loanAmount = totalProjectCost - data.personalContribution;

  const P = loanAmount > 0 ? loanAmount : 0;
  const r = (data.interestRate / 100) / 12;
  const n = data.loanDuration * 12;
  const monthlyPayment = P > 0 && r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

  return (
    <div className="step-container">
      <h2>3. Financing</h2>
      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h4>Project Cost Breakdown</h4>
        <p>Property Price: €{data.propertyPrice.toLocaleString('fr-BE')}</p>
        <p>Est. Registration Tax: €{registrationTax.toLocaleString('fr-BE')}</p>
        <p>Est. Notary Fees: €{notaryFees.toLocaleString('fr-BE')}</p>
        <p>Renovation Cost: €{renovationCost.toLocaleString('fr-BE')}</p>
        <hr/>
        <strong>Total Estimated Cost: €{totalProjectCost.toLocaleString('fr-BE')}</strong>
      </div>
      
      <div className="form-group">
        <label>Personal Contribution (€)</label>
        <input type="number" value={data.personalContribution} onChange={(e) => updateData({ personalContribution: parseFloat(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>Loan Duration (Years)</label>
        <input type="number" value={data.loanDuration} onChange={(e) => updateData({ loanDuration: parseInt(e.target.value) || 0 })} />
      </div>
      <div className="form-group">
        <label>Interest Rate (%)</label>
        <input type="number" step="0.01" value={data.interestRate} onChange={(e) => updateData({ interestRate: parseFloat(e.target.value) || 0 })} />
      </div>

      <div className="cost-display">Amount to Borrow: €{loanAmount > 0 ? loanAmount.toLocaleString('fr-BE') : 0}</div>
      <div className="cost-display" style={{marginTop: '10px'}}>Est. Monthly Payment: €{monthlyPayment > 0 ? monthlyPayment.toFixed(2) : '0.00'}</div>

      <div className="button-group">
        <button className="back-button" onClick={onBack}>← Previous</button>
        <button className="next-button" onClick={onNext}>Next: Rental Income →</button>
      </div>
    </div>
  );
}

export default Financing;