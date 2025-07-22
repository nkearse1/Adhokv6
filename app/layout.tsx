// app/layout.tsx
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/lib/client/useAuthContext';
import { MockDataProvider } from '@/lib/useMockData';
import DevRoleSwitcher from '@/components/dev/DevRoleSwitcher';
import TestUserBadge from '@/components/dev/TestUserBadge';
import NeonUserSwitcher from '@/components/dev/NeonUserSwitcher';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Adhok',
  description: 'Next.js + Clerk App',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const inner = (
    <MockDataProvider>
      <AuthProvider>
        <Header />
        {children}
        <Toaster />
        <DevRoleSwitcher />
        <NeonUserSwitcher />
        <TestUserBadge />
      </AuthProvider>
    </MockDataProvider>
  );

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi}>
          {inner}
        </ClerkProvider>
      </body>
    </html>
  );
}
