export const expertiseRates: Record<string, number> = {
  Specialist: 50,
  'Pro Talent': 100,
  'Expert Talent': 150,
};

const estimatedHoursMap: Record<string, number> = {
  'Technical SEO Audit': 8,
  'Full SEO Strategy Plan': 16,
  'On-page Optimization for Blog': 6,
  'Google Ads Audit': 10,
};

export function calculateEstimatedHours({
  budget,
  expertiseLevel,
  title,
}: {
  budget?: number;
  expertiseLevel?: string;
  title?: string;
}): number | null {
  const rate = expertiseRates[expertiseLevel ?? ''];
  if (!rate || typeof budget !== 'number' || isNaN(budget)) return null;

  if (title) {
    const matchKey = Object.keys(estimatedHoursMap).find((key) =>
      title.toLowerCase().includes(key.toLowerCase().split(' ')[0])
    );
    if (matchKey) return estimatedHoursMap[matchKey];
  }

  return Math.floor(budget / rate);
}
