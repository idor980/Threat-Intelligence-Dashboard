/**
 * Utility functions for calculating risk levels based on abuse scores
 */

export type RiskLevel = {
  text: string;
  color: string;
  bgColor: string;
};

/**
 * Determines the risk level based on an abuse score
 * @param abuseScore - The abuse confidence score (0-100)
 * @returns Risk level with associated colors
 */
export const getRiskLevel = (abuseScore: number): RiskLevel => {
  if (abuseScore >= 75) {
    return { text: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-50' };
  }
  if (abuseScore >= 50) {
    return { text: 'Medium Risk', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  }
  if (abuseScore >= 25) {
    return { text: 'Low Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  }
  return { text: 'Minimal Risk', color: 'text-green-600', bgColor: 'bg-green-50' };
};
