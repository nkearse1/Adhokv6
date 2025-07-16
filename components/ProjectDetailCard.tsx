'use client';
import { CalendarIcon } from 'lucide-react';

interface Props {
  project: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    estimated_hours: number;
    hourly_rate: number;
  };
}

export default function ProjectDetailCard({ project }: Props) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h1 className="text-2xl font-bold text-[#2E3A8C]">{project.title}</h1>
      <p className="text-gray-700">{project.description}</p>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
      </div>
      <div className="text-sm text-gray-600">
        {project.estimated_hours}h @ ${project.hourly_rate}/hr
      </div>
    </div>
  );
}

