'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';
import { useRouter } from 'next/navigation';

import ClientProjectsList from '@/components/ClientProjectsList';
import InviteTalentBanner from '@/components/InviteTalentBanner';
import BudgetTracker from '@/components/BudgetTracker';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string;
  projectBudget: number;
  bids?: number;
}


export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    userId,
    userRole,
    username,
    authUser,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && userId) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/clients/${userId}/projects`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Request failed');
      }
      setProjects(json.projects || []);

    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 text-center">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">Client Dashboard</h1>
        <Button 
          onClick={() => router.push('/upload')} 
          className="w-full sm:w-auto bg-[#00D1C1] text-white hover:bg-[#00b4ab]"
        >
          <Plus className="mr-2 w-4 h-4" /> Post New Project
        </Button>
      </div>

      <InviteTalentBanner />
      <BudgetTracker projects={projects} />
      <div className="grid gap-4">
        <ClientProjectsList projects={projects} />
      </div>
    </div>
  );
}
