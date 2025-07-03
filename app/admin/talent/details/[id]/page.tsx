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
import { useUser } from '@clerk/nextjs';
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
  trustScoreUpdatedAt?: string;
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
  const { user, isSignedIn, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingTrustScore, setUpdatingTrustScore] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && isAdmin && id) {
      fetchTalentDetails();
    }
  }, [isLoaded, isSignedIn, isAdmin, id]);

  const fetchTalentDetails = async () => {
    try {
      setLoading(true);
      
      // This would be replaced with a fetch to your API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockTalent: TalentProfile = {
          id,
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          username: 'alex_rivera',
          phone: '+1 (555) 123-4567',
          location: 'Austin, TX',
          linkedin: 'https://linkedin.com/in/alexrivera',
          portfolio: 'https://alexrivera.dev',
          bio: 'Senior SEO specialist with 8+ years of experience helping e-commerce brands achieve 200%+ organic traffic growth. Specialized in technical SEO, content strategy, and conversion optimization.',
          expertise: 'SEO & Content Strategy',
          experience_badge: 'Expert Talent',
          isQualified: true,
          qualification_reason: 'manual',
          qualification_history: [
            { reason: 'invited', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
            { reason: 'manual', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() }
          ],
          trust_score: 85,
          trustScoreUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          trust_score_factors: {
            completedProjects: 12,
            adminComplaints: 0,
            missedDeadlines: 1,
            positiveRatings: 10,
            responseTime: 2,
            clientRetention: 3
          }
        };

        mockTalent.qualification_history = sanitizeHistory(mockTalent.qualification_history);

        setTalent(mockTalent);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching talent details:', error);
      toast.error('Failed to load talent details');
      setLoading(false);
    }
  };

  const handleQualifyTalent = async (qualified: boolean) => {
    try {
      if (!talent) return;

      // This would be replaced with an API call
      // For now, we'll just update the local state
      const updatedTalent = {
        ...talent,
        isQualified: qualified,
        qualification_reason: 'manual',
        qualification_history: sanitizeHistory([
          ...(talent.qualification_history || []),
          { reason: 'manual', timestamp: new Date().toISOString() }
        ]),
      };
      
      setTalent(updatedTalent);
      toast.success(`Talent ${qualified ? 'qualified' : 'disqualified'} successfully`);
    } catch (error) {
      console.error('Error updating talent:', error);
      toast.error('Failed to update talent status');
    }
  };

  const handleFlagTalent = async () => {
    try {
      if (!talent) return;
      
      const reason = prompt('Please provide a reason for flagging this talent:');
      if (!reason) return;
      
      // This would be replaced with an API call
      toast.success('Talent flagged for review');
    } catch (error) {
      console.error('Error flagging talent:', error);
      toast.error('Failed to flag talent');
    }
  };

  const updateTrustScore = async () => {
    try {
      if (!talent) return;
      
      setUpdatingTrustScore(true);
      
      // This would be replaced with an API call
      // For now, we'll just update the local state after a delay
      setTimeout(() => {
        const updatedTalent = {
          ...talent,
          trust_score: Math.min(100, talent.trust_score! + 2),
          trustScoreUpdatedAt: new Date().toISOString(),
          trust_score_factors: {
            ...talent.trust_score_factors!,
            completedProjects: talent.trust_score_factors!.completedProjects + 1
          }
        };
        
        setTalent(updatedTalent);
        toast.success('Trust score updated successfully');
        setUpdatingTrustScore(false);
      }, 1500);
    } catch (error) {
      console.error('Error updating trust score:', error);
      toast.error('Failed to update trust score');
      setUpdatingTrustScore(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C] mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-600">Unauthorized access. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C] mx-auto mb-4"></div>
        <p>Loading talent details...</p>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-600">Talent not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2E3A8C]">{talent.full_name}</h1>
        <div className="space-x-2">
          {talent.isQualified ? (
            <Button
              variant="destructive"
              onClick={() => handleQualifyTalent(false)}
            >
              Disqualify
            </Button>
          ) : (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleQualifyTalent(true)}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Qualify
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={handleFlagTalent}
          >
            <Flag className="w-4 h-4 mr-1" /> Flag
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="trust">Trust Score</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
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
                        <a 
                          href={talent.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    
                    {talent.portfolio && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <a 
                          href={talent.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Portfolio Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Qualification Status</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={talent.isQualified ? "default" : "secondary"}>
                      {talent.isQualified ? "Qualified" : "Unqualified"}
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
        
        <TabsContent value="trust" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Trust Score Analysis</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={updateTrustScore}
              disabled={updatingTrustScore}
            >
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
            lastUpdated={talent.trustScoreUpdatedAt ?? 'N/A'}
          />
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Trust Score Explanation</h3>
              <p className="text-sm text-gray-700 mb-4">
                The trust score is calculated based on various factors including completed projects, 
                client ratings, response time, and platform behavior. Scores range from 0-100:
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <p><strong>80-100:</strong> Exceptional talent, highly trusted</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <p><strong>60-79:</strong> Good standing, reliable talent</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  <p><strong>40-59:</strong> Average standing, some concerns</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <p><strong>0-39:</strong> Poor standing, significant concerns</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Trust Score Impact:</strong> Talents with scores below 40 are automatically added to the Performance Improvement Plan (PIP) list and removed from auction marketing until their score improves.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="p-6">
               {talent?.qualification_history ? (
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