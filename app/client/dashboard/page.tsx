'use client';
import ClientProjectsList from '@/components/ClientProjectsList';
import InviteTalentBanner from '@/components/InviteTalentBanner';
import BudgetTracker from '@/components/BudgetTracker';
import { useUser } from '@clerk/nextjs';

export default function ClientDashboard() {
  const { user } = useUser();
  const userId = user?.id || '';

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <InviteTalentBanner />
      {userId && <ClientProjectsList userId={userId} />}
      {userId && <BudgetTracker userId={userId} />}
    </div>
  );
}
