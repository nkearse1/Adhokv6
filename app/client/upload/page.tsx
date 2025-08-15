'use client';

import { useAuth } from '@/lib/client/useAuthContext';
import { ProjectUploadFlow } from '@/components/ProjectUploadFlow';

export default function ClientUploadPage() {
  const { loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <ProjectUploadFlow />
    </main>
  );
}
