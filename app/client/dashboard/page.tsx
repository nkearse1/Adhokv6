import ClientDashboardView from './ClientDashboardView';

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const sp = await searchParams;
  const override = typeof sp.override === 'string' ? sp.override : undefined;

  let clientId = override;
  if (!clientId) {
    try {
      const sessionRes = await fetch('/api/session', { cache: 'no-store' });
      const sessionJson = await sessionRes.json();
      clientId = sessionJson?.session?.userId;
    } catch {
      clientId = undefined;
    }
  }

  if (!clientId) {
    return <div className="p-6 text-center text-gray-600">Failed to load dashboard</div>;
  }

  let projects: any[] = [];
  try {
    const url = override
      ? `/api/clients/${clientId}/projects?override=${override}`
      : `/api/clients/${clientId}/projects`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      projects = json.projects || [];
    } else {
      return (
        <div className="p-6 text-center text-gray-600">Failed to load dashboard</div>
      );
    }
  } catch {
    return <div className="p-6 text-center text-gray-600">Failed to load dashboard</div>;
  }

  return <ClientDashboardView projects={projects} />;
}
