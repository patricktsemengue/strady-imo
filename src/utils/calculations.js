import { COST_PER_SQM } from '../config';
import { calculateVatInfo } from './vat';

// Central function for Registration Tax
export const calculateRegistrationTax = (price, region, isPrimary) => {
  if (!price || price <= 0) return 0;

  switch (region) {
    case 'brussels': {
      const abattement = 200000;
      if (isPrimary && price <= 600000) {
        const taxableAmount = price > abattement ? price - abattement : 0;
        return taxableAmount * 0.125;
      }
      return price * 0.125;
    }
    case 'flanders': {
      return isPrimary ? price * 0.03 : price * 0.12;
    }
    case 'wallonia': {
      const abattement = 20000;
      const taxableAmount = price > abattement ? price - abattement : 0;
      return taxableAmount * 0.125;
    }
    default:
      return price * 0.125;
  }
};

// Central function for all Renovation Cost calculations
export const calculateRenovationCost = (renovationItems, propertyData) => {
  if (!renovationItems || renovationItems.length === 0) {
    return { subtotal: 0, vatRate: 0, vatAmount: 0, total: 0 };
  }

  const subtotal = renovationItems.reduce((total, item) => {
    return total + (item.surface * COST_PER_SQM[item.intensity]);
  }, 0);

  const { rate: vatRate } = calculateVatInfo(propertyData);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  return { subtotal, vatRate, vatAmount, total };
};