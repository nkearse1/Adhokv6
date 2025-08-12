'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/client/useAuthContext';
import TestUserBadge from '@/components/dev/TestUserBadge';
import NeonUserSwitcher from '@/components/dev/NeonUserSwitcher';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API || '';
const hasClerk = Boolean(clerkKey && clerkApi);
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const shouldUseClerk = hasClerk && !useMock;

if (process.env.NEXT_PUBLIC_DEBUG_AUTH === '1') {
  console.log('[providers] hasClerk:', hasClerk, 'useMock:', useMock);
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

  return shouldUseClerk ? (
    <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi}>
      {content}
    </ClerkProvider>
  ) : (
    content
  );
}

