import React from 'react';
import { Clock, UserPlus, FileText, Hand } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface QualificationEntry {
  reason: 'invited' | 'resume_match' | 'manual';
  timestamp: string;
}

interface QualificationHistoryTimelineProps {
  history: QualificationEntry[];
  className?: string;
}

export default function QualificationHistoryTimeline({ history, className = '' }: QualificationHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}> 
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No qualification history</p>
      </div>
    );
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getIcon = (reason: QualificationEntry['reason']) => {
    switch (reason) {
      case 'invited':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'resume_match':
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return <Hand className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLabel = (reason: QualificationEntry['reason']) => {
    switch (reason) {
      case 'invited':
        return 'Invited';
      case 'resume_match':
        return 'Resume Match';
      default:
        return 'Manual Review';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}> 
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualification History</h3>
      <div className="relative"> 
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        {sorted.map((entry, idx) => (
          <div key={idx} className="relative flex items-start space-x-4 pb-6">
            <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-gray-50 border-gray-200">
              {getIcon(entry.reason)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">{getLabel(entry.reason)}</h4>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {entry.reason}
                  </Badge>
                </div>
                <time className="text-xs text-gray-500">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}