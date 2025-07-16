
'use client';

import ExperienceBadge from './ExperienceBadge';

export default function BadgeDisplay({ tier }: { tier: string }) {
  return <ExperienceBadge badge={tier} />;
}

