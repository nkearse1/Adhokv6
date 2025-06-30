'use client';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
