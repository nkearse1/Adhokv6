'use client';

import { useAuth } from '@/lib/client/useAuthContext';

export default function Header() {
  const { username, userId, isAuthenticated } = useAuth();

  return (
    <header className="w-full px-4 py-2 border-b flex items-center justify-between">
      <div className="font-semibold">Adhok</div>
      <div className="text-sm">
        {isAuthenticated ? (username || userId) : 'Guest'}
      </div>
    </header>
  );
}
