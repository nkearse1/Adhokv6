'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { 
  Users, 
  Briefcase, 
  Search as SearchIcon, 
  CheckCircle, 
  XCircle,
  Archive,
  RefreshCw,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  deadline: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      checkAdminAuth();
      fetchData();
    }
  }, [isLoaded, isSignedIn, user]);

  const checkAdminAuth = async () => {
    try {
      if (!user || user.publicMetadata?.role !== 'admin') {
        throw new Error('Not authorized');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('You are not authorized to access the admin panel');
      router.push('/');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // This would be replaced with a fetch to your API
      // For now, we'll use mock data
      const mockUsers = [
        {
          id: '1',
          full_name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          status: 'approved',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          full_name: 'Jessica Park',
          email: 'jessica.park@example.com',
          status: 'pending',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setUsers(mockUsers);
      
      const mockProjects = [
        {
          id: '1',
          title: 'E-commerce SEO Optimization',
          status: 'open',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Content Marketing Strategy',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    try {
      // This would be replaced with an API call
      // For now, we'll just update the local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleProjectStatusChange = async (projectId: string, newStatus: string) => {
    try {
      // This would be replaced with an API call
      // For now, we'll just update the local state
      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      ));
      
      toast.success(`Project ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const handleSearch = () => {
    // This would be replaced with an API call with search parameters
    // For now, we'll just filter the local state
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isSignedIn || !user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="p-6 text-center text-red-600">
        Unauthorized access. Admin privileges required.
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>
            <SearchIcon className="h-4 w-4 mr-1" />
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{user.full_name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={user.status === 'approved' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUserStatusChange(user.id, 'approved')}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUserStatusChange(user.id, 'suspended')}
                        className="flex items-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Suspend
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your search
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={project.status === 'open' ? 'secondary' : 'success'}>
                          {project.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleProjectStatusChange(project.id, 'archived')}
                        className="flex items-center gap-1"
                      >
                        <Archive className="h-4 w-4" />
                        Archive
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProjectStatusChange(project.id, 'open')}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reactivate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects found matching your search
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}