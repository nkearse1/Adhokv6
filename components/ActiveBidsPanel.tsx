"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/mockData";

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


export default function ActiveBidsPanel({ userId }: { userId: string }) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/db?table=project_bids");
        const json = await res.json();
        const userBids = (json.data || []).filter(
          (b: any) => b.professionalId === userId,
        );
        setBids(userBids);
        const projectIds = userBids.map((b: any) => b.projectId);
        if (projectIds.length) {
          const pres = await fetch("/api/db?table=projects");
          const pjson = await pres.json();
          setProjects(
            (pjson.data || []).filter((p: any) => projectIds.includes(p.id)),
          );
        }
      } catch (err) {
        console.error("Failed loading bids", err);
      }
    }

    const mockBids = mockProjects
      .flatMap(p => p.bids || [])
      .filter(b => b.userId === userId)
      .map(b => ({ ...b, professionalId: b.userId }));
    if (mockBids.length) {
      setBids(mockBids as Bid[]);
      const ids = mockBids.map(b => b.projectId);
      setProjects(mockProjects.filter(p => ids.includes(p.id)) as Project[]);
      return;
    }

    if (userId) load();
  }, [userId]);

  const getProjectTitle = (id: string) =>
    projects.find((p) => p.id === id)?.title || id;

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
              <p className="text-sm text-gray-500">${bid.ratePerHour}/hr</p>
            </div>
            <Badge variant="secondary">{bid.status || "pending"}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
