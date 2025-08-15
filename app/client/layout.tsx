'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/lib/client/useAuthContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { loading, userRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole === 'talent') {
      router.replace(pathname.replace(/^\/client/, '/talent'));
    }
  }, [loading, userRole, pathname, router]);

  return <>{children}</>;
}
