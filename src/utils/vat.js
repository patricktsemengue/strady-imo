const vatRules = [
  // Rule for 6% VAT
  {
    name: 'Reduced Rate for Renovation',
    applies: (data) => 
      data.propertyAge >= 10 &&
      data.isPrivateDwelling,
    execute: () => 6, // Returns the 6% rate
  },
  // Default fallback rule for 21% VAT
  {
    name: 'Standard Rate',
    applies: () => true, 
    execute: () => 21, // Returns the 21% rate
  }
];

export const calculateVatInfo = (data) => {
  const applicableRule = vatRules.find(rule => rule.applies(data));
  const rate = applicableRule.execute();
  return {
    rate: rate,
    ruleName: applicableRule.name
  };
};