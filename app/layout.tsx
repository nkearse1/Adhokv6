import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/lib/useAuth';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}