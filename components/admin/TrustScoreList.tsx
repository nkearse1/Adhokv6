'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, ArrowUpDown, AlertTriangle, CheckCircle, XCircle, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TalentTrustScore {
  id: string;
  fullName: string;
  username: string;
  trustScore: number | null;
  trustScoreUpdatedAt: string | null;
  isQualified: boolean;
}

export default function TrustScoreList() {
  const [talents, setTalents] = useState<TalentTrustScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'trustScore' | 'fullName' | 'updatedAt'>('trustScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTalentTrustScores();
  }, [sortField, sortDirection]);

  const fetchTalentTrustScores = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/db?table=talent_profiles');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Request failed');
      let data = json.data || [];

      if (searchQuery) {
        data = data.filter((t: any) =>
          t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.username || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      data.sort((a: any, b: any) => {
        const dir = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'updatedAt') {
          return (new Date(a.trustScoreUpdatedAt).getTime() - new Date(b.trustScoreUpdatedAt).getTime()) * dir;
        }
        if (sortField === 'fullName') {
          return a.fullName.localeCompare(b.fullName) * dir;
        }
        return ((a.trustScore ?? 0) - (b.trustScore ?? 0)) * dir;
      });

      setTalents(data);
    } catch (error) {
      console.error('Error fetching talent trust scores:', error);
      toast.error('Failed to load talent trust scores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTalentTrustScores();
  };

  const handleSort = (field: 'trustScore' | 'fullName' | 'updatedAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const updateTrustScore = async (talentId: string) => {
    try {
      setUpdatingId(talentId);
      const res = await fetch(`/api/talents/${talentId}/trust-score`, { method: 'POST' });
      if (!res.ok) throw new Error('Request failed');
      toast.success('Trust score updated successfully');
      fetchTalentTrustScores();
    } catch (error) {
      console.error('Error updating trust score:', error);
      toast.error('Failed to update trust score');
    } finally {
      setUpdatingId(null);
    }
  };

  const recalculateAllTrustScores = async () => {
    try {
      setUpdatingAll(true);
      const res = await fetch('/api/talents/recalculate-all', { method: 'POST' });
      if (!res.ok) throw new Error('Request failed');
      const { data } = await res.json();
      toast.success(`Recalculated ${data} trust scores`);
      fetchTalentTrustScores();
    } catch (error) {
      console.error('Error recalculating trust scores:', error);
      toast.error('Failed to recalculate trust scores');
    } finally {
      setUpdatingAll(false);
    }
  };

  const getTrustScoreBadge = (score: number | null) => {
    if (score === null) return null;
    if (score >= 80) return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
  };

  const viewTalentDetails = (talentId: string) => {
    router.push(`/admin/talent/${talentId}`);
  };

  if (loading && talents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C] mx-auto mb-4"></div>
        <p>Loading trust scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#2E3A8C]" />
          <h2 className="text-xl font-semibold">Talent Trust Scores</h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search talents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleSearch}
            className="shrink-0"
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
          <Button 
            onClick={recalculateAllTrustScores} 
            disabled={updatingAll}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${updatingAll ? 'animate-spin' : ''}`} />
            {updatingAll ? 'Updating...' : 'Update All'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-[#2E3A8C]"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center gap-1">
                    Talent
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-[#2E3A8C]"
                  onClick={() => handleSort('trustScore')}
                >
                  <div className="flex items-center gap-1">
                    Trust Score
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-[#2E3A8C]"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-1">
                    Last Updated
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {talents.map((talent) => (
                <TableRow key={talent.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{talent.fullName}</p>
                        <p className="text-sm text-gray-500">@{talent.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {talent.trustScore !== null ? (
                        <>
                          <span className={`font-bold ${
                            talent.trustScore >= 80 ? 'text-green-600' :
                            talent.trustScore >= 60 ? 'text-blue-600' :
                            talent.trustScore >= 40 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {talent.trustScore.toFixed(1)}
                          </span>
                          {getTrustScoreBadge(talent.trustScore)}
                        </>
                      ) : (
                        <span className="text-gray-500">Not calculated</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {talent.isQualified ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Qualified
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Unqualified
                        </Badge>
                      )}
                      {talent.trustScore !== null && talent.trustScore < 40 && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          PIP List
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {talent.trustScoreUpdatedAt ? (
                      new Date(talent.trustScoreUpdatedAt).toLocaleDateString()
                    ) : (
                      'Never'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTrustScore(talent.id)}
                        disabled={updatingId === talent.id}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${updatingId === talent.id ? 'animate-spin' : ''}`} />
                        {updatingId === talent.id ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewTalentDetails(talent.id)}
                        className="flex items-center gap-1"
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {talents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No talent profiles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

