'use client';
import RevenuePanel from '@/components/RevenuePanel';
import { CompletedProjectsList } from '@/components/CompletedProjectsList';
import ActiveBidsPanel from '@/components/ActiveBidsPanel';
import BadgeDisplay from '@/components/BadgeDisplay';
import { useAuth } from '@/lib/useAuth';

export default function TalentDashboard() {
  const { userId } = useAuth();
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Talent Dashboard</h1>
        <BadgeDisplay tier="Expert Talent" />
      </div>
      <RevenuePanel />
      {userId && (
        <>
          <h2 className="text-xl font-semibold">Active Bids</h2>
          <ActiveBidsPanel userId={userId} />
          <h2 className="text-xl font-semibold">Completed Projects</h2>
          <CompletedProjectsList userId={userId} />
        </>
      )}
    </div>
  );
}
