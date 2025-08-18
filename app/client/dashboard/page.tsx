import ClientDashboardView from './ClientDashboardView';

interface PageProps {
  searchParams?: { override?: string };
}

export default function ClientDashboardPage({ searchParams }: PageProps) {
  return <ClientDashboardView override={searchParams?.override} />;
}
