'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { 
  BadgeCheck, CalendarIcon, Clock, FileText, Link as LinkIcon, Target, Users, 
  MessageSquare, Briefcase, User, Mail, MapPin, Phone, Building, Star,
  ArrowLeft, ExternalLink, Flag, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExperienceBadge from '@/components/ExperienceBadge';

export default function AdminProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [talent, setTalent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // This would be replaced with a fetch to your API
        // For now, we'll use mock data
        const mockProject = {
          id,
          title: 'E-commerce SEO Optimization',
          description: 'Comprehensive SEO audit and optimization for a growing e-commerce website selling sustainable products.',
          status: 'in_progress',
          category: 'SEO',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_hours: 40,
          hourly_rate: 75,
          flagged: false,
          metadata: {
            marketing: {
              problem: 'Low organic search visibility and poor technical SEO performance affecting customer acquisition',
              deliverables: 'Technical SEO audit, keyword strategy, content optimization plan, performance tracking setup',
              target_audience: 'E-commerce shoppers interested in sustainable products',
              platforms: 'Shopify, Google Search Console, Google Analytics 4',
              preferred_tools: 'Ahrefs, Screaming Frog, Surfer SEO',
              brand_voice: 'Professional yet approachable, sustainability-focused',
              inspiration_links: 'https://patagonia.com, https://allbirds.com'
            },
            requestor: {
              name: 'Sarah Johnson',
              company: 'EcoShop Inc.',
              email: 'sarah.johnson@example.com',
              phone: '+1 (555) 111-2222'
            }
          },
          minimum_badge: 'Expert Talent'
        };
        
        setProject(mockProject);
        
        // Mock client data
        const mockClient = {
          id: 'client123',
          full_name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          company: 'EcoShop Inc.',
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          total_projects: 3,
          total_spent: 8500,
          average_rating: 4.8,
          verified: true
        };
        
        setClient(mockClient);
        
        // Mock talent data
        const mockTalent = {
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          experience_badge: 'Expert Talent',
          expertise: 'SEO & Content Strategy',
          location: 'Austin, TX',
          phone: '+1 (555) 123-4567',
          linkedin: 'https://linkedin.com/in/alexrivera',
          portfolio: 'https://alexrivera.dev',
          bio: 'Senior SEO specialist with 8+ years of experience helping e-commerce brands achieve 200%+ organic traffic growth.',
          is_qualified: true,
          created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          total_projects: 12,
          success_rate: 95,
          average_rating: 4.9,
          response_time: '2h',
          total_earnings: 45000,
          hourly_rate: 75
        };
        
        setTalent(mockTalent);
        
        // Mock reviews
        const mockReviews = [
          {
            id: 'review1',
            rating: 5,
            comment: 'Alex did an outstanding job on our SEO strategy. We\'ve seen a 40% increase in organic traffic within just 2 months of implementing his recommendations.',
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            reviewer: { full_name: 'Michael Chen' },
            project_title: 'B2B SaaS SEO Strategy'
          },
          {
            id: 'review2',
            rating: 4,
            comment: 'Great work on our technical SEO audit. Very thorough and provided actionable recommendations that were easy to implement.',
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            reviewer: { full_name: 'Emily Rodriguez' },
            project_title: 'E-commerce Technical SEO'
          }
        ];
        
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleFlagProject = async () => {
    const reason = prompt('Please provide a reason for flagging this project:');
    if (!reason) return;

    try {
      // This would be replaced with an API call
      // For now, we'll just update the local state
      setProject({ ...project, flagged: true });
      toast.success('Project flagged for review');
    } catch (error) {
      console.error('Error flagging project:', error);
      toast.error('Failed to flag project');
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      // This would be replaced with an API call
      // For now, we'll just update the local state
      setProject({ ...project, status: newStatus });
      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E3A8C]"></div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="p-6 text-center text-red-600">
        Unauthorized access. Admin privileges required.
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-600">
        Project not found.
      </div>
    );
  }

  const totalBudget = project.estimated_hours * project.hourly_rate;
  const talentEarnings = totalBudget * 0.85; // 85% to talent
  const platformFee = totalBudget * 0.15; // 15% platform fee
  const m = project.metadata?.marketing || {};
  const r = project.metadata?.requestor || {};

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-3xl font-bold text-[#2E3A8C]">{project.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {project.category}
              </Badge>
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Clock className="w-4 h-4 mr-1" />
                )}
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              {project.flagged && (
                <Badge variant="destructive">
                  <Flag className="w-4 h-4 mr-1" />
                  Flagged
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleFlagProject}
            disabled={project.flagged}
            className="flex items-center gap-2"
          >
            <Flag className="h-4 w-4" />
            {project.flagged ? 'Flagged' : 'Flag Project'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus('cancelled')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
            Cancel Project
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Project Overview
              </h3>
              <div className="space-y-4 text-sm">
                <p><strong>Description:</strong> {project.description}</p>
                <p><strong>Problem Statement:</strong> {m.problem}</p>
                <p><strong>Deliverables:</strong> {m.deliverables}</p>
                <p><strong>Target Audience:</strong> {m.target_audience}</p>
                <p><strong>Platforms:</strong> {m.platforms}</p>
                <p><strong>Preferred Tools:</strong> {m.preferred_tools}</p>
                <p><strong>Brand Voice:</strong> {m.brand_voice}</p>
                {project.brief_url && (
                  <p>
                    <a
                      href={project.brief_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Project Brief
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Financial Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span className="font-medium">${project.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Hours:</span>
                  <span className="font-medium">{project.estimated_hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Budget:</span>
                  <span className="font-medium">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Talent Earnings (85%):</span>
                  <span className="font-medium">${talentEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Platform Fee (15%):</span>
                  <span className="font-medium">${platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Minimum Badge:</span>
                    <ExperienceBadge level={project.minimum_badge} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="stakeholders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="talent-details">Talent Profile</TabsTrigger>
          <TabsTrigger value="client-details">Client Profile</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="stakeholders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Client Information
                </h3>
                {client ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{client.full_name}</p>
                        <p className="text-sm text-gray-600">{client.company}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                          {client.email}
                        </a>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{client.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Projects</p>
                          <p className="font-medium">{client.total_projects || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Spent</p>
                          <p className="font-medium">${(client.total_spent || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No client information available</p>
                )}
              </CardContent>
            </Card>

            {/* Talent Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Talent Information
                </h3>
                {talent ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{talent.full_name}</p>
                        <ExperienceBadge level={talent.experience_badge} />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${talent.email}`} className="text-blue-600 hover:underline">
                          {talent.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{talent.expertise}</span>
                      </div>
                      {talent.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{talent.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-medium">{talent.success_rate || 'N/A'}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Rating</p>
                          <p className="font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {talent.average_rating || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No talent assigned</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="talent-details">
          {talent ? (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Professional Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Bio</h4>
                        <p className="text-sm text-gray-700">{talent.bio}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expertise</h4>
                        <p className="text-sm text-gray-700">{talent.expertise}</p>
                      </div>
                      <div className="flex gap-4">
                        {talent.linkedin && (
                          <a
                            href={talent.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                          >
                            <LinkIcon className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                        {talent.portfolio && (
                          <a
                            href={talent.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Projects</p>
                          <p className="font-medium text-lg">{talent.total_projects || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-medium text-lg text-green-600">{talent.success_rate || 0}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Rating</p>
                          <p className="font-medium text-lg flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {talent.average_rating || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time</p>
                          <p className="font-medium text-lg">{talent.response_time || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Earnings:</span>
                            <span className="font-medium">${(talent.total_earnings || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hourly Rate:</span>
                            <span className="font-medium">${talent.hourly_rate || 0}/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No talent assigned to this project
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="client-details">
          {client ? (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Client Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{client.full_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Company</p>
                          <p className="font-medium">{client.company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{client.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{client.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{client.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="font-medium">
                            {new Date(client.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Client History</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Projects</p>
                          <p className="font-medium text-lg">{client.total_projects || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Spent</p>
                          <p className="font-medium text-lg">${(client.total_spent || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Rating Given</p>
                          <p className="font-medium text-lg flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {client.average_rating || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account Status</p>
                          <p className="font-medium text-lg text-green-600">
                            {client.verified ? 'Verified' : 'Unverified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No client information available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{review.reviewer.full_name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {review.project_title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No reviews available for this talent
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
