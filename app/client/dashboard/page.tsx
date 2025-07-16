'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ClientProjectsList from '@/components/ClientProjectsList';
import InviteTalentBanner from '@/components/InviteTalentBanner';
import BudgetTracker from '@/components/BudgetTracker';

interface Project {
  id: string;
  title: string;
}

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProjects();
    }
  }, [isLoaded, isSignedIn]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const mock = [
        { id: '1', title: 'SEO Optimization Campaign' },
        { id: '2', title: 'Social Media Strategy' }
      ];
      setProjects(mock);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return <p className="p-6 text-center">Please sign in to view your dashboard.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Button onClick={() => router.push('/upload')}>Post New Project</Button>
      </div>
      <InviteTalentBanner />
      <BudgetTracker used={0} budget={0} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ClientProjectsList projects={projects} />
      )}
    </div>
  );
}
