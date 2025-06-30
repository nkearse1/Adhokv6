'use client';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const userRole = user?.publicMetadata?.role as string;

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const hasAccess = isSignedIn && allowedRoles.includes(userRole);

  if (!hasAccess) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
