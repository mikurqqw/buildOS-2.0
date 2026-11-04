export const tenderAnalysis = {
  score: 78, margin: 14,
  risks: ['Short 11-month completion clause conflicts with the 18-month plan', 'High reliance on imported rebar', 'Strict failure penalties: legal review required'],
};
export const procurementRisk = {
  severity: 'CRITICAL' as const, title: 'Façade procurement gap',
  reason: 'Façade materials have not been requested for Block A.',
  impact: '7-day schedule slip predicted (demo estimate).',
  suggestion: 'Generate a purchase request for façade materials.',
};
