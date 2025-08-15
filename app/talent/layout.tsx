'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';

export default function TalentLayout({ children }: { children: ReactNode }) {
  const { loading, userRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole === 'client') {
      router.replace(pathname.replace(/^\/talent/, '/client'));
    }
  }, [loading, userRole, pathname, router]);

  return <>{children}</>;
}
