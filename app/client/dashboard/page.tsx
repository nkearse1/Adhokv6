import ClientDashboardView from './ClientDashboardView';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ClientDashboardPage({
  searchParams,
}: PageProps) {
  const resolved = await searchParams;
  const overrideParam = Array.isArray(resolved?.override)
    ? resolved?.override[0]
    : resolved?.override;
  return <ClientDashboardView override={overrideParam} />;
}
