'use client';

import * as React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/lib/useAuth';
import DevRoleSwitcher from '@/components/dev/DevRoleSwitcher';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Adhok',
  description: 'Next.js + Clerk App',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  const App = (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Toaster />
          <DevRoleSwitcher />
        </AuthProvider>
      </body>
    </html>
  );

  return isMock || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
    App
  ) : (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API!}
    >
      {App}
    </ClerkProvider>
  );
}
