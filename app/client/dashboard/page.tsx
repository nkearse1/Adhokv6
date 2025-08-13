import ClientDashboardClient from './ClientDashboardClient';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ClientDashboardPage(_props: PageProps) {
  return <ClientDashboardClient />;
}

