import * as React from 'react';
import type { Metadata } from 'next';
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
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTE1MCAyNUwyNjIuNSA4Ny41VjIxMi41TDE1MCAyNzVMMzcuNSAyMTIuNVY4Ny41TDE1MCAyNVoiIGZpbGw9IiMwMEE0OTkiLz4KICA8cGF0aCBkPSJNMTUwIDc1TDEwMCAxMjVNMTUwIDc1TDIwMCAxMjVNMTUwIDc1VjE3NU0xMDAgMTI1VjE3NU0yMDAgMTI1VjE3NU0xMDAgMTc1TDE1MCAyMjVNMTUwIDE3NVYyMjVNMjAwIDE3NUwxNTAgMjI1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg=='
    },
  ],
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
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
    </ClerkProvider>
  );
}
