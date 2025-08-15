'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';
import { useRouter } from 'next/navigation';

import InviteTalentBanner from '@/components/InviteTalentBanner';
import BudgetTracker from '@/components/BudgetTracker';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Briefcase, CheckCircle, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string;
  projectBudget: number;
  bids?: number;
  metadata?: any;
}


export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    userId,
    userRole,
    authUser,
    loading: authLoading,
    isAuthenticated,
    isClient,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && isClient && userId) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, isClient, userId]);

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

  if (authLoading || !authUser) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

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

  const accountHasAcceptBid = Boolean(authUser?.tier);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
  const getProjectUrl = (project: Project) => {
    const workspacePhases = ['picked_up', 'submitted', 'revisions', 'approved', 'completed'];
    return workspacePhases.includes(project.status)
      ? `/client/projects/${project.id}/workspace`
      : `/client/projects/details/${project.id}`;
  };
  const getButtonText = (status: string) => {
    const workspacePhases = ['picked_up', 'submitted', 'revisions', 'approved', 'completed'];
    return workspacePhases.includes(status) ? 'View Workspace' : 'View Details';
  };
  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      draft: 'Draft',
      open: 'Open',
      picked_up: 'Picked Up',
      submitted: 'Submitted',
      revisions: 'Revisions',
      approved: 'Approved',
      completed: 'Completed',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };
  const getStatusIcon = (status: string) => {
    const isActive = ['open', 'picked_up', 'submitted', 'revisions'].includes(status);
    const isComplete = ['approved', 'completed'].includes(status);
    if (isComplete) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (isActive) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    } else {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900">Client Dashboard</h1>
        <Button
          onClick={() => {
            if (isAuthenticated && userRole === 'client') {
              router.push('/client/upload');
            } else {
              router.push('/');
            }
          }}
          className="w-full sm:w-auto bg-[#00D1C1] text-white hover:bg-[#00b4ab]"
        >
          <Plus className="mr-2 w-4 h-4" /> Post New Project
        </Button>
      </div>

      {!accountHasAcceptBid && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <p>Upgrade your account to enable Accept Bid and hire instantly.</p>
          <Button
            onClick={() => router.push('/upgrade')}
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
          >
            Upgrade account
          </Button>
        </div>
      )}

      <InviteTalentBanner />
      <BudgetTracker projects={projects} />
      <div className="grid gap-4">
        {projects.map((proj) => {
          const acceptBid = accountHasAcceptBid || proj.metadata?.acceptBidEnabled;
          return (
            <div key={proj.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate flex items-center gap-2">
                    {proj.title}
                    {acceptBid && (
                      <Badge variant="success">Accept Bid Enabled</Badge>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">Deadline: {formatDate(proj.deadline)}</p>
                  <p className="text-sm text-gray-500">Budget: ${proj.projectBudget?.toLocaleString()}</p>
                </div>
                <Button
                  onClick={() => router.push(getProjectUrl(proj))}
                  className="w-full sm:w-auto bg-[#2E3A8C] text-white hover:bg-[#2E3A8C]/90"
                >
                  {getButtonText(proj.status)}
                </Button>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" /> {proj.bids || 0} Bids
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(proj.status)}
                  {getStatusDisplay(proj.status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
