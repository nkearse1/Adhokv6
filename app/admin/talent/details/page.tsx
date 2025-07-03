'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Flag, RefreshCw, User, Mail, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import TrustScoreCard from '@/components/admin/TrustScoreCard';
import { useAuth } from '@/lib/useAuth';
import QualificationHistoryTimeline, { type QualificationEntry } from '@/components/QualificationHistoryTimeline';

interface TalentProfile {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  bio: string;
  expertise: string;
  experience_badge: string;
  isQualified: boolean;
  qualification_reason?: string;
  qualification_history?: QualificationEntry[];
  trust_score?: number;
  trust_score_updated_at?: string;
  trust_score_factors?: {
    completedProjects: number;
    adminComplaints: number;
    missedDeadlines: number;
    positiveRatings: number;
    responseTime: number;
    clientRetention: number;
  };
}

const allowedReasons = ['manual', 'invited', 'resume_match'] as const;
type AllowedReason = (typeof allowedReasons)[number];

function sanitizeHistory(history: any): QualificationEntry[] {
  try {
    const parsed = typeof history === 'string' ? JSON.parse(history) : history;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((h: any) => ({
      reason: allowedReasons.includes(h.reason) ? (h.reason as AllowedReason) : 'manual',
      timestamp: h.timestamp,
    }));
  } catch {
    return [];
  }
}

export default function AdminTalentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAdmin } = useAuth();
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingTrustScore, setUpdatingTrustScore] = useState(false);

  useEffect(() => {
    if (id) fetchTalentDetails();
  }, [id]);

  const fetchTalentDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/talent/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      const data = json.data;
      if (data) {
        data.qualification_history = sanitizeHistory(data.qualification_history);
      }
      setTalent(data);
    } catch (error) {
      console.error('Error fetching talent details:', error);
      toast.error('Failed to load talent details');
    } finally {
      setLoading(false);
    }
  };

  const handleQualifyTalent = async (qualified: boolean) => {
    if (!talent) return;
    try {
      const res = await fetch(`/api/talent/${talent.id}/qualify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualified }),
      });
      if (!res.ok) throw new Error('Qualification failed');
      const updated = await res.json();
      setTalent(updated.data);
      toast.success(`Talent ${qualified ? 'qualified' : 'disqualified'} successfully`);
    } catch (error) {
      console.error('Error updating talent:', error);
      toast.error('Failed to update talent status');
    }
  };

  const handleFlagTalent = async () => {
    if (!talent) return;
    const reason = prompt('Please provide a reason for flagging this talent:');
    if (!reason) return;
    try {
      const res = await fetch(`/api/talent/${talent.id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Flagging failed');
      toast.success('Talent flagged for review');
    } catch (error) {
      console.error('Error flagging talent:', error);
      toast.error('Failed to flag talent');
    }
  };

  const updateTrustScore = async () => {
    if (!talent) return;
    try {
      setUpdatingTrustScore(true);
      const res = await fetch(`/api/talent/${talent.id}/trust-score`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update score');
      setTalent(json.data);
      toast.success('Trust score updated successfully');
    } catch (error) {
      console.error('Error updating trust score:', error);
      toast.error('Failed to update trust score');
    } finally {
      setUpdatingTrustScore(false);
    }
  };

  if (!isAdmin) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-red-600">Unauthorized access. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-center">Loading talent details...</div>;
  }

  if (!talent) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-red-600">Talent not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2E3A8C]">{talent.full_name}</h1>
        <div className="space-x-2">
          {talent.isQualified ? (
            <Button variant="destructive" onClick={() => handleQualifyTalent(false)}>Disqualify</Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleQualifyTalent(true)}>
              <CheckCircle className="w-4 h-4 mr-1" /> Qualify
            </Button>
          )}
          <Button variant="destructive" onClick={handleFlagTalent}><Flag className="w-4 h-4 mr-1" /> Flag</Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trust">Trust Score</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <TabsContent value="profile" className="space-y-4">
  <Card>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{talent.full_name}</p>
              <p className="text-sm text-gray-600">@{talent.username}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${talent.email}`} className="text-blue-600 hover:underline">
                {talent.email}
              </a>
            </div>

            {talent.phone && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{talent.phone}</span>
              </div>
            )}

            {talent.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{talent.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{talent.expertise}</span>
            </div>

            {talent.linkedin && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <a href={talent.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn Profile
                </a>
              </div>
            )}

            {talent.portfolio && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <a href={talent.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Qualification Status</h3>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={talent.isQualified ? 'default' : 'secondary'}>
              {talent.isQualified ? 'Qualified' : 'Unqualified'}
            </Badge>
            <Badge variant="outline">{talent.experience_badge}</Badge>
          </div>

          <h3 className="font-semibold mb-2">Bio</h3>
          <p className="text-sm text-gray-700">{talent.bio}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>
        </TabsContent>

        <TabsContent value="trust" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Trust Score Analysis</h2>
            <Button variant="outline" size="sm" onClick={updateTrustScore} disabled={updatingTrustScore}>
              <RefreshCw className={`w-4 h-4 mr-1 ${updatingTrustScore ? 'animate-spin' : ''}`} />
              {updatingTrustScore ? 'Updating...' : 'Recalculate'}
            </Button>
          </div>
          <TrustScoreCard
            score={talent.trust_score ?? 50}
            factors={talent.trust_score_factors ?? {
              completedProjects: 0,
              adminComplaints: 0,
              missedDeadlines: 0,
              positiveRatings: 0,
              responseTime: 0,
              clientRetention: 0
            }}
            lastUpdated={talent.trust_score_updated_at ?? 'N/A'}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {talent?.qualification_history?.length ? (
                <QualificationHistoryTimeline history={talent.qualification_history} />
              ) : (
                <p className="text-sm text-gray-500">No qualification history available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}