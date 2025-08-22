import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EscrowHistoryEntry {
  id: string;
  action: 'requested' | 'approved' | 'rejected' | 'disputed' | 'overridden' | 'flagged';
  timestamp: Date;
  actor: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export function useEscrow(projectId: string) {
  const [escrowStatus, setEscrowStatus] = useState<'idle' | 'requested' | 'approved' | 'rejected' | 'disputed' | 'flagged'>('idle');
  const [escrowHistory, setEscrowHistory] = useState<EscrowHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Load escrow data on mount
  useEffect(() => {
    if (projectId) {
      loadEscrowData();
    }
  }, [projectId]);

  const loadEscrowData = async () => {
    try {
      setLoading(true);
      const statusRes = await fetch(`/api/db?table=escrow_transactions&id=${projectId}`);
      const statusJson = await statusRes.json();
      if (statusJson.data?.[0]) {
        setEscrowStatus(statusJson.data[0].status);
      }

      const historyRes = await fetch('/api/db?table=escrow_history');
      const historyJson = await historyRes.json();
      const hist = (historyJson.data || []).filter((h: any) => h.projectId === projectId);
      setEscrowHistory(hist);
    } catch (error) {
      console.error('Error loading escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestEscrowRelease = useCallback(async () => {
    try {
      setLoading(true);

      const statusRes = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_transactions',
          id: projectId,
          data: { status: 'requested' }
        })
      });
      const statusJson = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusJson.error || 'Status update failed');

      const historyRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_history',
          data: {
            projectId,
            action: 'requested',
            actorName: 'Talent'
          }
        })
      });
      const historyJson = await historyRes.json();
      if (!historyRes.ok) throw new Error(historyJson.error || 'History insert failed');

      setEscrowStatus(statusJson.data?.[0]?.status ?? 'requested');
      const entry = historyJson.data?.[0];
      const newEntry: EscrowHistoryEntry = {
        id: entry?.id || Date.now().toString(),
        action: 'requested',
        timestamp: entry?.createdAt ? new Date(entry.createdAt) : new Date(),
        actor: entry?.actorName || 'Talent'
      };
      setEscrowHistory(prev => [newEntry, ...prev]);

      toast.success('Escrow release requested - client will be notified');
    } catch (error) {
      console.error('Error requesting escrow release:', error);
      toast.error('Failed to request escrow release');
      await loadEscrowData();
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const approveEscrowRelease = useCallback(async () => {
    try {
      setLoading(true);

      const statusRes = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_transactions',
          id: projectId,
          data: { status: 'approved' }
        })
      });
      const statusJson = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusJson.error || 'Status update failed');

      const historyRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_history',
          data: {
            projectId,
            action: 'approved',
            actorName: 'Client'
          }
        })
      });
      const historyJson = await historyRes.json();
      if (!historyRes.ok) throw new Error(historyJson.error || 'History insert failed');

      setEscrowStatus(statusJson.data?.[0]?.status ?? 'approved');
      const entry = historyJson.data?.[0];
      const newEntry: EscrowHistoryEntry = {
        id: entry?.id || Date.now().toString(),
        action: 'approved',
        timestamp: entry?.createdAt ? new Date(entry.createdAt) : new Date(),
        actor: entry?.actorName || 'Client'
      };
      setEscrowHistory(prev => [newEntry, ...prev]);

      toast.success('Payment released from escrow');
    } catch (error) {
      console.error('Error approving escrow release:', error);
      toast.error('Failed to approve escrow release');
      await loadEscrowData();
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const rejectEscrowRelease = useCallback(async (reason: string) => {
    try {
      setLoading(true);

      const statusRes = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_transactions',
          id: projectId,
          data: { status: 'rejected' }
        })
      });
      const statusJson = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusJson.error || 'Status update failed');

      const historyRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_history',
          data: {
            projectId,
            action: 'rejected',
            actorName: 'Client',
            reason
          }
        })
      });
      const historyJson = await historyRes.json();
      if (!historyRes.ok) throw new Error(historyJson.error || 'History insert failed');

      setEscrowStatus(statusJson.data?.[0]?.status ?? 'rejected');
      const entry = historyJson.data?.[0];
      const newEntry: EscrowHistoryEntry = {
        id: entry?.id || Date.now().toString(),
        action: 'rejected',
        timestamp: entry?.createdAt ? new Date(entry.createdAt) : new Date(),
        actor: entry?.actorName || 'Client',
        reason
      };
      setEscrowHistory(prev => [newEntry, ...prev]);

      toast.warning(`Escrow release rejected: ${reason}`);
    } catch (error) {
      console.error('Error rejecting escrow release:', error);
      toast.error('Failed to reject escrow release');
      await loadEscrowData();
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const overrideEscrow = useCallback(async (action: 'release' | 'cancel', reason?: string) => {
    try {
      setLoading(true);

      const newStatus = action === 'release' ? 'approved' : 'disputed';
      const statusRes = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_transactions',
          id: projectId,
          data: { status: newStatus }
        })
      });
      const statusJson = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusJson.error || 'Status update failed');

      const historyRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_history',
          data: {
            projectId,
            action: 'overridden',
            actorName: 'Admin',
            reason,
            metadata: { override_action: action }
          }
        })
      });
      const historyJson = await historyRes.json();
      if (!historyRes.ok) throw new Error(historyJson.error || 'History insert failed');

      setEscrowStatus(statusJson.data?.[0]?.status ?? newStatus);
      const entry = historyJson.data?.[0];
      const newEntry: EscrowHistoryEntry = {
        id: entry?.id || Date.now().toString(),
        action: 'overridden',
        timestamp: entry?.createdAt ? new Date(entry.createdAt) : new Date(),
        actor: entry?.actorName || 'Admin',
        reason,
        metadata: { override_action: action }
      };
      setEscrowHistory(prev => [newEntry, ...prev]);

      if (action === 'release') {
        toast.success('Admin override: Payment released');
      } else {
        toast.error('Admin override: Escrow cancelled');
      }
    } catch (error) {
      console.error('Error overriding escrow:', error);
      toast.error('Failed to override escrow');
      await loadEscrowData();
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const flagProjectForReview = useCallback(async (reason: string) => {
    try {
      setLoading(true);

      const statusRes = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_transactions',
          id: projectId,
          data: { status: 'flagged' }
        })
      });
      const statusJson = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusJson.error || 'Status update failed');

      const historyRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'escrow_history',
          data: {
            projectId,
            action: 'flagged',
            actorName: 'Admin',
            reason
          }
        })
      });
      const historyJson = await historyRes.json();
      if (!historyRes.ok) throw new Error(historyJson.error || 'History insert failed');

      setEscrowStatus(statusJson.data?.[0]?.status ?? 'flagged');
      const entry = historyJson.data?.[0];
      const newEntry: EscrowHistoryEntry = {
        id: entry?.id || Date.now().toString(),
        action: 'flagged',
        timestamp: entry?.createdAt ? new Date(entry.createdAt) : new Date(),
        actor: entry?.actorName || 'Admin',
        reason
      };
      setEscrowHistory(prev => [newEntry, ...prev]);
      toast.warning('Project flagged for review - payments frozen');
    } catch (error) {
      console.error('Error flagging project:', error);
      toast.error('Failed to flag project');
      await loadEscrowData();
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    escrowStatus,
    escrowHistory,
    loading,
    requestEscrowRelease,
    approveEscrowRelease,
    rejectEscrowRelease,
    overrideEscrow,
    flagProjectForReview
  };
}
