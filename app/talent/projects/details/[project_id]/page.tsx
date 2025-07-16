'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectDetailCard from '@/components/ProjectDetailCard';
import SubmitWorkButton from '@/components/SubmitWorkButton';
import LeaveReviewButton from '@/components/LeaveReviewButton';

interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimated_hours: number;
  hourly_rate: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const project_id = params.project_id as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      // replace with API call; mocked for now
      const data = {
        id: project_id,
        title: 'SEO Optimization Campaign',
        description: 'Improve search rankings for e-commerce website',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_hours: 40,
        hourly_rate: 75,
      };
      setProject(data);
    };
    if (project_id) fetchProject();
  }, [project_id]);

  if (!project) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <ProjectDetailCard project={project} />
      <div className="flex gap-2">
        <SubmitWorkButton />
        <LeaveReviewButton />
      </div>
    </div>
  );
}
