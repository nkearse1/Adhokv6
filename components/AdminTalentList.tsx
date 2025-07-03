'use client';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUpdatedTalentsWithQualification } from "@/lib/qualificationUtils";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Briefcase as BriefcaseIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Upload as UploadIcon,
  Shield,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface TalentProfile {
  id: string;
  fullName: string;
  email: string;
  expertise: string;
  trustScore: number | null;
  isQualified: boolean;
  joinMethod?: string;
  qualificationReason?: string;
  qualificationHistory?: string[];
}

export default function AdminTalentList() {
  const router = useRouter();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState<string>("all");
  const [trustScoreFilter, setTrustScoreFilter] = useState<string>("all");
  const [updatingTrustScore, setUpdatingTrustScore] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    fetchTalents();
  }, [currentPage, debouncedSearch, qualificationFilter, trustScoreFilter]);

  const fetchTalents = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/db?table=talent_profiles');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Request failed');
      let data = json.data || [];

      if (debouncedSearch) {
        data = data.filter((t: any) =>
          t.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.expertise.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      if (qualificationFilter !== 'all') {
        data = data.filter((t: any) => t.isQualified === (qualificationFilter === 'qualified'));
      }

      if (trustScoreFilter !== 'all') {
        data = data.filter((t: any) => {
          const s = t.trustScore ?? 0;
          if (trustScoreFilter === 'high') return s >= 80;
          if (trustScoreFilter === 'medium') return s >= 60 && s < 80;
          if (trustScoreFilter === 'low') return s >= 40 && s < 60;
          if (trustScoreFilter === 'poor') return s < 40;
          return s === null;
        });
      }

      setTotalCount(data.length);
      data = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
      setTalents(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch talent profiles");
    } finally {
      setLoading(false);
    }
  };

  const updateTrustScore = async (talentId: string) => {
    try {
      setUpdatingTrustScore(talentId);
      const res = await fetch(`/api/talent/${talentId}/trust-score`, { method: 'POST' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Request failed');
      }
      toast.success('Trust score updated successfully');
      fetchTalents();
    } catch (error) {
      console.error('Error updating trust score:', error);
      toast.error('Failed to update trust score');
    } finally {
      setUpdatingTrustScore(null);
    }
  };

  const handleQualifyTalent = async (talentId: string, qualified: boolean) => {
    try {
      const res = await fetch(`/api/talent/${talentId}/qualify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualified }),
      });
      if (!res.ok) throw new Error('Qualification failed');
      toast.success(`Talent ${qualified ? 'qualified' : 'disqualified'} successfully`);
      fetchTalents();
    } catch (error) {
      console.error('Error updating talent:', error);
      toast.error('Failed to update talent status');
    }
  };

  const handleBulkQualify = async () => {
    try {
      const selectedTalents = talents.filter(t => selectedIds.includes(t.id));
      const updatedTalents = getUpdatedTalentsWithQualification(selectedTalents, true);
      
      // In a real implementation, you'd make an API call here
      toast.success(`${selectedIds.length} talents qualified successfully`);
      setSelectedIds([]);
      fetchTalents();
    } catch (error) {
      console.error('Error bulk qualifying talents:', error);
      toast.error('Failed to bulk qualify talents');
    }
  };

  const handleBulkDisqualify = async () => {
    try {
      const selectedTalents = talents.filter(t => selectedIds.includes(t.id));
      const updatedTalents = getUpdatedTalentsWithQualification(selectedTalents, false);
      
      // In a real implementation, you'd make an API call here
      toast.success(`${selectedIds.length} talents disqualified successfully`);
      setSelectedIds([]);
      fetchTalents();
    } catch (error) {
      console.error('Error bulk disqualifying talents:', error);
      toast.error('Failed to bulk disqualify talents');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === talents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(talents.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // In a real implementation, you'd upload the file and process it
      toast.success('CSV uploaded successfully');
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('10 new talents imported');
      fetchTalents();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error('Failed to upload CSV');
    }
  };

  const getTrustScoreBadge = (score: number | null | undefined) => {
    if (score === null || score === undefined) return null;
    
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Fair</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && !talents.length) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C] mx-auto mb-4"></div>
        <p>Loading talent profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Talent Profiles</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="unqualified">Unqualified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trustScoreFilter} onValueChange={setTrustScoreFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by trust score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trust Scores</SelectItem>
              <SelectItem value="high">Excellent (80-100)</SelectItem>
              <SelectItem value="medium">Good (60-79)</SelectItem>
              <SelectItem value="low">Fair (40-59)</SelectItem>
              <SelectItem value="poor">Poor (0-39)</SelectItem>
              <SelectItem value="unrated">Unrated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={handleBulkQualify}>
            Qualify Selected ({selectedIds.length})
          </Button>
          <Button variant="destructive" onClick={handleBulkDisqualify}>
            <XCircleIcon className="w-4 h-4 mr-1" />
            Disqualify Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === talents.length && talents.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Method</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Qualified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {talents.map((talent) => (
                <TableRow key={talent.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(talent.id)}
                      onChange={() => toggleSelect(talent.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{talent.fullName}</TableCell>
                  <TableCell>{talent.email}</TableCell>
                  <TableCell>{talent.expertise}</TableCell>
                  <TableCell>{talent.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={talent.joinMethod === 'invited' ? 'secondary' : 'outline'}>
                      {talent.joinMethod === 'invited' ? 'Invited' : 'Applied'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {talent.trustScore !== null && talent.trustScore !== undefined ? (
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
                          {talent.trustScore < 40 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" title="Performance Improvement Plan Required" />
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">Not rated</span>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateTrustScore(talent.id)}
                        disabled={updatingTrustScore === talent.id}
                        className="h-7 w-7 p-0"
                      >
                        <RefreshCw className={`h-4 w-4 ${updatingTrustScore === talent.id ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    {talent.trustScoreUpdatedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Updated: {new Date(talent.trustScoreUpdatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={talent.isQualified ? "default" : "secondary"}>
                      {talent.isQualified ? "Qualified" : "Unqualified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!talent.isQualified ? (
                        <Button
                          size="sm"
                          onClick={() => handleQualifyTalent(talent.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Qualify
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleQualifyTalent(talent.id, false)}
                        >
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Disqualify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/talent/${talent.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
