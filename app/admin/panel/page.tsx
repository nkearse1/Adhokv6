'use client';
import AdminClientList from '@/components/AdminClientList';
import AdminTalentList from '@/components/AdminTalentList';
import AdminLineChart from '@/components/AdminLineChart';
import ReviewList from '@/components/ReviewList';
import AdminProjectList from '@/components/AdminProjectList';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/db?table=project_reviews');
        const json = await res.json();
        if (res.ok) setReviews(json.data || []);
      } catch (err) {
        console.error('Error loading reviews', err);
      }
    }
    loadReviews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <AdminLineChart selectedMetrics={['totalProjects','estRevenue','activeTalent']} />
      <AdminProjectList />
      <AdminClientList />
      <AdminTalentList />
      <ReviewList reviews={reviews} />
    </div>
  );
}
