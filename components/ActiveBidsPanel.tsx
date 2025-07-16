'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Bid {
  id: string;
  projectId: string;
  professionalId: string;
  ratePerHour: number;
  status?: string;
}

interface Project {
  id: string;
  title: string;
}

const USE_MOCK_DATA = true; // Set to false in production

export default function ActiveBidsPanel({ userId }: { userId: string }) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/db?table=project_bids');
        const json = await res.json();
        const userBids = (json.data || []).filter(
          (b: any) => b.professionalId === userId
        );
        setBids(userBids);

        const projectIds = userBids.map((b: any) => b.projectId);
        if (projectIds.length) {
          const pres = await fetch('/api/db?table=projects');
          const pjson = await pres.json();
          setProjects(
            (pjson.data || []).filter((p: any) => projectIds.includes(p.id))
          );
        }
      } catch (err) {
        console.error('Failed loading bids', err);
      }
    }

    if (USE_MOCK_DATA) {
      setBids([
        {
          id: 'bid1',
          projectId: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
          professionalId: userId,
          ratePerHour: 72,
          status: 'active',
        },
      ]);
      setProjects([
        { id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', title: 'Mock SEO Audit' },
      ]);
      return;
    }

    if (userId) load();
  }, [userId]);

  const getProjectTitle = (id: string) =>
    projects.find((p) => p.id === id)?.title || id;

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!bids.length) {
    return (
      <div className="border p-4 rounded-md text-muted-foreground">
        No active bids.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bids.map((bid) => (
        <Card key={bid.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{getProjectTitle(bid.projectId)}</h3>
