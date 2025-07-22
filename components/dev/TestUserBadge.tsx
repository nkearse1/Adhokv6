'use client';
import { useAuth } from '@/lib/client/useAuthContext';

export default function TestUserBadge() {
  const { userId, username, userRole } = useAuth();
  if (process.env.NODE_ENV === 'production' || !userId) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded z-50 text-xs">
      Mock Login: {username || userId} ({userRole})
    </div>
  );
}
