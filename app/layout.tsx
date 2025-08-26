// app/layout.tsx
import '@/styles/globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Adhok',
  description: 'Next.js + Clerk App',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
