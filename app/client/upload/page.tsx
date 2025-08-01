'use client';

import { useAuth } from '@/lib/client/useAuthContext';
import { ProjectUploadFlow } from '@/components/ProjectUploadFlow';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientUploadPage() {
  const { loading, isClient, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is authenticated but not a client
    if (!loading && isAuthenticated && !isClient) {
      router.replace('/');
    }
  }, [loading, isClient, isAuthenticated, router]);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <ProjectUploadFlow />
    </main>
  );
}
