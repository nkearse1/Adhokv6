'use client';
import React, { useState, useMemo, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/lib/client/useAuthContext';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string;
  expertiseLevel: string;
  bidCount?: number;
  status?: string;
  category?: string;
  projectBudget?: number;
  overview?: string;
  deliverables?: string;
  target_audience?: string;
  platforms?: string;
  preferred_tools?: string;
  brand_voice?: string;
  inspiration_links?: string;
}

const isAuctionExpired = (end?: string | Date): boolean => {
  if (!end) return false;
  return new Date(end) < new Date();
};

const formatTimeRemaining = (end?: string | Date): string => {
  if (!end) return "Unknown";
  const now = new Date();
  const endDate = new Date(end);
  const ms = endDate.getTime() - now.getTime();
  if (ms <= 0) return "Auction ended";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m left`;
};

const expertiseOrder: Record<string, number> = {
  "Specialist": 1,
  "Pro Talent": 2,
  "Expert": 3,
};

const experienceBadgeMap: Record<string, string> = {
  "Entry Level": "Specialist",
  "Mid-Level": "Pro Talent",
  "Expert": "Expert",
};

const TEAL_HIGHLIGHT = "#00A499";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortKey, setSortKey] = useState<'bid' | 'expertise' | 'deadline'>('bid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/db?table=projects');
      const json = await res.json();
      if (!res.ok) {
        console.error('Error fetching projects:', json.error);
        toast.error('Failed to load projects');
        return;
      }

      let formattedProjects: Project[] = (json.data || [])
        .filter((p: any) => p.status === 'open')
        .map((project: any) => ({
          ...project,
          expertiseLevel: project.metadata?.marketing?.expertiseLevel || 'Mid-Level',
          bidCount: 0,
          overview: project.metadata?.marketing?.problem || project.description,
          deliverables: project.metadata?.marketing?.deliverables || 'To be defined',
          target_audience: project.metadata?.marketing?.target_audience || 'General audience',
          platforms: project.metadata?.marketing?.platforms || 'Various platforms',
          preferred_tools: project.metadata?.marketing?.preferred_tools || 'Standard tools',
          brand_voice: project.metadata?.marketing?.brand_voice || 'Professional',
          inspiration_links: project.metadata?.marketing?.inspiration_links || ''
        })) || [];

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async () => {
    if (!selectedProject || !userId || !bidAmount) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (new Date(selectedProject.deadline) < new Date()) {
      toast.error('Bidding has closed for this project');
      return;
    }

    const ratePerHour = parseFloat(bidAmount);
    if (isNaN(ratePerHour) || ratePerHour <= 0) {
      toast.error('Please enter a valid hourly rate');
      return;
    }

    setSubmittingBid(true);

    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'project_bids',
          data: {
            project_id: selectedProject.id,
            professional_id: userId,
            rate_per_hour: ratePerHour
          }
        })
      });

      if (!res.ok) {
        console.error('Error submitting bid');
        toast.error('Failed to submit bid');
        return;
      }

      toast.success('Bid submitted successfully!');
      setBidAmount('');
      fetchProjects();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const formatDueDate = (isoDate: string | Date) =>
    format(new Date(isoDate), "MMM d, yyyy 'at' h:mm aa");

  const timeRemaining = (isoDate: string | Date) =>
    formatDistanceToNow(new Date(isoDate), { addSuffix: true });

  const formatExpertise = (exp: string) => experienceBadgeMap[exp] ?? exp;

  const activeBids = projects.filter((p: Project) => p.status === 'open');
  const popularActiveBids = activeBids
    .filter((p: Project) => (p.bidCount ?? 0) > 0)
    .sort((a: Project, b: Project) => (b.bidCount ?? 0) - (a.bidCount ?? 0))
    .slice(0, 3);
  const otherActiveBids = activeBids.filter((p: Project) =>
    !popularActiveBids.some((pop) => pop.id === p.id)
  );

  const sortedOtherActiveBids = useMemo(() => {
    let baseSorted = [...otherActiveBids];
    if (sortKey === 'bid') {
      baseSorted.sort((a, b) => (b.projectBudget || 0) - (a.projectBudget || 0));
    } else if (sortKey === 'expertise') {
      baseSorted.sort((a, b) => (expertiseOrder[experienceBadgeMap[b.expertiseLevel] ?? b.expertiseLevel] ?? 0) - (expertiseOrder[experienceBadgeMap[a.expertiseLevel] ?? a.expertiseLevel] ?? 0));
    } else if (sortKey === 'deadline') {
      baseSorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }
    return baseSorted;
  }, [otherActiveBids, sortKey]);

  const displayActiveBids = [...popularActiveBids, ...sortedOtherActiveBids];
  const filteredProjects = displayActiveBids.filter(
    (p: Project) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return <ProjectList />;
}
