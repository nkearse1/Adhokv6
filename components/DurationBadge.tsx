'use client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DurationBadgeProps {
  estimatedHours?: number | null;
  className?: string;
}

export default function DurationBadge({ estimatedHours, className }: DurationBadgeProps) {
  if (estimatedHours === null || estimatedHours === undefined || isNaN(estimatedHours)) {
    return null;
  }

  let label = 'Adhok';
  let color = 'bg-blue-200 text-blue-800';

  if (estimatedHours >= 60) {
    label = 'Long-Term';
    color = 'bg-red-200 text-red-800';
  } else if (estimatedHours >= 30) {
    label = 'Mid-Term';
    color = 'bg-yellow-200 text-yellow-800';
  } else if (estimatedHours >= 10) {
    label = 'Short-Term';
    color = 'bg-green-200 text-green-800';
  }

  return (
    <Badge variant="secondary" className={cn('px-2 py-1 text-xs', color, className)}>
      {label}
    </Badge>
  );
}
