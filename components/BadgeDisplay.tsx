'use client';

interface BadgeDisplayProps {
  tier: string;
}

export default function BadgeDisplay({ tier }: BadgeDisplayProps) {
  return (
    <div className="border rounded-md p-2 text-sm text-center">
      Badge: <span className="font-semibold">{tier}</span>
    </div>
  );
}
