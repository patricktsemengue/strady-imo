import React from 'react';
import { useTranslation } from 'react-i18next';

function Acquisition({ data, updateData, onNext }) {
  const { t } = useTranslation();

  return (
    <div className="step-container">
      <h2>{t('step1_title')}</h2>
      <div className="form-group">
        <label htmlFor="propertyPrice">{t('property_price_label')}</label>
        <input type="number" id="propertyPrice" value={data.propertyPrice} onChange={(e) => updateData({ propertyPrice: parseFloat(e.target.value) || 0 })} placeholder="e.g., 250000" />
      </div>
      <div className="form-group">
        <label>{t('property_type_label')}</label>
        <div>
          <input type="radio" id="existing" name="propertyType" value="existing" checked={data.propertyType === 'existing'} onChange={(e) => updateData({ propertyType: e.target.value })} />
          <label htmlFor="existing">{t('property_type_existing')}</label>
        </div>
        <div>
          <input type="radio" id="land" name="propertyType" value="land" checked={data.propertyType === 'land'} onChange={(e) => updateData({ propertyType: e.target.value })} />
          <label htmlFor="land">{t('property_type_land')}</label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="region">{t('region_label')}</label>
        <select id="region" value={data.region} onChange={(e) => updateData({ region: e.target.value })}>
          <option value="wallonia">{t('region_wallonia')}</option>
          <option value="flanders">{t('region_flanders')}</option>
          <option value="brussels">{t('region_brussels')}</option>
        </select>
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" checked={data.isPrimaryResidence} onChange={(e) => updateData({ isPrimaryResidence: e.target.checked })} style={{ marginRight: '10px' }} />
          {t('is_primary_residence_label')}
        </label>
      </div>
      <button className="next-button" onClick={onNext}>{t('next_renovation')}</button>
    </div>
  );
}

export default Acquisition;