'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/client/useAuthContext';

export default function FindProjectsButton() {
  const { isAuthenticated, loading } = useAuth();
  const href = !loading && isAuthenticated ? '/talent/projects' : '/sign-in';
  return (
    <Link href={href}>
      <Button className="w-full bg-[#00A499] hover:bg-[#00A499]/90 text-white">
        Find Projects
      </Button>
    </Link>
  );
}
