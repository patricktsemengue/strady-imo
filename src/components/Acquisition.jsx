import React from 'react';

function Acquisition({ data, updateData, onNext }) {
  return (
    <div className="step-container">
      <h2>1. Acquisition Details</h2>
      
      <div className="form-group">
        <label htmlFor="propertyPrice">Property Price (€)</label>
        <input
          type="number"
          id="propertyPrice"
          value={data.propertyPrice}
          onChange={(e) => updateData({ propertyPrice: parseFloat(e.target.value) || 0 })}
          placeholder="e.g., 250000"
        />
      </div>
      
      <div className="form-group">
        <label>Property Type</label>
        <div>
          <input
            type="radio"
            id="existing"
            name="propertyType"
            value="existing"
            checked={data.propertyType === 'existing'}
            onChange={(e) => updateData({ propertyType: e.target.value })}
          />
          <label htmlFor="existing">Existing Property</label>
        </div>
        <div>
          <input
            type="radio"
            id="land"
            name="propertyType"
            value="land"
            checked={data.propertyType === 'land'}
            onChange={(e) => updateData({ propertyType: e.target.value })}
          />
          <label htmlFor="land">Building Land</label>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="region">Region</label>
        <select id="region" value={data.region} onChange={(e) => updateData({ region: e.target.value })}>
          <option value="wallonia">Wallonia</option>
          <option value="flanders">Flanders</option>
          <option value="brussels">Brussels-Capital</option>
        </select>
      </div>
      
      <button className="next-button" onClick={onNext}>
        Next: Renovation & Build →
      </button>
    </div>
  );
}

export default Acquisition;