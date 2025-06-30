'use client';
import { useEffect, useState } from 'react';
import ExperienceBadge from '@/components/ExperienceBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const badgeRank: Record<string, number> = {
  'Expert Talent': 3,
  'Pro Talent': 2,
  'Specialist': 1,
  '': 0,
};

interface Project {
  id: string;
  title: string;
  minimum_badge?: string;
}

interface Bid {
  id: string;
  ratePerHour: number;
  name: string;
  badge: string;
  professional_id: string;
}

export default function BidFlow({ projectId, isAdmin = false }: { projectId: string; isAdmin?: boolean }) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [showAllBids, setShowAllBids] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/db?table=projects&id=${projectId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Request failed');
        const projectData = json.data?.[0];

        const bidsRes = await fetch('/api/db?table=project_bids');
        const bidsJson = await bidsRes.json();

        setProject(projectData);
        const bidList = (bidsJson.data || []).filter((b: any) => b.project_id === projectId);

        setBids(
          bidList.map((bid: any) => ({
            id: bid.id,
            ratePerHour: bid.rate_per_hour,
            name: bid.professional_id,
            badge: '',
            professional_id: bid.professional_id,
          }))
        );
      } catch (error) {
        console.error('Error fetching bids:', error);
        toast.error('Failed to load bids');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchBids();
    }
  }, [projectId]);

  const handlePickWinner = async (professionalId: string) => {
    try {
      const res = await fetch('/api/db', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'projects',
          id: project?.id,
          data: {
            winning_bid_id: professionalId,
            talent_id: professionalId,
            status: 'in_progress',
          },
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success('Winner selected');
    } catch (error) {
      console.error('Error selecting winner:', error);
      toast.error('Error selecting winner');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C]"></div>
      </div>
    );
  }

  if (!project) {
    return <p className="text-red-500">Project not found</p>;
  }

  const filteredBids = showAllBids
    ? bids
    : bids.filter(
        (bid) => badgeRank[bid.badge] >= badgeRank[project.minimum_badge || 'Specialist']
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Submitted Bids</h2>
        <Button onClick={() => setShowAllBids((prev) => !prev)} variant="outline">
          {showAllBids ? 'Hide Underqualified Bids' : 'Show All Bids'}
        </Button>
      </div>
      {filteredBids.map((bid) => (
        <div
          key={bid.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <div className="font-semibold">{bid.name}</div>
            <ExperienceBadge badge={bid.badge} />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Rate</div>
            <div className="font-bold text-lg">${bid.ratePerHour}/hr</div>
          </div>
          {isAdmin && (
            <Button onClick={() => handlePickWinner(bid.professional_id)}>
              Pick Winner
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
        </Button>
      </div>

      {filteredBids.length === 0 ? (
        <p className="text-gray-500">No bids meet the current qualification level</p>
      ) : (
        filteredBids.map((bid) => (
          <div key={bid.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{bid.name}</p>
              <ExperienceBadge badge={bid.badge} size="sm" showTooltip />
              {badgeRank[bid.badge] < badgeRank[project.minimum_badge || 'Specialist'] && (
                <p className="text-xs text-yellow-500 mt-1">Below project requirements</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">${bid.ratePerHour}/hr</p>
              {isAdmin && (
                <Button size="sm" onClick={() => handlePickWinner(bid.professional_id)}>
                  Mark as Winner
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}