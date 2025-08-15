import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  metadata?: any;
  onEnabled?: () => void;
}

export default function AcceptBidUpsellModal({ open, onOpenChange, projectId, metadata = {}, onEnabled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgradeAccount = () => {
    window.location.href = '/api/stripe/checkout?feature=accept-bid';
  };

  const handleUnlockProject = async () => {
    try {
      setLoading(true);
      await enableProjectAcceptBid(projectId, metadata);
      toast.success('Accept Bid enabled for this project');
      onOpenChange(false);
      onEnabled?.();
    } catch (err) {
      console.error(err);
      toast.error('Failed to enable Accept Bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Accept Bids</DialogTitle>
          <DialogDescription>
            Unlock Accept Bid to hire talent instantly. Upgrade your account for unlimited access or unlock this project for a one-time fee.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-gray-700">
          <p className="mb-2">Accept Bid lets you immediately hire the talent whose proposal you love without waiting.</p>
          <p className="mb-2">Upgrade your account for unlimited access or unlock just this project for $49.</p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleUpgradeAccount} className="sm:flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
            Upgrade account
          </Button>
          <Button onClick={handleUnlockProject} disabled={loading} className="sm:flex-1">
            {loading ? 'Unlocking...' : 'Unlock for this project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export async function enableProjectAcceptBid(projectId: string, metadata: any = {}) {
  const res = await fetch('/api/db', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      table: 'projects',
      id: projectId,
      data: { metadata: { ...metadata, acceptBidEnabled: true } },
    }),
  });
  if (!res.ok) {
    throw new Error('Request failed');
  }
}

