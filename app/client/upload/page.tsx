"use client";

import { useAuth } from "@/lib/client/useAuthContext";
import { ProjectUploadFlow } from "@/components/ProjectUploadFlow";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientUploadPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!authUser || authUser.user_role !== "client")) {
      router.replace("/");
    }
  }, [authUser, loading, router]);

  if (loading || !authUser) {
    return <p className="p-6 text-center text-gray-600">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <ProjectUploadFlow />
    </main>
  );
}
