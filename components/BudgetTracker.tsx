'use client';

interface BudgetTrackerProps {
  used: number;
  budget: number;
}

export default function BudgetTracker({ used, budget }: BudgetTrackerProps) {
  const percent = budget ? Math.round((used / budget) * 100) : 0;
  return (
    <div className="border rounded-md p-4">
      <h2 className="font-semibold mb-2">Budget Tracker</h2>
      <p className="text-sm">{`${used.toLocaleString()} / ${budget.toLocaleString()} (${percent}%)`}</p>
    </div>
  );
}
