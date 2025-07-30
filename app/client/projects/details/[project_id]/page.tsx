'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';
import { toast } from 'sonner';
import {
  BadgeCheck,
  CalendarIcon,
  Clock,
  FileText,
  Link as LinkIcon,
  Target,
  Users,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProjectStatusCard from '@/components/ProjectStatusCard';
import TalentAssignmentBox from '@/components/TalentAssignmentBox';

export default function ClientProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const project_id = params.project_id as string;
  const [project, setProject] = useState<any>(null);
  const [talentProfile, setTalentProfile] = useState<any>(null);
  const [approving, setApproving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const {
    userId,
    userRole,
    username,
    authUser,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && (!authUser || authUser.user_role !== 'client')) {
      router.replace('/');
    }
  }, [authLoading, authUser, router]);

  useEffect(() => {
    async function load() {
      try {
        if (!project_id) return;
        const res = await fetch(`/api/db?table=projects&id=${project_id}`);
        const json = await res.json();
        const proj = json.data?.[0];
        if (proj) {
          setProject(proj);
          if (proj.talentId) {
            const profRes = await fetch(`/api/talent/profile?id=${proj.talentId}`);
            const profJson = await profRes.json();
            if (profJson.profile) setTalentProfile(profJson.profile);
          }
        }
      } catch (err) {
        console.error('Error loading project', err);
        toast.error('Failed to load project');
      }
    }
    load();
  }, [project_id]);

  if (authLoading || !authUser) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }
  if (!project) return <p className="p-6 text-center text-gray-600">Loading project details...</p>;

  const totalBudget = project.estimated_hours * project.hourly_rate;
  const m = project.metadata?.marketing || {};
  const r = project.metadata?.requestor || {};

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <ProjectStatusCard status={project.status} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#2E3A8C] mb-2 break-words">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {project.category}
            </Badge>
            <Badge variant={project.status === 'approved' ? 'success' : 'secondary'}>
              {project.status === 'approved' ? (
                <BadgeCheck className="w-4 h-4 mr-1" />
              ) : (
                <Clock className="w-4 h-4 mr-1" />
              )}
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="text-right w-full sm:w-auto">
          <div className="text-sm text-gray-600">
            {project.estimated_hours}h @ ${project.hourly_rate}/hr
          </div>
          <div className="text-sm font-medium text-[#2E3A8C]">
            Total Budget: ${totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Project Details
            </h3>
            <div className="space-y-3 text-sm">
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Problem:</strong> {m.problem}</p>
              <p><strong>Deliverables:</strong> {m.deliverables}</p>
              {project.deadline && (
                <p className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}
              {project.brief_url && (
                <p>
                  <a
                    href={project.brief_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    View Project Brief
                  </a>
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Target Audience & Channels
            </h3>
            <div className="space-y-3 text-sm">
              <p><strong>Target Audience:</strong> {m.target_audience}</p>
              <p><strong>Platforms:</strong> {m.platforms}</p>
              <p><strong>Preferred Tools:</strong> {m.preferred_tools}</p>
              <p><strong>Brand Voice:</strong> {m.brand_voice}</p>
              {m.inspiration_links && (
                <div>
                  <strong>Inspiration:</strong>
                  <div className="mt-1">
                    {m.inspiration_links.split(',').map((link: string, i: number) => (
                      <a
                        key={i}
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline mb-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {new URL(link.trim()).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Project Team
          </h3>
          <TalentAssignmentBox />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Client</h4>
              <div className="space-y-1 text-sm">
                <p>{r.name}</p>
                <p>{r.company}</p>
                <p className="text-gray-600 break-all">{r.email}</p>
                <p className="text-gray-600">{r.phone}</p>
              </div>
            </div>

            {talentProfile && (
              <div>
                <h4 className="text-sm font-medium mb-2">Assigned Talent</h4>
                <div className="space-y-2">
                  <p className="text-sm">{talentProfile.fullName}</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${getBadgeStyle(talentProfile.experienceBadge)}`}>
                    <BadgeCheck className="w-4 h-4" />
                    {talentProfile.experienceBadge}
                  </span>
                  {talentProfile.portfolioUrl && (
                    <a
                      href={talentProfile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <LinkIcon className="w-3 h-3" />
                      View Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {project.client_review && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Your Review
            </h3>
            <p className="text-gray-800 break-words">{project.client_review}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleApprove}
          disabled={approving || project.status === 'approved'}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          {approving ? 'Approving...' : project.status === 'approved' ? 'Work Approved' : 'Approve Work'}
        </Button>
        <Button
          onClick={handleLeaveReview}
          disabled={reviewing}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {reviewing ? 'Submitting...' : 'Leave Review'}
        </Button>
      </div>
    </div>
  );
}

function getBadgeStyle(badge: string) {
  switch (badge) {
    case 'Expert Talent':
      return 'bg-green-100 text-green-800';
    case 'Pro Talent':
      return 'bg-blue-100 text-blue-800';
    case 'Specialist':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

async function handleApprove() {
  toast.success('Work approved. (Stub handler)');
}

async function handleLeaveReview() {
  toast.success('Review submitted. (Stub handler)');
}
