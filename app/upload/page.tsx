'use client';
import { ProjectUploadFlow } from '@/components/ProjectUploadFlow';

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <ProjectUploadFlow />
    </main>
  );
}
