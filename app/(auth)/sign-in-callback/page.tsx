'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInCallback() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      router.replace('/sign-in');
      return;
    }
    const role = user.publicMetadata?.role as string | undefined;
    if (role === 'admin') router.replace('/admin/panel');
    else if (role === 'client') router.replace('/client/dashboard');
    else router.replace('/talent/dashboard');
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="p-6 text-center text-gray-600">Redirecting...</div>
  );
}
