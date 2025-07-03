'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import {
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TalentEarnings from "@/components/TalentEarnings";
import CaseStudyModal from "@/components/CaseStudyModal";

const USE_MOCK_SESSION = true;
const TEAL_COLOR = "#00A499";

const experienceBadgeMap: Record<string, string> = {
  "Entry Level": "Specialist",
  "Mid-Level": "Pro Talent",
  "Expert": "Expert",
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

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  project_budget: number;
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

interface Profile {
  id: string;
  full_name: string;
  email: string;
  expertise: string;
  location?: string;
  rate?: number;
  linkedin_url?: string;
  is_qualified: boolean;
  metadata?: {
    marketing?: {
      expertiseLevel?: string;
    };
  };
}

export default function TalentDashboard() {
  const router = useRouter();
  const { userId, authUser, isAuthenticated, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    activeBids: 0,
    totalEarnings: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState<"activeBids" | "wonProjects" | "earnings" | "portfolio">("activeBids");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_SESSION) {
      setProfile({
        id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        full_name: "Mock Talent",
        email: "talent@adhok.dev",
        expertise: "SEO",
        location: "Tampa, FL",
        rate: 75,
        linkedin_url: "https://linkedin.com/in/mocktalent",
        is_qualified: true,
        metadata: { marketing: { expertiseLevel: "Pro Talent" } },
      });
      const mockProjects = [
        {
          id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
          title: "Mock SEO Audit",
          description: "Audit a small business website",
          status: "open",
          deadline: new Date().toISOString(),
          project_budget: 500,
          bidCount: 4,
          lastBid: 72,
          metadata: { marketing: { expertiseLevel: "Pro Talent" } },
        },
        {
          id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
          title: "Social Media Strategy",
          description: "Develop comprehensive social media plan",
          status: "completed",
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          project_budget: 1500,
          bidCount: 1,
          lastBid: 140,
          deliverables: [
            { id: "1", title: "Content Calendar" },
            { id: "2", title: "Platform Strategy" },
          ],
          caseStudy: {
            id: "cs1",
            summary: "Developed and implemented a full strategy.",
            outcome: "Client doubled their engagement.",
            deliverableId: "1",
          },
          metadata: { marketing: { expertiseLevel: "Expert" } },
        },
      ];
      setProjects(mockProjects);
      setStats({ activeBids: 1, totalEarnings: 1200, completedProjects: 1 });
      setLoading(false);
      return;
    }
  }, [authLoading, isAuthenticated, userId]);

  const handleSaveCaseStudy = (projectId: string, newData: CaseStudy) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, caseStudy: newData } : project
      )
    );
    toast.success("Case study saved!");
  };

  const statLabelMap: Record<string, string> = {
    activeBids: "Active Bids",
    wonProjects: "Won Projects",
    earnings: "Total Earnings",
    portfolio: "Completed Projects",
  };

  const statValueMap: Record<string, number | string> = {
    activeBids: stats.activeBids,
    wonProjects: stats.completedProjects,
    earnings: stats.totalEarnings.toLocaleString(),
    portfolio: stats.completedProjects,
  };

  const filteredProjects = projects.filter((p) => {
    if (currentTab === "activeBids") return p.status !== "completed";
    if (currentTab === "wonProjects") return p.status === "completed";
    if (currentTab === "portfolio") return p.status === "completed";
    return false;
  });

  const username = authUser?.user_metadata?.username || authUser?.id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 px-2 md:px-0">
        <h1 className="text-3xl font-bold text-[#2E3A8C]">Talent Dashboard</h1>
        <Button onClick={() => router.push(`/talent/${username}/projects`)}>Browse Projects</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Object.keys(statLabelMap).filter(tab => tab !== currentTab).map((tab) => (
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

      <h2 className="text-xl font-semibold text-[#2E3A8C] mb-4">{statLabelMap[currentTab]}</h2>

      <div className="space-y-4">
        {currentTab === "portfolio" ? (
          filteredProjects.map(project => (
            <div key={project.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-[#2E3A8C]">{project.title}</h3>
                <Badge variant="outline">Complete</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Deadline: {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</p>
              {project.caseStudy ? (
                <div className="bg-gray-50 p-3 rounded-md mb-2 text-sm">
                  <p className="font-medium text-[#2E3A8C] mb-1">📘 Case Study Summary</p>
                  <p>{project.caseStudy.summary}</p>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500 mb-2">No case study submitted yet.</p>
              )}
              <Button variant="secondary" onClick={() => setEditingProjectId(project.id)}>
                {project.caseStudy ? "Edit Case Study" : "Add Case Study"}
              </Button>

              {editingProjectId === project.id && (
                <CaseStudyModal
                  open={true}
                  onClose={() => setEditingProjectId(null)}
                  deliverables={project.deliverables || []}
                  initialData={project.caseStudy}
                  onSubmit={(newData) => {
                    handleSaveCaseStudy(project.id, newData);
                    setEditingProjectId(null);
                  }}
                />
              )}
            </div>
          ))
        ) : currentTab === "earnings" ? (
          <TalentEarnings />
        ) : (
          <p className="text-gray-500 text-sm">No projects in this tab.</p>
        )}
      </div>
    </div>
  );
}
