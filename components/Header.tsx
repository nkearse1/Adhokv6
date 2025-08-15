'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/client/useAuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { username, userId, userRole, isAuthenticated } = useAuth();
  const router = useRouter();

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'talent':
        return '/talent/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="w-full px-4 py-2 border-b flex items-center justify-between">
      <div className="font-semibold">Adhok</div>
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(getDashboardPath())}
          >
            Dashboard
          </Button>
        )}
        <div className="text-sm">
          {isAuthenticated ? (username || userId) : 'Guest'}
        </div>
      </div>
    </header>
  );
}
