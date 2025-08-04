'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/client/useAuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function FindProjectsButton() {
  const { isAuthenticated, loading, userRole } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/sign-up?as=talent');
      return;
    }
    if (userRole === 'talent') {
      router.push('/talent/projects');
    } else {
      toast('You must be a talent user to browse projects.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full bg-[#00A499] hover:bg-[#00A499]/90 text-white"
    >
      Find Projects
    </Button>
  );
}
