import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateRenovationCost } from '../utils/calculations';

const itemTypeKeys = ["room", "kitchen", "bathroom", "hall", "roof", "entire_house", "flat", "studio", "duplex", "triplex", "other"];
const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });

function RenovationBuild({ data, updateData, onNext, onBack }) {
  const { t } = useTranslation();
  const [itemType, setItemType] = useState(t('reno_items.room'));
  const [customName, setCustomName] = useState('');
  const [surface, setSurface] = useState('');
  const [intensity, setIntensity] = useState('medium');

  const handleAddItem = () => {
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

  const renovation = calculateRenovationCost(data.renovationItems, data);

  return (
    <div className="step-container">
      <h2>{t('step2_title')}</h2>
      <div className="form-group" style={{display: 'flex', gap: '20px'}}>
        <div>
          <label>{t('property_age')}</label>
          <input type="number" value={data.propertyAge} onChange={(e) => updateData({ propertyAge: parseInt(e.target.value, 10) || 0 })} />
        </div>
        <div>
          <label>&nbsp;</label>
          <label style={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <input type="checkbox" checked={data.isPrivateDwelling} onChange={(e) => updateData({ isPrivateDwelling: e.target.checked })} style={{ marginRight: '10px' }}/>
            {t('private_dwelling')}
          </label>
        </div>
      </div>
      <div className="add-item-form" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <select value={itemType} onChange={(e) => setItemType(e.target.value)} style={{ flex: '2 1 150px' }}>
          {itemTypeKeys.map(key => {
            const translatedLabel = t(`reno_items.${key}`);
            return <option key={key} value={translatedLabel}>{translatedLabel}</option>
          })}
        </select>
        {itemType === t('reno_items.other') && <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t('add_item_placeholder')} style={{ flex: '2 1 150px' }} />}
        <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder={t('surface_placeholder')} style={{ flex: '1 1 80px' }} />
        <select value={intensity} onChange={(e) => setIntensity(e.target.value)} style={{ flex: '2 1 120px' }}>
          <option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option>
        </select>
        <button type="button" onClick={handleAddItem} style={{ flex: '1 1 50px' }}>{t('add_button')}</button>
      </div>
      <div className="items-list">
        {data.renovationItems.length === 0 ? <p>{t('no_items_added')}</p> : data.renovationItems.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.5rem', borderBottom: '1px solid #eee' }}>
            <div><strong>{item.name}</strong><br /><small>{item.surface} m² @ {item.intensity}</small></div>
            <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
          </div>
        ))}
      </div>
      {renovation.total > 0 && (
        <div className="cost-display">
          <p style={{margin: 0, fontSize: '1rem', fontWeight: 'normal'}}>{t('renovation_subtotal')} {formatCurrency(renovation.subtotal)}</p>
          <p style={{margin: 0, fontSize: '1rem', fontWeight: 'normal'}}>{t('applicable_vat')} {renovation.vatRate}% (+{formatCurrency(renovation.vatAmount)})</p>
          <hr style={{borderColor: 'var(--border-color)', margin: '0.5rem 0'}}/>
          <strong>{t('total_renovation_cost_vat')} {formatCurrency(renovation.total)}</strong>
        </div>
      )}
      <div className="button-group">
        <button className="back-button" onClick={onBack}>{t('previous')}</button>
        <button className="next-button" onClick={onNext}>{t('next_financing')}</button>
      </div>
    </div>
  );
}

export default RenovationBuild;