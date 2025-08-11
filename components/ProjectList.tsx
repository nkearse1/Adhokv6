'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import DurationBadge from '@/components/DurationBadge';
import { calculateEstimatedHours } from '@/lib/estimation';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/lib/client/useAuthContext';

interface Bid {
  id: string;
  ratePerHour: number;
  createdAt?: string;
  projectId?: string;
  professionalId?: string;
}

interface Project {
  auction_end?: string;
  id: string;
  title: string;
  description: string;
  deadline: string;
  expertiseLevel: string;
  bidCount?: number;
  activeBid?: number;
  projectBudget?: number;
  status?: string;
  category?: string;
  overview?: string;
  deliverables?: string;
  target_audience?: string;
  platforms?: string;
  preferred_tools?: string;
  brand_voice?: string;
  inspiration_links?: string;
}

const startingBidsByExpertise: Record<string, number> = {
  Expert: 150,
  'Pro Talent': 100,
  Specialist: 50,
};

const expertiseOrder: Record<string, number> = {
  Specialist: 1,
  'Pro Talent': 2,
  Expert: 3,
};

const experienceBadgeMap: Record<string, string> = {
  'Entry Level': 'Specialist',
  'Mid-Level': 'Pro Talent',
  Expert: 'Expert',
};

const TEAL_HIGHLIGHT = '#00A499';

