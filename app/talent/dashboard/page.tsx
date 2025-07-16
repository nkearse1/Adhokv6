'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import RevenuePanel from '@/components/RevenuePanel';
import { CompletedProjectsList } from '@/components/CompletedProjectsList';
import ActiveBidsPanel from '@/components/ActiveBidsPanel';
import BadgeDisplay from '@/components/BadgeDisplay';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function TalentDashboard() {
  const { authUser } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // mock projects
    setProjects([
      { id: '1', title: 'SEO Audit', status: 'open' },
      { id: '2', title: 'Social Media Strategy', status: 'completed' }
    ]);
  }, []);

  const username = authUser?.user_metadata?.username || authUser?.id || 'me';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Talent Dashboard</h1>
        <Button onClick={() => router.push(`/talent/${username}/projects`)}>Browse Projects</Button>
      </div>
      <BadgeDisplay tier="Expert Talent" />
      <ActiveBidsPanel bids={projects.filter(p => p.status !== 'completed')} />
      <RevenuePanel />
      <CompletedProjectsList userId={username} />
    </div>
  );
}
