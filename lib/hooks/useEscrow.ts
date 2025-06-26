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

  // Load mock escrow data on mount
  useEffect(() => {
    if (projectId) {
      loadEscrowData();
    }
  }, [projectId]);

  const loadEscrowData = async () => {
    try {
      setLoading(true);
      
      // Set mock escrow status
      setEscrowStatus('idle');

      // Set mock escrow history
      const mockHistory: EscrowHistoryEntry[] = [];
      setEscrowHistory(mockHistory);
    } catch (error) {
      console.error('Error loading escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestEscrowRelease = useCallback(async () => {
    try {
      setLoading(true);
      
      // Update escrow status
      setEscrowStatus('requested');
      
      // Add to history
      const newEntry: EscrowHistoryEntry = {
        id: Date.now().toString(),
        action: 'requested',
        timestamp: new Date(),
        actor: 'Talent',
      };
      
      setEscrowHistory(prev => [newEntry, ...prev]);
      toast.success('Escrow release requested - client will be notified');
    } catch (error) {
      console.error('Error requesting escrow release:', error);
      toast.error('Failed to request escrow release');
    } finally {
      setLoading(false);
    }
  }, []);

  const approveEscrowRelease = useCallback(async () => {
    try {
      setLoading(true);
      
      // Update escrow status
      setEscrowStatus('approved');
      
      // Add to history
      const newEntry: EscrowHistoryEntry = {
        id: Date.now().toString(),
        action: 'approved',
        timestamp: new Date(),
        actor: 'Client',
      };
      
      setEscrowHistory(prev => [newEntry, ...prev]);
      toast.success('Payment released from escrow');
    } catch (error) {
      console.error('Error approving escrow release:', error);
      toast.error('Failed to approve escrow release');
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectEscrowRelease = useCallback(async (reason: string) => {
    try {
      setLoading(true);
      
      // Update escrow status
      setEscrowStatus('rejected');
      
      // Add to history
      const newEntry: EscrowHistoryEntry = {
        id: Date.now().toString(),
        action: 'rejected',
        timestamp: new Date(),
        actor: 'Client',
        reason
      };
      
      setEscrowHistory(prev => [newEntry, ...prev]);
      toast.warning(`Escrow release rejected: ${reason}`);
    } catch (error) {
      console.error('Error rejecting escrow release:', error);
      toast.error('Failed to reject escrow release');
    } finally {
      setLoading(false);
    }
  }, []);

  const overrideEscrow = useCallback(async (action: 'release' | 'cancel', reason?: string) => {
    try {
      setLoading(true);
      
      const newStatus = action === 'release' ? 'approved' : 'disputed';
      
      // Update escrow status
      setEscrowStatus(newStatus);
      
      // Add to history
      const newEntry: EscrowHistoryEntry = {
        id: Date.now().toString(),
        action: 'overridden',
        timestamp: new Date(),
        actor: 'Admin',
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
    } finally {
      setLoading(false);
    }
  }, []);

  const flagProjectForReview = useCallback(async (reason: string) => {
    try {
      setLoading(true);
      
      // Update escrow status
      setEscrowStatus('flagged');
      
      // Add to history
      const newEntry: EscrowHistoryEntry = {
        id: Date.now().toString(),
        action: 'flagged',
        timestamp: new Date(),
        actor: 'Admin',
        reason
      };
      
      setEscrowHistory(prev => [newEntry, ...prev]);
      toast.warning('Project flagged for review - payments frozen');
    } catch (error) {
      console.error('Error flagging project:', error);
      toast.error('Failed to flag project');
    } finally {
      setLoading(false);
    }
  }, []);

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