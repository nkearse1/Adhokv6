'use client';

import * as React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/lib/useAuth';
import DevRoleSwitcher from '@/components/dev/DevRoleSwitcher';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Adhok',
  description: 'Next.js + Clerk App',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

function LayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
      <Toaster />
      <DevRoleSwitcher />
    </AuthProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="en">
      <body>{<LayoutInner>{children}</LayoutInner>}</body>
    </html>
  );

  if (isMock || !clerkKey) return content;

  return (
    <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi!}>
      {content}
    </ClerkProvider>
  );
}
