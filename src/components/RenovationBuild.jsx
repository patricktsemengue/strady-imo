import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateRenovationCost } from '../utils/calculations';

const itemTypeKeys = ["room", "kitchen", "bathroom", "hall", "roof", "entire_house", "flat", "studio", "duplex", "triplex", "other"];
const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2 text-text-secondary">{t('property_age')}</label>
              <input type="number" className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" value={data.propertyAge} onChange={(e) => updateData({ propertyAge: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center space-x-2 text-text-secondary">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary" checked={data.isPrivateDwelling} onChange={(e) => updateData({ isPrivateDwelling: e.target.checked })} />
                <span>{t('private_dwelling')}</span>
              </label>
            </div>
          </div>
          
          <div className="p-4 border border-border-color rounded-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50">
                {itemTypeKeys.map(key => <option key={key} value={t(`reno_items.${key}`)}>{t(`reno_items.${key}`)}</option>)}
              </select>
              {itemType === t('reno_items.other') && <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t('add_item_placeholder')} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" />}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="number" value={surface} onChange={(e) => setSurface(e.target.value)} placeholder={t('surface_placeholder')} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" />
              <select value={intensity} onChange={(e) => setIntensity(e.target.value)} className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg px-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50">
                <option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option>
              </select>
            </div>
            <button onClick={handleAddItem} className="w-full bg-accent-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">{t('add_button')}</button>
          </div>
          
          <div className="space-y-2">
            {data.renovationItems.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-bg-primary p-3 rounded-lg border border-border-color">
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <p className="text-text-secondary">{item.surface} m² @ {item.intensity}</p>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 font-bold">X</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Summary/Info */}
        <div className="bg-bg-primary border border-border-color rounded-lg p-6 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">{t('renovation_summary_title')}</h3>
            <p className="text-text-secondary mb-4 text-sm">{t('renovation_summary_desc')}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('renovation_subtotal')}</span>
                <span className="font-medium text-text-primary">{formatCurrency(renovation.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('applicable_vat')}</span>
                <span className="font-medium text-text-primary">{renovation.vatRate}% ({formatCurrency(renovation.vatAmount)})</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-color">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-text-primary">{t('total_renovation_cost_vat')}</span>
              <span className="text-2xl font-bold text-accent-primary">{formatCurrency(renovation.total)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-10 flex justify-between">
        <button onClick={onBack} className="bg-bg-secondary text-text-primary border border-border-color font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t('previous')}</button>
        <button onClick={onNext} className="bg-accent-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity">{t('next_financing')}</button>
      </div>
    </div>
  );
}

export default RenovationBuild;