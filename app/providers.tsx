'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/client/useAuthContext';
import TestUserBadge from '@/components/dev/TestUserBadge';
import NeonUserSwitcher from '@/components/dev/NeonUserSwitcher';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi}>
      <AuthProvider>
        <Header />
        {children}
        <Toaster />
        <NeonUserSwitcher />
        <TestUserBadge />
      </AuthProvider>
    </ClerkProvider>
  );
}

