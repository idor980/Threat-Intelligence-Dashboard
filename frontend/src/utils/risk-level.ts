/**
 * Utility functions for calculating risk levels based on abuse scores
 */

export type RiskLevel = {
  text: string;
  color: string;
  bgColor: string;
  score: number; // The calculated max score used for risk determination
};

/**
 * Determines the risk level based on abuse and threat scores
 * @param abuseScore - The abuse confidence score (0-100)
 * @param threatScore - The fraud/threat score (0-100), optional
 * @returns Risk level with associated colors and the calculated score
 */
export const getRiskLevel = (abuseScore: number, threatScore?: number): RiskLevel => {
  // Use the maximum score between abuseScore and threatScore (if available)
  const maxScore = threatScore !== undefined ? Math.max(abuseScore, threatScore) : abuseScore;

  if (maxScore >= 75) {
    return { text: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-50', score: maxScore };
  }
  if (maxScore >= 50) {
    return {
      text: 'Medium Risk',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      score: maxScore,
    };
  }
  if (maxScore >= 25) {
    return { text: 'Low Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-50', score: maxScore };
  }
  return { text: 'Minimal Risk', color: 'text-green-600', bgColor: 'bg-green-50', score: maxScore };
};
