export interface MockUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'client' | 'talent' | 'admin';
  badge?: string;
  expertise?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'recommended' | 'scoped' | 'in_progress' | 'approved' | 'performance_tracking';
  estimatedHours: number;
  actualHours: number;
}

export interface MockBid {
  id: string;
  projectId: string;
  userId: string;
  ratePerHour: number;
}

export interface MockProject {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  deadline: string;
  projectBudget: number;
  hourlyRate: number;
  client: MockUser;
  talent?: MockUser;
  deliverables: Deliverable[];
  bids?: MockBid[];
}

export const mockClient: MockUser = {
  id: 'client-001',
  username: 'sarah_johnson',
  fullName: 'Sarah Johnson',
  email: 'client1@example.com',
  role: 'client'
};

export const mockTalent: MockUser = {
  id: 'talent-001',
  username: 'alex_rivera',
  fullName: 'Alex Rivera',
  email: 'talent1@example.com',
  role: 'talent',
  badge: 'Expert Talent',
  expertise: 'SEO & Content Strategy'
};

export const mockProjects: MockProject[] = [
  {
    id: 'proj-1',
    title: 'E-commerce SEO Optimization',
    description: 'Comprehensive SEO audit and optimization for a growing e-commerce website.',
    status: 'in_progress',
    category: 'SEO',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    projectBudget: 3500,
    hourlyRate: 75,
    client: mockClient,
    talent: mockTalent,
    deliverables: [
      {
        id: 'd1',
        title: 'Technical SEO Audit',
        description: 'Identify crawlability and indexation issues.',
        status: 'in_progress',
        estimatedHours: 8,
        actualHours: 4
      },
      {
        id: 'd2',
        title: 'Keyword Strategy',
        description: 'Develop comprehensive keyword targeting plan.',
        status: 'recommended',
        estimatedHours: 6,
        actualHours: 0
      }
    ],
    bids: [
      {
        id: 'bid1',
        projectId: 'proj-1',
        userId: mockTalent.id,
        ratePerHour: 72
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Social Media Campaign Launch',
    description: 'Create and launch a targeted social media campaign.',
    status: 'open',
    category: 'Social Media',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    projectBudget: 2800,
    hourlyRate: 60,
    client: {
      id: 'client-002',
      username: 'michael_chen',
      fullName: 'Michael Chen',
      email: 'client2@example.com',
      role: 'client'
    },
    deliverables: [],
    bids: []
  }
];

export function getProjectById(id: string): MockProject | undefined {
  return mockProjects.find(p => p.id === id);
}
