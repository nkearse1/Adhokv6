'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { CalendarIcon, Clock, ExternalLink, AlertTriangle, MessageSquare, CreditCard } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProjectTimeline from '@/components/ProjectTimeline';
import DeliverablesPanel from '@/components/DeliverablesPanel';
import ActivityLog from '@/components/ActivityLog';
import ChatPanel from '@/components/ChatPanel';
import FileUpload from '@/components/FileUpload';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import DeliverableUpload from '@/components/DeliverableUpload';
import ClientFeedbackCard from '@/components/ClientFeedbackCard';
import { getProjectById } from '@/lib/mockData';

// Mock hooks to replace the ones that used Supabase
const useProjectStatus = (projectId: string) => {
  const [deliverables, setDeliverables] = useState<any[]>([
    {
      id: '1',
      title: 'Technical SEO Audit',
      description: 'Comprehensive technical audit to identify crawlability, indexation, and speed issues.',
      problem: 'Site has poor indexation and crawl efficiency',
      kpis: ['Improve crawl rate by 30%', 'Fix all critical technical issues'],
      status: 'in_progress' as const,
      estimatedHours: 8,
      actualHours: 4,
      timeEntries: [{ startTime: new Date(), endTime: new Date(), hoursLogged: 4 }]
    },
    {
      id: '2',
      title: 'Keyword Strategy',
      description: 'Develop comprehensive keyword targeting strategy',
      problem: 'Current keyword targeting is too broad',
      kpis: ['Identify 50+ high-value keywords', 'Create keyword mapping document'],
      status: 'recommended' as const,
      estimatedHours: 6,
      actualHours: 0,
      timeEntries: []
    }
  ]);
  
  const [activityLog, setActivityLog] = useState<string[]>([
    'Project started',
    'Initial deliverables proposed',
    'Technical SEO audit started'
  ]);
  
  return {
    projectStatus: 'In Progress',
    deliverables,
    activityLog,
    loading: false,
    statusReady: true,
    canAccess: true,
    hasTrackingInfo: false,
    updateDeliverableStatus: async (id: string, status: any) => {
      setDeliverables(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
      setActivityLog(prev => [...prev, `Deliverable "${deliverables.find(d => d.id === id)?.title}" status updated to ${status}`]);
    },
    addDeliverable: async (deliverable: any) => {
      setDeliverables(prev => [
        ...prev,
        { ...deliverable, id: Date.now().toString(), actualHours: 0, timeEntries: [] },
      ]);
      setActivityLog(prev => [...prev, `New deliverable "${deliverable.title}" added`]);
    },
    updateDeliverable: (id: string, updates: any) => {
      setDeliverables(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
      setActivityLog(prev => [...prev, `Deliverable "${deliverables.find(d => d.id === id)?.title}" updated`]);
    },
    addActivityLogEntry: (entry: string) => {
      setActivityLog(prev => [...prev, entry]);
    },
    getApprovalProgress: () => {
      const total = deliverables.length;
      const approved = deliverables.filter(d => d.status === 'approved').length;
      return { approved, total, percentage: total > 0 ? (approved / total) * 100 : 0 };
    }
  };
};

const useEscrow = (projectId: string) => {
  const [status, setStatus] = useState('idle');
  
  return {
    escrowStatus: status,
    requestEscrowRelease: () => {
      setStatus('requested');
    },
    approveEscrowRelease: () => {
      setStatus('approved');
    },
    rejectEscrowRelease: () => {
      setStatus('rejected');
    },
    overrideEscrow: () => {}
  };
};

export default function ProjectWorkspace() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const project_id = params.project_id as string;
  const {
    userId,
    userRole,
    username,
    authUser,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();
  const project = getProjectById(project_id) || null;
  const [projectName] = useState(project?.title || 'Project');
  const [projectDeadline] = useState(new Date(project?.deadline || Date.now()));
  const [projectStartDate] = useState(new Date());
  const [estimatedHours] = useState(project?.deliverables.reduce((a,d)=>a+d.estimatedHours,0) || 0);
  const [hourlyRate] = useState(project?.hourlyRate || 0);
  const [estimatedBudget] = useState(estimatedHours * hourlyRate);
  const [activeTab, setActiveTab] = useState('chat');

  const {
    projectStatus,
    deliverables,
    activityLog,
    loading,
    updateDeliverableStatus,
    addDeliverable,
    updateDeliverable,
    addActivityLogEntry,
    canAccess,
    statusReady,
    getApprovalProgress
  } = useProjectStatus(project_id);

  const {
    escrowStatus,
    requestEscrowRelease,
    approveEscrowRelease,
    rejectEscrowRelease,
    overrideEscrow
  } = useEscrow(project_id);

  useEffect(() => {
    if (projectStatus === 'Picked Up') {
      setActiveTab('chat');
    }
  }, [projectStatus]);


  if (loading || !statusReady) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C] mx-auto mb-4"></div>
          <p className="text-[#2E3A8C]">Loading project workspace...</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="font-semibold mb-2">Workspace Not Available</div>
              <p className="text-sm">
                The project workspace is only accessible after the project has been picked up.
                Current status: {projectStatus}
              </p>
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/talent/dashboard')} className="mt-4 w-full sm:w-auto">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = getApprovalProgress();
  const isPickedUp = projectStatus === 'Picked Up';

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Mobile-responsive header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2E3A8C] break-words">{projectName}</h1>
        </div>

        <ProjectTimeline status={projectStatus} role="talent" />

        {/* Mobile-responsive project info card */}
        <div className="bg-white border border-[#E6E9F4] rounded-lg p-4 mb-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {projectStatus}
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  Due {formatDistanceToNow(projectDeadline, { addSuffix: true })}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Escrow: {escrowStatus}
                </Badge>
                {isPickedUp && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Chat Now Available
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#2E3A8C]" />
                    <span>Deadline: {format(projectDeadline, 'PPP')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2E3A8C]" />
                  <span>{estimatedHours} hours @ ${hourlyRate}/hr</span>
                </div>
              </div>
              {!isPickedUp && (
                <>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#2E3A8C] h-2 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-500">{progress.approved} of {progress.total} deliverables approved</p>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[#2E3A8C]">
                Your Earnings: ${(estimatedBudget * 0.85).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                (85% of ${estimatedBudget.toLocaleString()} total)
              </div>
            </div>
          </div>
        </div>

        {isPickedUp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">🚀 Next Steps</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. <strong>Introduce yourself</strong> to the client in the chat</p>
              <p>2. <strong>Review the original deliverables</strong> and recommend any additional work</p>
              <p>3. <strong>Get client approval</strong> on the final scope before starting work</p>
            </div>
          </div>
        )}

        {/* Escrow Release Request Button */}
        {projectStatus === 'Submitted' && escrowStatus === 'idle' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Work Complete!</h3>
                <p className="text-sm text-green-800">Request payment release from escrow</p>
              </div>
              <Button onClick={requestEscrowRelease} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <CreditCard className="w-4 h-4 mr-2" />
                Request Escrow Release
              </Button>
            </div>
          </div>
        )}

        {escrowStatus === 'requested' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>Payment Release Requested</strong> - Waiting for client approval
              </p>
            </div>
          </div>
        )}

        {escrowStatus === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800">
                <strong>Payment Released!</strong> - Funds have been transferred to your account
              </p>
            </div>
          </div>
        )}

        <WorkspaceTabs />
        <DeliverableUpload />
        <ClientFeedbackCard />

        {/* Mobile-responsive tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white mb-6 rounded-lg border border-[#E6E9F4]">
            <TabsTrigger value="chat" className="data-[state=active]:bg-[#2E3A8C] data-[state=active]:text-white relative text-xs sm:text-sm">
              Chat
              {isPickedUp && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="deliverables" className="data-[state=active]:bg-[#2E3A8C] data-[state=active]:text-white text-xs sm:text-sm">
              Deliverables
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#2E3A8C] data-[state=active]:text-white text-xs sm:text-sm">
              Upload
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#2E3A8C] data-[state=active]:text-white text-xs sm:text-sm">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatPanel 
              role="talent"
              projectId={project_id}
              partnerTypingLabel="Client is typing..."
              deliverables={deliverables}
              projectStatus={projectStatus}
              onActivity={addActivityLogEntry}
            />
          </TabsContent>

          <TabsContent value="deliverables">
            <DeliverablesPanel 
              role="talent"
              deliverables={deliverables}
              editable
              showForm
              projectDeadline={projectDeadline}
              projectStartDate={projectStartDate}
              onAddDeliverable={addDeliverable}
              onStatusChange={updateDeliverableStatus}
              onUpdateDeliverable={updateDeliverable}
            />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload
              projectId={project_id}
              onUploadComplete={(file) => addActivityLogEntry(`Uploaded file: ${file.name}`)}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog
              role="talent"
              deliverables={deliverables}
              activityLog={activityLog}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}