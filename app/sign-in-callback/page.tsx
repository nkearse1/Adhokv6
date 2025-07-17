'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function SignInCallback() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    const role = user?.publicMetadata?.role as string | undefined;
    let destination = '/waitlist';

    if (role === 'admin') destination = '/admin/panel';
    else if (role === 'client') destination = '/client/dashboard';
    else if (role === 'talent') destination = '/talent/dashboard';

    router.replace(destination);
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </main>
  );
}
