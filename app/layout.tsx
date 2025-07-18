// app/layout.tsx
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/lib/useAuth';
import DevRoleSwitcher from '@/components/dev/DevRoleSwitcher';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

export const metadata = {
  title: 'Adhok',
  description: 'Next.js + Clerk App',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const inner = (
    <AuthProvider>
      <Header />
      {children}
      <Toaster />
      <DevRoleSwitcher />
    </AuthProvider>
  );

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {isMock || !clerkKey ? inner : (
          <ClerkProvider publishableKey={clerkKey} frontendApi={clerkApi!}>
            {inner}
          </ClerkProvider>
        )}
      </body>
    </html>
  );
}
