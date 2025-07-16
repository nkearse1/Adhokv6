"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const USE_MOCK_DATA = true;
const MOCK_PROJECTS = [
  {
    id: "1",
    clientId: "mock-client",
    projectBudget: 3500,
    amountSpent: 1200,
  },
  {
    id: "2",
    clientId: "mock-client",
    projectBudget: 2800,
    amountSpent: 800,
  },
];

export default function BudgetTracker({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/db?table=projects");
        const json = await res.json();
        if (res.ok) {
          const data = json.data || [];
          setProjects(data.filter((p: any) => p.clientId === userId));
        }
      } catch (err) {
        console.error("Error loading projects", err);
      }
    }
    if (USE_MOCK_DATA) {
      setProjects(MOCK_PROJECTS);
      return;
    }
    if (userId) load();
  }, [userId]);

  const total = projects.reduce((sum, p) => sum + (p.projectBudget || 0), 0);
  const spent = projects.reduce((sum, p) => sum + (p.amountSpent || 0), 0);
  const percent = total ? Math.round((spent / total) * 100) : 0;

  if (!projects.length) return null;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold">Budget Tracker</h3>
        <div className="text-sm text-gray-600">
          Spent ${spent.toLocaleString()} of ${total.toLocaleString()}
        </div>
        <Progress value={percent} />
      </CardContent>
    </Card>
  );
}
