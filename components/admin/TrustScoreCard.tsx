import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrustScoreFactors {
  completedProjects: number;
  adminComplaints: number;
  missedDeadlines: number;
  positiveRatings: number;
  responseTime: number;
  clientRetention: number;
}

interface TrustScoreCardProps {
  score?: number;
  factors?: Partial<TrustScoreFactors>;
  lastUpdated?: string | null;
}

export default function TrustScoreCard({
  score = 50,
  factors = {},
  lastUpdated = null,
}: TrustScoreCardProps) {
  const tierBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Trust Score</p>
            <h2 className="text-3xl font-bold">{score}/100</h2>
          </div>
          {tierBadge(score)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Completed Projects</span>
            <span>{factors.completedProjects ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Admin Complaints</span>
            <span>{factors.adminComplaints ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Missed Deadlines</span>
            <span>{factors.missedDeadlines ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Positive Ratings</span>
            <span>{factors.positiveRatings ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Response Time</span>
            <span>{factors.responseTime ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Client Retention</span>
            <span>{factors.clientRetention ?? 0}</span>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-4">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
