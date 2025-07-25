'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface CompletedProject {
  id: number;
  title: string;
  description: string;
  expertiseLevel: string;
  completedAt: string; // ISO date
  visibility: 'public' | 'private';
}

export function CompletedProjectsList({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCompleted() {
     const res = await fetch('/api/db?table=projects');
      const json = await res.json();
      if (res.ok) {
        const all = json.data || [];
        setProjects(
          all.filter((p: any) => p.status === 'completed' && p.talentId === userId) as CompletedProject[]
        );
      }
    }

    fetchCompleted();
  }, [userId]);

  if (!projects.length) {
    return (
      <div className="border p-4 text-muted-foreground rounded-md">
        No projects found in this section.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project: CompletedProject) => (
        <Card
          key={project.id}
          className={`border ${project.id === expandedId ? "border-[#2E3A8C] border-2" : "border-gray-200"} hover:shadow-md transition cursor-pointer`}
          onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs text-gray-500">
                  Completed on {format(new Date(project.completedAt), 'PPP')}
                </p>
                {project.visibility === 'private' && (
                  <span className="text-xs text-orange-500">🔒 Private</span>
                )}
              </div>
              <Badge variant="outline">{project.expertiseLevel}</Badge>
            </div>

            {expandedId === project.id && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    const updated = projects.map((p: CompletedProject) =>
                      p.id === project.id
                        ? { ...p, visibility: p.visibility === 'public' ? 'private' : 'public' }
                        : p
                    );
                    setProjects(updated as CompletedProject[]);
                  }}
                >
                  {project.visibility === 'public' ? 'Make Private' : 'Make Public'}
                </Button>
                <p className="text-sm text-muted-foreground">You can add project outcomes, deliverables, and links here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
