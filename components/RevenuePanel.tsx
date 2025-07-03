'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  CreditCard,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";


export default function RevenuePanel() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [escrow, setEscrow] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bidFilter, setBidFilter] = useState("all");
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");

  useEffect(() => {
    async function loadProjects() {
      const res = await fetch('/api/db?table=projects');
      const json = await res.json();
      if (res.ok) {
        setProjects(json.data || []);
      } else {
        console.error('Error loading projects', json.error);
      }
    }

    async function loadEscrow() {
       const res = await fetch('/api/db?table=escrow_transactions');
      const json = await res.json();
      if (res.ok) {
        setEscrow(json.data || []);
      } else {
        console.error('Error loading escrow records', json.error);
      }
    }

    loadProjects();
    loadEscrow();
  }, []);

  const totalRevenue = projects.reduce((sum, project) => sum + (project.metadata?.marketing?.budget || 0), 0);
  const totalPlatformRevenue = totalRevenue * 0.1;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesBids = bidFilter === "all" ||
      (bidFilter === "0" && (project.project_bids?.length || 0) === 0) ||
      (bidFilter === "1+" && (project.project_bids?.length || 0) > 0);
    const budget = project.metadata?.marketing?.budget || 0;
    const matchesRevenue = revenueFilter === "all" ||
      (revenueFilter === "low" && budget < 2000) ||
      (revenueFilter === "med" && budget >= 2000 && budget <= 4000) ||
      (revenueFilter === "high" && budget > 4000);
    const matchesDeadline = deadlineFilter === "all" ||
      (deadlineFilter === "past" && new Date(project.deadline) < new Date()) ||
      (deadlineFilter === "future" && new Date(project.deadline) >= new Date());
    return matchesSearch && matchesStatus && matchesBids && matchesRevenue && matchesDeadline;
  });

  const getProjectTitle = (id: string) => {
    return projects.find(p => p.id === id)?.title || id;
  };

  const filteredEscrow = escrow.filter((e) => e.status === 'requested');

  return (
    <Tabs defaultValue="revenue" className="space-y-6">
      <TabsList>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="escrow">Escrow</TabsTrigger>
      </TabsList>
      <TabsContent value="revenue">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Total Platform Revenue</h2>
              <span className="text-xl font-bold text-green-600">${totalPlatformRevenue.toLocaleString()}</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category_id}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${project.metadata?.marketing?.budget?.toLocaleString() || 0}</TableCell>
                    <TableCell>{new Date(project.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="escrow">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Escrow Queue</h2>
              <span className="text-sm text-gray-500">Live escrow status per project</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Released</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEscrow.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{getProjectTitle(e.project_id)}</TableCell>
                    <TableCell>
                      <Badge variant={e.status === 'approved' ? 'default' : e.status === 'requested' ? 'secondary' : 'outline'}>
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{e.released_at ? new Date(e.releasedAt).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/admin/projects/${e.project_id}`)}>
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
