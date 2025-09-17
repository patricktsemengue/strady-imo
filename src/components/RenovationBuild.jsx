import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COST_PER_SQM } from '../config';

// This is now a list of translation keys, not display text
const itemTypeKeys = ["room", "kitchen", "bathroom", "hall", "roof", "entire_house", "flat", "studio", "duplex", "triplex", "other"];
const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function RenovationBuild({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const [itemType, setItemType] = useState(t('reno_items.room')); // Default to the translated 'Room'
  const [customName, setCustomName] = useState('');
  const [surface, setSurface] = useState('');
  const [intensity, setIntensity] = useState('medium');

  const handleAddItem = () => {
    // We now check against the translated version of "Other"
    const finalName = itemType === t('reno_items.other') ? customName : itemType;
    if (!finalName || !surface || parseFloat(surface) <= 0) {
      alert('Please provide a valid name and surface area.');
      return;
    }
    const newItem = { id: Date.now(), name: finalName, surface: parseFloat(surface), intensity };
    updateData({ renovationItems: [...data.renovationItems, newItem] });
    setItemType(t('reno_items.room'));
    setCustomName('');
    setSurface('');
    setIntensity('medium');
  };

  const handleRemoveItem = (id) => {
    updateData({ renovationItems: data.renovationItems.filter(item => item.id !== id) });
  };

  const totalCost = data.renovationItems.reduce((total, item) => total + (item.surface * COST_PER_SQM[item.intensity]), 0);

  return (
    <div className="step-container">
      <h2>{t('step2_title')}</h2>
      <div className="add-item-form" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <select value={itemType} onChange={(e) => setItemType(e.target.value)} style={{ flex: '2 1 150px' }}>
          {/* Map over the keys and use t() to get the translated display text */}
          {itemTypeKeys.map(key => {
            const translatedLabel = t(`reno_items.${key}`);
            return <option key={key} value={translatedLabel}>{translatedLabel}</option>
          })}
        </select>
        {itemType === t('reno_items.other') && (
          <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t('add_item_placeholder')} style={{ flex: '2 1 150px' }} />
        )}
        <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder={t('surface_placeholder')} style={{ flex: '1 1 80px' }} />
        <select value={intensity} onChange={(e) => setIntensity(e.target.value)} style={{ flex: '2 1 120px' }}>
          <option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option>
        </select>
        <button type="button" onClick={handleAddItem} style={{ flex: '1 1 50px' }}>{t('add_button')}</button>
      </div>
      <div className="items-list">
        {data.renovationItems.length === 0 ? <p>{t('no_items_added')}</p> : data.renovationItems.map(item => {
          const itemCost = item.surface * COST_PER_SQM[item.intensity];
          return (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.5rem', borderBottom: '1px solid #eee' }}>
              <div><strong>{item.name}</strong><br /><small>{item.surface} m² @ {item.intensity}</small></div>
              <span>{formatCurrency(itemCost)}</span>
              <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </div>
          );
        })}
      </div>
      {totalCost > 0 && <div className="cost-display">{t('total_renovation_cost')} {formatCurrency(totalCost)}</div>}
      <div className="button-group">
        <button className="back-button" onClick={onBack}>{t('previous')}</button>
        <button className="next-button" onClick={onNext}>{t('next_financing')}</button>
      </div>
    </div>
  );
}

export default RenovationBuild;