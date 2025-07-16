'use client';

interface Project {
  id: string;
  title?: string;
}

interface ClientProjectsListProps {
  projects: Project[];
}

export default function ClientProjectsList({ projects }: ClientProjectsListProps) {
  return (
    <div className="space-y-2">
      {projects.length ? (
        projects.map((p) => (
          <div key={p.id} className="border rounded-md p-2">
            {p.title ?? 'Project'}
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No projects available.</p>
      )}
    </div>
  );
}
