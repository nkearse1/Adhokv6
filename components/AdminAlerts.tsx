'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, UserX, DollarSign, MessageCircle } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'flagged_project' | 'disqualified_talent' | 'payment_issue' | 'negative_review';
  message: string;
  timestamp: string;
}

const iconMap: Record<AlertItem['type'], React.ReactNode> = {
  flagged_project: <AlertTriangle className="text-red-500 w-5 h-5" />,
  disqualified_talent: <UserX className="text-yellow-600 w-5 h-5" />,
  payment_issue: <DollarSign className="text-blue-500 w-5 h-5" />,
  negative_review: <MessageCircle className="text-pink-500 w-5 h-5" />,
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await fetch('/api/db?table=notifications');
      const json = await res.json();
      if (res.ok) {
        setAlerts(
          (json.data || []).slice(0,10).map((n: any) => ({
            id: n.id,
            type: n.type as AlertItem['type'],
            message: n.message,
            timestamp: n.created_at,
          }))
        );
      } else {
        console.error('Error loading alerts', json.error);
      }
    }
    loadAlerts();
  }, []);

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="border-l-4 border-[#2E3A8C]">
          <CardContent className="flex items-start gap-4 p-4">
            <div>{iconMap[alert.type]}</div>
            <div className="space-y-1">
              <p className="text-sm text-gray-800 font-medium">{alert.message}</p>
              <p className="text-xs text-gray-500">{formatTime(alert.timestamp)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
