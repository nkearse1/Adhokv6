'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import {
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TalentEarnings from "@/components/TalentEarnings";
import CaseStudyModal from "@/components/CaseStudyModal";
import RevenuePanel from "@/components/RevenuePanel";
import { CompletedProjectsList } from "@/components/CompletedProjectsList";
import ActiveBidsPanel from "@/components/ActiveBidsPanel";
import BadgeDisplay from "@/components/BadgeDisplay";
import WonProjectsCard from "@/components/WonProjectsCard";
import ProfilePanel from "@/components/ProfilePanel";

const TEAL_COLOR = "#00A499";
const USE_MOCK_SESSION = true;

const experienceBadgeMap: Record<string, string> = {
  "Entry Level": "Specialist",
  "Mid-Level": "Pro Talent",
  "Expert": "Expert Talent",
};

interface Deliverable {
  id: string;
  title: string;
  description?: string;
}

interface CaseStudy {
  id: string;
  summary: string;
  outcome: string;
  deliverableId?: string;
}

interface CaseStudyData {
  title: string;
  problem: string;
  solution: string;
  kpis: string;
  results: string;
  showOnPortfolio: boolean;
}

function toCaseStudyData(cs: CaseStudy): CaseStudyData {
  return {
    title: cs.summary ?? '',
    problem: cs.summary ?? '',
    solution: cs.outcome ?? '',
    kpis: '',
    results: cs.outcome ?? '',
    showOnPortfolio: false,
  };
}

interface Profile {
  fullName?: string;
  username?: string;
  email?: string;
  expertise?: string;
  location?: string;
  experienceBadge?: string;
  linkedinUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  projectBudget: number;
  rate_per_hour?: number;
  bidCount?: number;
  lastBid?: number;
  deliverables?: Deliverable[];
  caseStudy?: CaseStudy;
  metadata?: {
    marketing?: {
      expertiseLevel?: string;
    };
  };
}

export default function TalentDashboard() {
  const { userId } = useAuth();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<'activeBids' | 'earnings' | 'portfolio' | 'won'>('activeBids');
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_SESSION && userId) {
      setProjects([
        {
          id: "mock1",
          title: "Brand Audit and SEO",
          description: "Run a full marketing audit.",
          status: "complete",
          deadline: new Date().toISOString(),
          projectBudget: 2000,
          caseStudy: {
            id: "cs1",
            summary: "Increased SEO visibility by 40%",
            outcome: "Traffic up 40% in 3 months",
          },
          deliverables: [
            { id: "d1", title: "Audit Report" },
            { id: "d2", title: "Keyword List" },
          ],
        },
      ]);
      setProfile({
        fullName: "Alex Rivera",
        username: "alex_rivera",
        email: "talent1@example.com",
        expertise: "SEO & Content Strategy",
        location: "Austin, TX",
        experienceBadge: "Expert Talent",
        linkedinUrl: "https://linkedin.com/in/example",
      });
    }
  }, [userId]);

  const statLabelMap: Record<string, string> = {
    activeBids: "Active Bids",
    earnings: "Revenue Overview",
    portfolio: "Completed Projects",
    won: "Won Projects",
  };

  const statValueMap: Record<string, string | number> = {
    activeBids: 1,
    earnings: "$7,200",
    portfolio: 1,
    won: projects.filter(p => p.status === 'awarded' || p.status === 'complete').length,
  };
  const filteredProjects = projects.filter(p => p.status === 'complete');
  const wonProjects = projects.filter(p => p.status === 'awarded' || p.status === 'complete');

  const handleSaveCaseStudy = (projectId: string, updated: CaseStudy) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId ? { ...p, caseStudy: updated } : p
    );
    setProjects(updatedProjects);
    toast.success("Case Study saved");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 px-2 md:px-0">
        <h1 className="text-3xl font-bold text-[#2E3A8C]">Talent Dashboard</h1>
        <BadgeDisplay tier="Expert Talent" />
        <Button onClick={() => router.push(`/talent/${userId}/projects`)}>
          Browse Projects
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {Object.keys(statLabelMap)
              .filter((tab) => tab !== currentTab)
              .map((tab) => (
                <Card
                  key={tab}
                  className="cursor-pointer"
                  style={{ borderColor: TEAL_COLOR }}
                  onClick={() => setCurrentTab(tab as typeof currentTab)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-sm text-gray-600">{statLabelMap[tab]}</h3>
                    <p className="text-2xl font-bold">{statValueMap[tab]}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          <h2 className="text-xl font-semibold text-[#2E3A8C] mb-4">
            {statLabelMap[currentTab]}
          </h2>

          <div className="space-y-4">
            {currentTab === 'activeBids' && userId && (
              <ActiveBidsPanel userId={userId} />
            )}
            {currentTab === 'earnings' && <RevenuePanel />}
            {currentTab === 'won' && <WonProjectsCard userId={userId || ''} />}
            {currentTab === 'portfolio' && (
              <>
                <CompletedProjectsList userId={userId || ''} />
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-[#2E3A8C]">{project.title}</h3>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Deadline: {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                    </p>
                    {project.caseStudy ? (
                      <div className="bg-gray-50 p-3 rounded-md mb-2 text-sm">
                        <p className="font-medium text-[#2E3A8C] mb-1">📘 Case Study Summary</p>
                        <p>{project.caseStudy.summary}</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-500 mb-2">No case study submitted yet.</p>
                    )}
                    <Button variant="secondary" onClick={() => setEditingProjectId(project.id)}>
                      {project.caseStudy ? 'Edit Case Study' : 'Add Case Study'}
                    </Button>

                    {editingProjectId === project.id && (
                      <CaseStudyModal
                        open={true}
                        onClose={() => setEditingProjectId(null)}
                        deliverables={project.deliverables || []}
                        initialData={
                          project.caseStudy ? toCaseStudyData(project.caseStudy) : undefined
                        }
                        onSubmit={(newData) => {
                          handleSaveCaseStudy(project.id, {
                            id: project.caseStudy?.id || '',
                            summary: newData.problem || newData.title,
                            outcome: newData.results || newData.solution,
                            deliverableId: project.caseStudy?.deliverableId,
                          });
                          setEditingProjectId(null);
                        }}
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <ProfilePanel profile={profile} />
        </div>
      </div>
    </div>
  );
}
