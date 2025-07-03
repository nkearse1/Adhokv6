'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Client {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
  createdAt: string;
  userRole: string;
  companyProfiles?: {
    name?: string;
  };
}

interface Project {
  id: string;
  title: string;
  status: string;
  deadline: string;
}

export default function AdminClientDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch client');
      const json = await res.json();
      setClient(json.data);
    };

    const fetchProjects = async () => {
      const res = await fetch(`/api/projects?client_id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      setProjects(json.data);
    };

    Promise.all([fetchClient(), fetchProjects()])
      .catch((err) => {
        console.error(err);
        setClient(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading client details...</div>;
  if (!client) return <div className="p-6 text-red-500">Client not found</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Client Details</h2>
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
          <strong>Name:</strong> {client.fullName}
          </div>
          <div>
            <strong>Email:</strong> {client.email}
          </div>
          <div>
          <strong>Company:</strong> {client.companyProfiles?.name || '—'}
          </div>
          <div>
          <strong>Role:</strong> <Badge variant="outline">{client.userRole}</Badge>
          </div>
          <div>
          <strong>Joined:</strong> {new Date(client.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Project History</h3>
          {projects.length === 0 ? (
            <div className="text-gray-500">No projects found for this client.</div>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/projects/details/${project.id}`)}
                >
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-gray-500">Status: {project.status}</div>
                  <div className="text-sm text-gray-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}