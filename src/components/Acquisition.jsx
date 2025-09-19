import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateRegistrationTax } from '../utils/calculations';

const formatCurrency = (value) => (value || 0).toLocaleString('fr-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Acquisition({ data, updateData, onNext }) {
  const { t } = useTranslation();

  // Live calculations for the summary card on the right
  const registrationTax = calculateRegistrationTax(data.propertyPrice, data.region, data.isPrimaryResidence);
  const notaryFees = data.propertyPrice ? data.propertyPrice * 0.015 + 1200 : 0;
  const totalEstimatedCost = (data.propertyPrice || 0) + registrationTax + notaryFees;
  
  const activeBtnClasses = 'bg-accent-primary text-white shadow-md';
  const inactiveBtnClasses = 'bg-bg-secondary text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div>
          <div className="mb-6">
            <label className="block font-medium mb-2 text-text-secondary">{t('property_type_label')}</label>
            <div className="flex space-x-4">
              <button 
                onClick={() => updateData({ propertyType: 'property' })}
                className={`w-full py-3 rounded-lg border border-border-color transition-all ${data.propertyType === 'property' ? activeBtnClasses : inactiveBtnClasses}`}
              >
                {t('property_type_existing')}
              </button>
              <button 
                onClick={() => updateData({ propertyType: 'land' })}
                className={`w-full py-3 rounded-lg border border-border-color transition-all ${data.propertyType === 'land' ? activeBtnClasses : inactiveBtnClasses}`}
              >
                {t('property_type_land')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="purchase-price" className="block font-medium mb-2 text-text-secondary">{t('property_price_label')}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">€</span>
              <input 
                type="number" 
                id="purchase-price" 
                className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg pl-8 pr-4 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" 
                placeholder="300000"
                value={data.propertyPrice}
                onChange={(e) => updateData({ propertyPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="surface-area" className="block font-medium mb-2 text-text-secondary">{t('surface_area_label', 'Surface Area')}</label>
            <div className="relative">
              <input 
                type="number" 
                id="surface-area" 
                className="w-full bg-bg-primary border border-border-color text-text-primary rounded-lg pl-4 pr-10 py-3 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-opacity-50" 
                placeholder="150"
                value={data.surfaceArea}
                onChange={(e) => updateData({ surfaceArea: parseFloat(e.target.value) || 0 })}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">m²</span>
            </div>
          </div>
        </div>

        {/* Right Column: Summary/Info */}
        <div className="bg-bg-primary border border-border-color rounded-lg p-6 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">{t('cost_estimate_title', 'Acquisition Cost Estimate')}</h3>
            <p className="text-text-secondary mb-4 text-sm">{t('cost_estimate_desc', 'Based on your inputs, here\'s a preliminary estimate.')}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('notary_fees')}</span>
                <span className="font-medium text-text-primary">{formatCurrency(notaryFees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('reg_tax')}</span>
                <span className="font-medium text-text-primary">{formatCurrency(registrationTax)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-color">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-text-primary">{t('total_est_cost')}</span>
              <span className="text-2xl font-bold text-accent-primary">{formatCurrency(totalEstimatedCost)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-10 text-right">
        <button 
          onClick={onNext}
          className="bg-accent-primary text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity"
        >
          {t('next_renovation')}
        </button>
      </div>
    </div>
  );
}

export default Acquisition;