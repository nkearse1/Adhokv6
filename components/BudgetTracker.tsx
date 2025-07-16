'use client';
interface Props {
  projects: { projectBudget: number }[];
}

export default function BudgetTracker({ projects }: Props) {
  const total = projects.reduce((sum, p) => sum + (p.projectBudget || 0), 0);
  return (
    <div className="p-4 bg-gray-50 border rounded mb-4 text-sm">
      <span className="font-semibold">Total Budget:</span> ${total.toLocaleString()}
    </div>
  );
}

