'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  status: string;
}

export default function WonProjectsCard({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/db?table=projects');
        const json = await res.json();
        if (res.ok) {
          const all = json.data || [];
          setProjects(
            all.filter(
              (p: any) =>
                p.talentId === userId &&
                (p.status === 'awarded' || p.status === 'complete'),
            ) as Project[],
          );
        }
      } catch (err) {
        console.error('Failed loading projects', err);
      }
    }

    if (userId) load();
  }, [userId]);

  const awardedCount = projects.filter((p) => p.status === 'awarded').length;
  const completedCount = projects.filter((p) => p.status === 'complete').length;

  if (!projects.length) {
    return (
      <div className="border p-4 rounded-md text-muted-foreground">
        No won projects yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Awarded</p>
          <p className="text-2xl font-bold">{awardedCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold">{completedCount}</p>
        </div>
      </div>
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <Button
              variant="link"
              className="px-0 text-[#2E3A8C]"
              onClick={() => (window.location.href = `/talent/projects/workspace/${project.id}`)}
            >
              {project.title}
            </Button>
            <Badge variant={project.status === 'complete' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
