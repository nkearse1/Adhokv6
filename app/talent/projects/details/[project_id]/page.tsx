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
    async function load() {
      if (!project_id) return;
      try {
        const res = await fetch(`/api/db?table=projects&id=${project_id}`);
        const json = await res.json();
        const proj = json.data?.[0];
        if (proj) {
          setProject({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            deadline: proj.deadline,
            estimated_hours: proj.estimatedHours,
            hourly_rate: proj.hourlyRate,
          });
        }
      } catch (err) {
        console.error('Error loading project', err);
      }
    }
    load();
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
