'use client';

interface ActiveBidsPanelProps {
  bids: Array<{ id: string; title?: string }>;
}

export default function ActiveBidsPanel({ bids }: ActiveBidsPanelProps) {
  return (
    <div className="border rounded-md p-4">
      <h2 className="font-semibold mb-2">Active Bids</h2>
      {bids.length ? (
        <ul className="list-disc list-inside space-y-1">
          {bids.map((b) => (
            <li key={b.id}>{b.title ?? 'Bid'}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No active bids.</p>
      )}
    </div>
  );
}
