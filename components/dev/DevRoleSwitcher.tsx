'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ROLES = ['admin', 'client', 'talent'] as const;
type UserRole = (typeof ROLES)[number];

export default function DevRoleSwitcher() {
  const [role, setRole] = useState<UserRole | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dev_user_role') as UserRole;
      if (stored) setRole(stored);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('dev_user_role', newRole);
    router.refresh();
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow p-4 z-50">
      <p className="text-sm font-semibold mb-2 text-gray-700">Dev Role:</p>
      <div className="flex gap-2">
        {ROLES.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={r === role ? 'default' : 'outline'}
            onClick={() => switchRole(r)}
          >
            {r}
          </Button>
        ))}
      </div>
    </div>
  );
}
