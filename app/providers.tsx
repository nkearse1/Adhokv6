'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/client/useAuthContext';
import TestUserBadge from '@/components/dev/TestUserBadge';
import NeonUserSwitcher from '@/components/dev/NeonUserSwitcher';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || '';
const hasClerk = Boolean(clerkKey && clerkApi);

if (!hasClerk) {
  console.warn('Missing Clerk environment variables, running in mock mode');
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <AuthProvider>
      <Header />
      {children}
      <Toaster />
      <NeonUserSwitcher />
      <TestUserBadge />
    </AuthProvider>
  );

  return hasClerk ? (
    <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi}>
      {content}
    </ClerkProvider>
  ) : (
    content
  );
}

