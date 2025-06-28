import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  period: string;
  totalProjects: number;
  estRevenue: number;
  activeTalent: number;
  revenuePerTalent: number;
  flaggedProjects: number;
  negativeReviews: number;
}

interface AdminLineChartProps {
  selectedMetrics: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`${label} 2024`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${
              entry.dataKey === 'estRevenue' || entry.dataKey === 'revenuePerTalent'
                ? `$${entry.value.toLocaleString()}`
                : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const metricConfig = {
  totalProjects: { stroke: '#2E3A8C', name: 'Total Projects', strokeWidth: 2, isDashed: false },
  estRevenue: { stroke: '#00A499', name: 'Estimated Revenue ($)', strokeWidth: 2, isDashed: false },
  activeTalent: { stroke: '#10B981', name: 'Active Talent', strokeWidth: 2, isDashed: false },
  revenuePerTalent: { stroke: '#8B5CF6', name: 'Revenue per Talent ($)', strokeWidth: 2, isDashed: false },
  flaggedProjects: { stroke: '#F59E0B', name: 'Flagged Projects', strokeWidth: 2, isDashed: true },
  negativeReviews: { stroke: '#EF4444', name: 'Negative Reviews', strokeWidth: 2, isDashed: true },
};

export default function AdminLineChart({ selectedMetrics }: AdminLineChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        start.setDate(1);

        const projectsRes = await fetch('/api/db?table=projects');
        const projectsJson = await projectsRes.json();
        const projects = projectsJson.data || [];


        const reviewsRes = await fetch('/api/db?table=project_reviews');
        const reviewsJson = await reviewsRes.json();
        const reviews = reviewsJson.data || [];

         const talentsRes = await fetch('/api/db?table=talent_profiles');
        const talentsJson = await talentsRes.json();
        const talents = talentsJson.data || [];


        const months: Record<string, ChartDataPoint> = {};
        for (let i = 0; i < 6; i++) {
          const d = new Date(start);
          d.setMonth(start.getMonth() + i);
          const m = d.toLocaleString('default', { month: 'short' });
          months[m] = {
            period: m,
            totalProjects: 0,
            estRevenue: 0,
            activeTalent: 0,
            revenuePerTalent: 0,
            flaggedProjects: 0,
            negativeReviews: 0,
          };
        }

        projects?.forEach(p => {
          const m = new Date(p.created_at).toLocaleString('default', { month: 'short' });
          const bucket = months[m];
          if (!bucket) return;
          bucket.totalProjects += 1;
          bucket.estRevenue += p.project_budget || 0;
          if (p.flagged) bucket.flaggedProjects += 1;
        });

        const talentMonths: Record<string, Set<string>> = {};
        talents?.forEach(t => {
          if (!t.is_qualified) return;
          const m = new Date(t.created_at).toLocaleString('default', { month: 'short' });
          if (!talentMonths[m]) talentMonths[m] = new Set();
          talentMonths[m].add(t.id);
        });
        Object.entries(talentMonths).forEach(([m, ids]) => {
          if (months[m]) months[m].activeTalent = ids.size;
        });

        reviews?.forEach(r => {
          if (r.rating < 3) {
            const m = new Date(r.created_at).toLocaleString('default', { month: 'short' });
            if (months[m]) months[m].negativeReviews += 1;
          }
        });

        Object.values(months).forEach(m => {
          m.estRevenue = m.estRevenue * 0.15;
          m.revenuePerTalent = m.activeTalent > 0 ? m.estRevenue / m.activeTalent : 0;
        });

        setChartData(Object.values(months));
      } catch (error) {
        console.error('Error loading metrics', error);
        setChartData([]);
      }
    }

    loadMetrics();
  }, []);

  if (!Array.isArray(chartData)) {
    return <div className="p-4 text-sm text-gray-500">Loading chart data...</div>;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Analytics Overview</h3>
          <p className="text-sm text-gray-600">Key metrics tracking over the past 6 months</p>
        </div>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              {Array.isArray(selectedMetrics) && selectedMetrics.map((metric) => {
                const config = metricConfig[metric as keyof typeof metricConfig];
                if (!config) return null;
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={config.stroke}
                    strokeWidth={config.strokeWidth}
                    strokeDasharray={config.isDashed ? '5 5' : '0'}
                    name={config.name}
                    dot={{ fill: config.stroke, strokeWidth: 2, r: config.strokeWidth === 3 ? 4 : 3 }}
                    activeDot={{ r: config.strokeWidth === 3 ? 6 : 5, stroke: config.stroke, strokeWidth: 2 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
