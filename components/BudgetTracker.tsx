"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function BudgetTracker({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/db?table=projects');
        const json = await res.json();
        if (res.ok) {
          const data = json.data || [];
          setProjects(data.filter((p: any) => p.clientId === userId));
        }
      } catch (err) {
        console.error('Error loading projects', err);
      }
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