export default function ProjectList() {
  const { userId } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortKey, setSortKey] = useState<'bid' | 'expertise' | 'deadline'>('bid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidValue, setBidValue] = useState('');
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        console.error('Error fetching projects:', json.error);
        toast.error('Failed to load projects');
        return;
      }

      const formattedProjects: Project[] =
        (json.projects || [])
          .filter((p: any) => p.status === 'open')
          .map((project: any) => ({
            ...project,
            expertiseLevel: project.minimumBadge || 'Mid-Level',
            bidCount: 0,
            overview: project.description,
            deliverables: project.metadata?.marketing?.deliverables,
            target_audience: project.metadata?.marketing?.target_audience,
            platforms: project.metadata?.marketing?.platforms,
            preferred_tools: project.metadata?.marketing?.preferred_tools,
            brand_voice: project.metadata?.marketing?.brand_voice,
            inspiration_links: project.metadata?.marketing?.inspiration_links,
          })) || [];

      try {
        const bidsRes = await fetch('/api/db?table=project_bids', { cache: 'no-store' });
        const bidsJson = await bidsRes.json();
        const bidsData: Bid[] = bidsJson.data || [];

        const projectsWithBids = formattedProjects.map((p) => {
          const projectBids = bidsData.filter(
            (b: any) =>
              b.projectId === p.id &&
              (!p.auction_end || !b.createdAt || new Date(b.createdAt) <= new Date(p.auction_end))
          );
          const activeBid =
            projectBids.length > 0
              ? Math.min(...projectBids.map((b: any) => b.ratePerHour))
              : undefined;
          return {
            ...p,
            bidCount: projectBids.length,
            activeBid,
          };
        });
        setProjects(projectsWithBids);
      } catch (err) {
        console.error('Error loading bids for projects', err);
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBids = async () => {
      if (!selectedProject || !userId) {
        setBids([]);
        return;
      }
      try {
        const res = await fetch('/api/db?table=project_bids', { cache: 'no-store' });
        const json = await res.json();

        // All bids for the selected project
        const allProjectBids: Bid[] = (json.data || []).filter(
          (b: any) => b.projectId === selectedProject.id
        );

        // Current user's bids for the selected project
        const userBids = allProjectBids.filter((b: any) => b.professionalId === userId);
        setBids(userBids);

        // Valid bids within auction window (if auction_end is set)
        const validBids = allProjectBids.filter(
          (b: any) =>
            !selectedProject.auction_end ||
            !b.createdAt ||
            new Date(b.createdAt) <= new Date(selectedProject.auction_end!)
        );
        const activeBid =
          validBids.length > 0
            ? Math.min(...validBids.map((b: any) => b.ratePerHour))
            : undefined;

        // Update counts/active bid on the project list and the selected project
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id
              ? { ...p, bidCount: allProjectBids.length, activeBid }
              : p
          )
        );
        setSelectedProject((prev) =>
          prev ? { ...prev, bidCount: allProjectBids.length, activeBid } : prev
        );
      } catch (err) {
        console.error('Failed to load bids', err);
      }
    };
    loadBids();
  }, [selectedProject, userId]);

  const handleSubmitBid = async () => {
    if (!selectedProject || !userId || !bidValue) return;
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'project_bids',
          data: {
            projectId: selectedProject.id,
            professionalId: userId,
            ratePerHour: Number(bidValue),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit bid');

      toast.success('Bid submitted');
      const newBid: Bid | undefined = json.data?.[0];
      if (newBid) {
        setBids((prev) => [...prev, newBid]);
      }

      const bidRate = Number(bidValue);
      const newActiveBid =
        selectedProject.activeBid !== undefined
          ? Math.min(selectedProject.activeBid, bidRate)
          : bidRate;

      setBidValue('');
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                bidCount: (p.bidCount || 0) + 1,
                activeBid: newActiveBid,
              }
            : p
        )
      );
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              bidCount: (prev.bidCount || 0) + 1,
              activeBid: newActiveBid,
            }
          : prev
      );
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid');
    }
  };

  const activeBids = projects.filter((p) => p.status === 'open');
  const popularActiveBids = activeBids
    .filter((p) => (p.bidCount ?? 0) > 0)
    .sort((a, b) => (b.bidCount ?? 0) - (a.bidCount ?? 0))
    .slice(0, 3);
  const otherActiveBids = activeBids.filter(
    (p) => !popularActiveBids.some((pop) => pop.id === p.id)
  );

  const sortedOtherActiveBids = useMemo(() => {
    let baseSorted = [...otherActiveBids];
    if (sortKey === 'bid') {
      baseSorted.sort(
        (a, b) =>
          (startingBidsByExpertise[experienceBadgeMap[b.expertiseLevel] ?? b.expertiseLevel] ?? 0) -
          (startingBidsByExpertise[experienceBadgeMap[a.expertiseLevel] ?? a.expertiseLevel] ?? 0)
      );
    } else if (sortKey === 'expertise') {
      baseSorted.sort(
        (a, b) =>
          (expertiseOrder[experienceBadgeMap[b.expertiseLevel] ?? b.expertiseLevel] ?? 0) -
          (expertiseOrder[experienceBadgeMap[a.expertiseLevel] ?? a.expertiseLevel] ?? 0)
      );
    } else if (sortKey === 'deadline') {
      baseSorted.sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    }
    return baseSorted;
  }, [otherActiveBids, sortKey]);

  const displayActiveBids = [...popularActiveBids, ...sortedOtherActiveBids];
  const formatExpertise = (exp: string) => experienceBadgeMap[exp] ?? exp;
  const formatDueDate = (isoDate: string) =>
    format(new Date(isoDate), "MMM d, yyyy 'at' h:mm aa");
  const timeRemaining = (isoDate: string) =>
    formatDistanceToNow(new Date(isoDate), { addSuffix: true });

  if (loading) {
    return <div className="p-6 text-center">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div className="p-6 text-center">No projects available.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#2E3A8C] mb-6">Project Auctions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {popularActiveBids.map((project) => (
          <div
            key={project.id}
            className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-md border-gray-200"
            onClick={() => setSelectedProject(project)}
            style={{ borderColor: selectedProject?.id === project.id ? TEAL_HIGHLIGHT : undefined }}
          >
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm">{project.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              <span>{project.bidCount} bids</span> ·{' '}
              <span>
                Active bid: $
                {project.activeBid ??
                  startingBidsByExpertise[formatExpertise(project.expertiseLevel)]}
                /hr
              </span>{' '}
              · <span>{timeRemaining(project.deadline)}</span>
              <DurationBadge
                className="ml-2"
                estimatedHours={
                  calculateEstimatedHours({
                    budget: project.projectBudget,
                    expertiseLevel: formatExpertise(project.expertiseLevel),
                    title: project.title,
                  }) || undefined
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 md:w-[60%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2E3A8C]">Active Project Auctions</h2>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="border rounded p-2"
              aria-label="Sort projects"
            >
              <option value="bid">Sort by Starting Bid (High to Low)</option>
              <option value="expertise">Sort by Expertise Level</option>
              <option value="deadline">Sort by Time to Auction Complete</option>
            </select>
          </div>

          {displayActiveBids.map((project) => (
            <div
              key={project.id}
              className="border-2 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md border-gray-200"
              onClick={() => setSelectedProject(project)}
              style={{ borderColor: selectedProject?.id === project.id ? TEAL_HIGHLIGHT : undefined }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <p className="text-gray-700">{project.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Ends in {timeRemaining(project.deadline)}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`ml-4 px-3 py-1 text-xs ${
                    formatExpertise(project.expertiseLevel) === 'Expert'
                      ? 'bg-red-200 text-red-800'
                      : formatExpertise(project.expertiseLevel) === 'Pro Talent'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {formatExpertise(project.expertiseLevel)}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span>{project.bidCount} bids</span> ·{' '}
                <span>
                  Active bid: $
                  {project.activeBid ??
                    startingBidsByExpertise[formatExpertise(project.expertiseLevel)]}
                  /hr
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="bg-white rounded-lg shadow p-6 md:w-[40%]">
            <h2 className="text-2xl font-bold text-[#2E3A8C] mb-3">{selectedProject.title}</h2>
            <Badge
              variant="secondary"
              className={`mb-4 px-3 py-1 text-xs ${
                formatExpertise(selectedProject.expertiseLevel) === 'Expert'
                  ? 'bg-red-200 text-red-800'
                  : formatExpertise(selectedProject.expertiseLevel) === 'Pro Talent'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {formatExpertise(selectedProject.expertiseLevel)}
            </Badge>
            <p className="text-gray-700 mb-2">{selectedProject.description}</p>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>Due {formatDueDate(selectedProject.deadline)}</span>
