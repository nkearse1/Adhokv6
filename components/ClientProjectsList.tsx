"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string;
  projectBudget: number;
  bids?: number;
  amountSpent?: number;
}

export default function ClientProjectsList({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const res = await fetch('/api/db?table=projects');
        const json = await res.json();
        if (res.ok) {
          const all = json.data || [];
          setProjects(all.filter((p: any) => p.clientId === userId));
        }
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchProjects();
  }, [userId]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const getProjectUrl = (project: Project) => {
    const workspace = ['picked_up', 'submitted', 'revisions', 'approved', 'completed'];
    return workspace.includes(project.status)
      ? `/client/projects/${project.id}/workspace`
      : `/client/projects/details/${project.id}`;
  };

  const getButtonText = (status: string) => {
    const workspace = ['picked_up', 'submitted', 'revisions', 'approved', 'completed'];
    return workspace.includes(status) ? 'View Workspace' : 'View Details';
  };

  const getStatusDisplay = (status: string) => {
    const map: { [key: string]: string } = {
      draft: 'Draft',
      open: 'Open',
      picked_up: 'Picked Up',
      submitted: 'Submitted',
      revisions: 'Revisions',
      approved: 'Approved',
      completed: 'Completed',
    };
    return map[status as keyof typeof map] || status;
  };

  const getStatusIcon = (status: string) => {
    const isActive = ['open', 'picked_up', 'submitted', 'revisions'].includes(status);
    const isComplete = ['approved', 'completed'].includes(status);
    if (isComplete) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isActive) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading projects...</div>;
  }

  if (!projects.length) {
    return <div className="p-4 text-sm text-gray-500">No projects yet.</div>;
  }

  return (
    <div className="grid gap-4">
      {projects.map((proj) => (
        <div key={proj.id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{proj.title}</h2>
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
              {getStatusIcon(proj.status)} {getStatusDisplay(proj.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
