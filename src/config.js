export const COST_PER_SQM = {
  light: 250,  // €/m² for finishing touches, painting
  medium: 750, // €/m² for kitchens, bathrooms
  heavy: 1500, // €/m² for structural work, roofs
};

// Cache duration for loan rates in milliseconds (30 days)
export const LOAN_RATE_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;