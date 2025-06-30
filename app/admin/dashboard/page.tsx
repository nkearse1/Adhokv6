'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import AdminTalentList from '@/components/AdminTalentList';
import AdminProjectList from '@/components/AdminProjectList';
import RevenuePanel from '@/components/RevenuePanel';
import AdminClientList from '@/components/AdminClientList';
import AdminAlerts from '@/components/AdminAlerts';
import AdminLineChart from '@/components/AdminLineChart';
import { Briefcase, DollarSign, Users, Flag, Shield, ThumbsDown } from 'lucide-react';

interface DashboardMetrics {
  totalProjects: number;
  activeTalents: number;
  flaggedProjects: number;
  estRevenue: number;
  revPerTalent: number;
  negReviews: number;
  lowTrustTalents: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    activeTalents: 0,
    flaggedProjects: 0,
    estRevenue: 0,
    revPerTalent: 0,
    negReviews: 0,
    lowTrustTalents: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      fetchDashboardMetrics();
    }
  }, [isSignedIn, isAdmin]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);

      // This would be replaced with a fetch to your API
      // For now, we'll use mock data
      setTimeout(() => {
        setMetrics({
          totalProjects: 42,
          activeTalents: 18,
          flaggedProjects: 3,
          estRevenue: 15750,
          revPerTalent: 875,
          negReviews: 2,
          lowTrustTalents: 1
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      toast.error('Failed to load dashboard metrics');
      setLoading(false);
    }
  };

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center">
        <p className="text-red-600">Unauthorized access. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      key: 'totalProjects',
      label: 'Total Projects',
      value: metrics.totalProjects,
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
    },
    {
      key: 'activeTalents',
      label: 'Active Talents',
      value: metrics.activeTalents,
      icon: <Users className="h-6 w-6 text-green-600" />,
    },
    {
      key: 'estRevenue',
      label: 'Platform Revenue',
      value: `$${metrics.estRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
    },
    {
      key: 'flaggedProjects',
      label: 'Flagged Projects',
      value: metrics.flaggedProjects,
      icon: <Flag className="h-6 w-6 text-red-600" />,
    },
    {
      key: 'lowTrustTalents',
      label: 'Low Trust Talents',
      value: metrics.lowTrustTalents,
      icon: <Shield className="h-6 w-6 text-purple-600" />,
    },
    {
      key: 'negReviews',
      label: 'Negative Reviews',
      value: metrics.negReviews,
      icon: <ThumbsDown className="h-6 w-6 text-pink-600" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2E3A8C]">Admin Dashboard</h1>
        <Button className="w-full sm:w-auto" onClick={() => setActiveTab('projects')}>
          Manage Projects
        </Button>
      </div>

      <div className="mb-6">
        <AdminLineChart selectedMetrics={['totalProjects', 'estRevenue', 'activeTalent']} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="talent">Talent</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <AdminAlerts />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenuePanel />
        </TabsContent>

        <TabsContent value="talent">
          <AdminTalentList />
        </TabsContent>

        <TabsContent value="clients">
          <AdminClientList />
        </TabsContent>

        <TabsContent value="projects">
          <AdminProjectList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
