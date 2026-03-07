'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const clerkActive = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
import { useAuth } from '@/lib/client/useAuthContext';

export default function SignInCallback() {
  const {
    userId,
    userRole,
    username,
    authUser,
    loading,
    isAuthenticated,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (clerkActive && !isAuthenticated) {
      router.replace('/sign-in');
      return;
    }

    const role = userRole as string | undefined;
    let destination = '/waitlist';

    if (role === 'admin') destination = '/admin/panel';
    else if (role === 'client') destination = '/client/dashboard';
    else if (role === 'talent') destination = '/talent/dashboard';

    router.replace(destination);
  }, [loading, isAuthenticated, userRole, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </main>
  );
}
