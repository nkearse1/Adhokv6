import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';

export interface TimeEntry {
  startTime: Date;
  endTime?: Date;
  hoursLogged?: number;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  problem?: string;
  kpis?: string[];
  status: 'recommended' | 'scoped' | 'in_progress' | 'approved' | 'performance_tracking';
  estimatedHours: number;
  actualHours: number;
  timeEntries: TimeEntry[];
  dueDate?: Date;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  isTracking?: boolean;
  currentSession?: {
    startTime: Date;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'client' | 'talent';
  timestamp: Date;
  deliverableId?: string;
}

interface ProjectStatusResult {
  projectStatus: string;
  deliverables: Deliverable[];
  activityLog: string[];
  messages: Message[];
  loading: boolean;
  statusReady: boolean;
  hasTrackingInfo: boolean;
  isArchived: boolean;
  isAssignedToTalent: boolean;
  canAccess: boolean;
  updateDeliverableStatus: (id: string, newStatus: Deliverable['status']) => Promise<void>;
  addDeliverable: (deliverable: Partial<Deliverable>) => Promise<void>;
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void;
  addActivityLogEntry: (message: string) => void;
  addTrackingInfo: (trackingData: any) => void;
  getApprovalProgress: () => { approved: number; total: number; percentage: number };
}

const accessibleStatuses = ['Picked Up', 'Scope Defined', 'In Progress', 'Submitted', 'Revisions', 'Final Payment', 'Approved', 'Performance Tracking', 'Complete'];

// Mock data for deliverables

export function useProjectStatus(projectId?: string): ProjectStatusResult {
  const [projectStatus, setProjectStatus] = useState<string>('Loading...');
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasTrackingInfo, setHasTrackingInfo] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isAssignedToTalent, setIsAssignedToTalent] = useState(false);
  const [statusReady, setStatusReady] = useState(false);
  const { userId } = useAuth();

  const calculateProjectStatus = useCallback(
    (items: Deliverable[], hasTracking: boolean, archived: boolean, assigned: boolean): string => {
      if (!assigned) return 'Live';
      if (items.length === 0) return 'Picked Up';

      const allApproved = items.every(d => d.status === 'approved' || d.status === 'performance_tracking');
      const anyInProgress = items.some(d => d.status === 'in_progress');
      const anyScoped = items.some(d => d.status === 'scoped');
      const anyRecommended = items.some(d => d.status === 'recommended');

      if (allApproved && hasTracking) return 'Complete';
      if (allApproved) return 'Approved';
      if (anyInProgress) return 'In Progress';
      if (anyScoped) return 'Scope Defined';
      if (anyRecommended) return 'Picked Up';
      return 'Picked Up';
    },
    []
  );

  useEffect(() => {
    if (projectId && userId) {
      fetchProjectData();
    }
  }, [projectId, userId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      const delRes = await fetch('/api/db?table=project_deliverables');
      const delJson = await delRes.json();
      const del = (delJson.data || []).filter((d: any) => d.projectId === projectId);
      setDeliverables(del);

      const actRes = await fetch('/api/db?table=activity_logs');
      const actJson = await actRes.json();
      const acts = (actJson.data || []).filter((a: any) => a.projectId === projectId);
      setActivityLog(acts.map((a: any) => a.action));

      const msgRes = await fetch('/api/db?table=project_messages');
      const msgJson = await msgRes.json();
      const msgs = (msgJson.data || []).filter((m: any) => m.projectId === projectId);
      setMessages(msgs);
      setIsAssignedToTalent(true);

      const calculatedStatus = calculateProjectStatus(del, hasTrackingInfo, isArchived, true);

      setProjectStatus(calculatedStatus);
      setStatusReady(true);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccess = statusReady && accessibleStatuses.includes(projectStatus);

  const updateDeliverableStatus = useCallback(async (id: string, newStatus: Deliverable['status']) => {
    try {
      setDeliverables(prev => {
        const updated = prev.map(d => d.id === id ? { ...d, status: newStatus } : d);
        const newProjectStatus = calculateProjectStatus(updated, hasTrackingInfo, isArchived, isAssignedToTalent);
        setProjectStatus(newProjectStatus);
        return updated;
      });
      
      setActivityLog(prev => [...prev, `Deliverable status updated: ${newStatus}`]);
    } catch (error) {
      console.error('Error updating deliverable status:', error);
    }
  }, [calculateProjectStatus, hasTrackingInfo, isArchived, isAssignedToTalent]);

  const addDeliverable = useCallback(async (deliverable: Partial<Deliverable>) => {
    try {
      const newDeliverable: Deliverable = {
        id: Date.now().toString(),
        title: deliverable.title || '',
        description: deliverable.description || '',
        problem: deliverable.problem || '',
        kpis: deliverable.kpis || [],
        status: 'recommended',
        estimatedHours: deliverable.estimatedHours || 8,
        actualHours: 0,
        timeEntries: [],
        files: []
      };

      setDeliverables(prev => {
        const updated = [...prev, newDeliverable];
        const newProjectStatus = calculateProjectStatus(updated, hasTrackingInfo, isArchived, isAssignedToTalent);
        setProjectStatus(newProjectStatus);
        return updated;
      });
      
      setActivityLog(prev => [...prev, `New deliverable added: ${newDeliverable.title}`]);
    } catch (error) {
      console.error('Error adding deliverable:', error);
    }
  }, [calculateProjectStatus, hasTrackingInfo, isArchived, isAssignedToTalent]);

  const updateDeliverable = useCallback((id: string, updates: Partial<Deliverable>) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    setActivityLog(prev => [...prev, 'Deliverable updated']);
  }, []);

  const addActivityLogEntry = useCallback((message: string) => {
    setActivityLog(prev => [...prev, message]);
  }, []);

  const addTrackingInfo = useCallback((trackingData: any) => {
    setHasTrackingInfo(true);
    setActivityLog(prev => [...prev, 'Performance tracking information added']);
    const newProjectStatus = calculateProjectStatus(deliverables, true, isArchived, isAssignedToTalent);
    setProjectStatus(newProjectStatus);
  }, [calculateProjectStatus, deliverables, isArchived, isAssignedToTalent]);

  const getApprovalProgress = useCallback(() => {
    const approvedCount = deliverables.filter(d => d.status === 'approved' || d.status === 'performance_tracking').length;
    const totalCount = deliverables.length;
    const percentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
    return { approved: approvedCount, total: totalCount, percentage };
  }, [deliverables]);

  return {
    projectStatus,
    deliverables,
    activityLog,
    messages,
    loading,
    statusReady,
    hasTrackingInfo,
    isArchived,
    isAssignedToTalent,
    canAccess,
    updateDeliverableStatus,
    addDeliverable,
    updateDeliverable,
    addActivityLogEntry,
    addTrackingInfo,
    getApprovalProgress
  };
}
