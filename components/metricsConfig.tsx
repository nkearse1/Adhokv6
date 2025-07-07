import React from 'react';
import type { ReactNode, FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Briefcase, DollarSign, Users, Flag, Shield, ThumbsDown } from 'lucide-react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export const metricsConfig = [
  {
    key: 'totalProjects',
    label: 'Total Projects',
    icon: <Briefcase className="h-6 w-6 text-blue-600" />,
  },
  {
    key: 'estRevenue',
    label: 'Platform Revenue',
    icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
  },
  {
    key: 'activeTalents',
    label: 'Active Talents',
    icon: <Users className="h-6 w-6 text-green-600" />,
  },
  {
    key: 'revPerTalent',
    label: 'Revenue per Talent',
    icon: <DollarSign className="h-6 w-6 text-purple-600" />,
  },
  {
    key: 'flaggedProjects',
    label: 'Flagged Projects',
    icon: <Flag className="h-6 w-6 text-red-600" />,
  },
  {
    key: 'negReviews',
    label: 'Negative Reviews',
    icon: <ThumbsDown className="h-6 w-6 text-pink-600" />,
  },
  {
    key: 'lowTrustTalents',
    label: 'Low Trust Talents',
    icon: <Shield className="h-6 w-6 text-indigo-600" />,
  }
];

const MetricCard: FC<MetricCardProps> = ({
  icon,
  label,
  value,
  change,
  onClick,
  selected = false,
  compact = false
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'min-w-[180px] cursor-pointer transition-all duration-200',
        selected && 'ring-2 ring-teal-500'
      )}
    >
      <CardContent className={cn('flex items-start gap-3 p-4', compact ? 'flex-col' : 'flex-row')}>
        {icon}
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {change && <p className="text-xs text-green-600">{change}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
