'use client';
import AdminClientList from '@/components/AdminClientList';
import AdminTalentList from '@/components/AdminTalentList';
import AdminLineChart from '@/components/AdminLineChart';
import ReviewList from '@/components/ReviewList';

export default function AdminPanel() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <AdminLineChart selectedMetrics={['totalProjects']} />
      <AdminClientList />
      <AdminTalentList />
      <ReviewList reviews={[]} />
    </div>
  );
}
