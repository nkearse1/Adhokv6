'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@/lib/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Medal, ArrowLeft } from 'lucide-react';
import NotificationBell from './NotificationBell';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  const { userId, userRole, username, isAuthenticated, authUser } = useAuth();
  const fullName = authUser?.fullName || username;
  const expertiseLevel = authUser?.publicMetadata?.expertiseLevel as string;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { signOut } = isMock ? { signOut: () => {} } : useClerk();

  const dashboardPaths: { [key: string]: string } = {
    client: `/client/dashboard`,
    talent: `/talent/dashboard`,
    admin: `/admin/panel`,
  };

  const getDashboardPath = () => dashboardPaths[userRole] || '/';

  const shouldShowDashboard = () => {
    if (!isAuthenticated) return false;
    const current = dashboardPaths[userRole];
    return current && pathname !== current;
  };

  const getBadgeContent = () => {
    switch (expertiseLevel) {
      case 'Expert':
        return (
          <Badge className="bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5" />
            Expert
          </Badge>
        );
      case 'Pro Talent':
        return (
          <Badge className="bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Medal className="h-3.5 w-3.5" />
            Pro Talent
          </Badge>
        );
      case 'Specialist':
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            Specialist
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/adhok_logo_icon_teal_brand_precise3.png"
              alt="Adhok logo"
              className="h-6 w-6"
            />
            <span className="text-2xl font-bold text-[#2E3A8C]">Adhok</span>
          </Link>
          {shouldShowDashboard() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(getDashboardPath())}
              className="text-[#2E3A8C] hover:text-[#1B276F] flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <NotificationBell />
            {fullName && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{fullName}</span>
                {username && (
                  <span className="text-xs text-gray-500">@{username}</span>
                )}
                {getBadgeContent()}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut(() => router.push('/'))}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/sign-in')}
            >
              Sign in
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/talent/sign-up')}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
