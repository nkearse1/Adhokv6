'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';

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
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [sortKey, setSortKey] = useState('bid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
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

      let formattedProjects = (json.data || []).filter(p => p.status === 'open').map(project => ({
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

  const formatExpertise = (exp: string) => experienceBadgeMap[exp] ?? exp;
  const formatDueDate = (isoDate: string | Date) =>
    format(new Date(isoDate), "MMM d, yyyy 'at' h:mm aa");
  const timeRemaining = (isoDate: string | Date) =>
    formatDistanceToNow(new Date(isoDate), { addSuffix: true });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2E3A8C] mb-6">Project Auctions</h1>

      {popularActiveBids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {popularActiveBids.map((project: any) => (
            <div
              key={project.id}
              className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${selectedProject?.id === project.id ? `border-[${TEAL_HIGHLIGHT}]` : 'border-gray-200'}`}
              onClick={() => setSelectedProject(project)}
              style={{ borderColor: selectedProject?.id === project.id ? TEAL_HIGHLIGHT : undefined }}
            >
              <h3 className="text-lg font-semibold mb-2 break-words">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{project.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <span>{project.bidCount} bids</span> &middot; <span>Budget: ${project.projectBudget?.toLocaleString()}</span> &middot; <span>{timeRemaining(project.deadline)}</span>
              </div>
              <Badge variant="outline" className="text-xs mt-2">{project.category}</Badge>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:w-[60%]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2E3A8C]">Active Project Auctions</h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value)
                }
                className="border rounded p-2 text-sm"
              >
                <option value="All">All Categories</option>
                <option value="SEO">SEO</option>
                <option value="Paid Search">Paid Search</option>
                <option value="UX Design">UX Design</option>
                <option value="Analytics">Analytics</option>
              </select>
              <select
                value={sortKey}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortKey(e.target.value)
                }
                className="border rounded p-2 text-sm"
              >
                <option value="bid">Sort by Budget (High to Low)</option>
                <option value="expertise">Sort by Expertise Level</option>
                <option value="deadline">Sort by Deadline</option>
              </select>
            </div>
          </div>

          {filteredProjects.map((project: any) => (
            <div
              key={project.id}
              className={`border-2 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-all ${selectedProject?.id === project.id ? `border-[${TEAL_HIGHLIGHT}]` : 'border-gray-200'}`}
              onClick={() => setSelectedProject(project)}
              style={{ borderColor: selectedProject?.id === project.id ? TEAL_HIGHLIGHT : undefined }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold break-words">{project.title}</h2>
                  <p className="text-gray-700">{project.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Ends in {timeRemaining(project.deadline)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant="outline" className="text-xs">{project.category}</Badge>
                  <Badge
                    variant="secondary"
                    className={`px-3 py-1 text-xs ${
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
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span>{project.bidCount} bids</span> &middot; <span>Budget: ${project.projectBudget?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:w-[40%]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2E3A8C] mb-3 break-words">{selectedProject.title}</h2>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Due {formatDueDate(selectedProject.deadline)}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                Ends in {timeRemaining(selectedProject.deadline)}
              </span>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <span className="text-sm text-gray-700">
                Project Budget: ${selectedProject.projectBudget?.toLocaleString()}
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="Your hourly rate"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={bidAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBidAmount(e.target.value)
                  }
                  min={0}
                />
                <Button 
                  className="bg-[#2E3A8C] hover:bg-[#1B276F] text-white"
                  onClick={handleSubmitBid}
                  disabled={submittingBid || !bidAmount}
                >
                  {submittingBid ? 'Submitting...' : 'Submit Bid →'}
                </Button>
              </div>
            </div>
            <div className="text-sm space-y-2">
              {selectedProject.overview && <p><strong>Overview:</strong> {selectedProject.overview}</p>}
              {selectedProject.deliverables && <p><strong>Deliverables:</strong> {selectedProject.deliverables}</p>}
              {selectedProject.target_audience && <p><strong>Target Audience:</strong> {selectedProject.target_audience}</p>}
              {selectedProject.platforms && <p><strong>Platforms:</strong> {selectedProject.platforms}</p>}
              {selectedProject.preferred_tools && <p><strong>Preferred Tools:</strong> {selectedProject.preferred_tools}</p>}
              {selectedProject.brand_voice && <p><strong>Brand Voice:</strong> {selectedProject.brand_voice}</p>}
              {selectedProject.inspiration_links && <p><strong>Inspiration:</strong> {selectedProject.inspiration_links}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}