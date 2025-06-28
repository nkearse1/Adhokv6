'use client';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSignedIn || !isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}