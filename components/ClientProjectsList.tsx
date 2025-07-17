'use client';
import { useRouter } from 'next/navigation';
import { Briefcase, CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ClientProject {
  id: string;
  title: string;
  status: string;
  deadline: string;
  projectBudget: number;
  bids?: number;
}

interface Props {
  projects: ClientProject[];
}

export default function ClientProjectsList({ projects }: Props) {
  const router = useRouter();

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
  const getProjectUrl = (project: ClientProject) => {
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No projects yet. Create your first project to get started!</p>
        <Button onClick={() => router.push('/upload')} className="bg-[#00D1C1] text-white hover:bg-[#00b4ab]">
          <Plus className="mr-2 w-4 h-4" /> Post Your First Project
        </Button>
      </div>
    );
  }

  return (
    <>
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
              {getStatusIcon(proj.status)}
              {getStatusDisplay(proj.status)}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

