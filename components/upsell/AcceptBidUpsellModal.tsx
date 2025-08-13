'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AcceptBidUpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export default function AcceptBidUpsellModal({ open, onOpenChange, projectId }: AcceptBidUpsellModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgradeAccount = () => {
    // Redirect to Stripe Checkout for account upgrade
    window.location.href = '/api/stripe/checkout?mode=accept-bid';
  };

  const handleUnlockProject = async () => {
    try {
      setLoading(true);
      await enableProjectAcceptBid(projectId);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept bids instantly</DialogTitle>
          <DialogDescription>
            Upgrade to accept bids directly and hire talent faster. Unlock this feature for your account or just this project for a small fee.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button className="flex-1" onClick={handleUpgradeAccount} disabled={loading}>
            Upgrade account
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleUnlockProject} disabled={loading}>
            Unlock for this project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function enableProjectAcceptBid(projectId: string) {
  await fetch(`/api/projects/${projectId}/accept-bid`, { method: 'POST' });
}

