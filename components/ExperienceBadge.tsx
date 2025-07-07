import React from 'react';
import { Star, Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface Props {
  badge: string;
  showTooltip?: boolean;
  className?: string;
}

export default function ExperienceBadge({ badge, showTooltip, className }: Props): JSX.Element {
  // Map database badge values to internal configuration
  const mapBadgeToLevel = (badge: string): 'entry' | 'mid' | 'expert' | 'elite' => {
    switch (badge?.toLowerCase()) {
      case 'specialist':
        return 'entry';
      case 'pro talent':
        return 'mid';
      case 'expert talent':
        return 'expert';
      case 'elite expert':
        return 'elite';
      // Handle the original internal values as well
      case 'entry':
        return 'entry';
      case 'mid':
        return 'mid';
      case 'expert':
        return 'expert';
      case 'elite':
        return 'elite';
      default:
        return 'entry'; // Default fallback
    }
  };

  const config = {
    entry: {
      icon: Star,
      label: 'Specialist',
      baseClasses: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    mid: {
      icon: Medal,
      label: 'Pro Talent',
      baseClasses: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
    expert: {
      icon: Trophy,
      label: 'Expert Talent',
      baseClasses: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
    elite: {
      icon: Award,
      label: 'Elite Expert',
      baseClasses: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    },
  };

  const mappedLevel = mapBadgeToLevel(badge);
  const { icon: Icon, label, baseClasses } = config[mappedLevel];

  const badgeElement = (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        baseClasses,
        className
      )}
      aria-label={`Experience level: ${label}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeElement;
}
