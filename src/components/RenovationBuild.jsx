import React, { useState } from 'react';

const COST_PER_SQM = { light: 250, medium: 750, heavy: 1500 };
const itemTypes = ["Room", "Kitchen", "Bathroom", "Hall", "Roof", "Entire House", "Flat", "Studio", "Duplex", "Triplex", "Other"];

function RenovationBuild({ data, updateData, onNext, onBack }) {
  const [itemType, setItemType] = useState(itemTypes[0]);
  const [customName, setCustomName] = useState('');
  const [surface, setSurface] = useState('');
  const [intensity, setIntensity] = useState('medium');

  const handleAddItem = () => {
    const finalName = itemType === 'Other' ? customName : itemType;
    if (!finalName || !surface || parseFloat(surface) <= 0) {
      alert('Please provide a valid name and surface area.');
      return;
    }
    const newItem = { id: Date.now(), name: finalName, surface: parseFloat(surface), intensity };
    updateData({ renovationItems: [...data.renovationItems, newItem] });
    setItemType(itemTypes[0]);
    setCustomName('');
    setSurface('');
    setIntensity('medium');
  };

  const handleRemoveItem = (id) => {
    updateData({ renovationItems: data.renovationItems.filter(item => item.id !== id) });
  };

  const totalCost = data.renovationItems.reduce((total, item) => {
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);

  return (
    <div className="step-container">
      <h2>2. Renovation / Build</h2>
      <div className="add-item-form" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <select value={itemType} onChange={(e) => setItemType(e.target.value)} style={{ flex: '2 1 150px' }}>
          {itemTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        {itemType === 'Other' && (
          <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Specify item name" style={{ flex: '2 1 150px' }} />
        )}
        <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="Surface (m²)" style={{ flex: '1 1 80px' }} />
        <select value={intensity} onChange={(e) => setIntensity(e.target.value)} style={{ flex: '2 1 120px' }}>
          <option value="light">Basic (250 €/m²)</option>
          <option value="medium">Upgrade (750 €/m²)</option>
          <option value="heavy">Renovation (1500 €/m²)</option>
        </select>
        <button type="button" onClick={handleAddItem} style={{ flex: '1 1 50px' }}>Add</button>
      </div>

      <div className="items-list">
        {data.renovationItems.length === 0 ? <p>No renovation items added yet.</p> : 
          data.renovationItems.map(item => {
            const itemCost = item.surface * COST_PER_SQM[item.intensity];
            return (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.5rem', borderBottom: '1px solid #eee' }}>
                <div><strong>{item.name}</strong><br /><small>{item.surface} m² @ {item.intensity}</small></div>
                <span>€{itemCost.toLocaleString('fr-BE')}</span>
                <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </div>
            );
          })
        }
      </div>

      {totalCost > 0 && <div className="cost-display">Total Estimated Renovation Cost: €{totalCost.toLocaleString('fr-BE')}</div>}
      
      <div className="button-group">
        <button className="back-button" onClick={onBack}>← Previous</button>
        <button className="next-button" onClick={onNext}>Next: Financing →</button>
      </div>
    </div>
  );
}

export default RenovationBuild;