"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/client/useAuthContext";
import { ProjectUploadFlow } from "@/components/ProjectUploadFlow";

export default function ClientUploadPage() {
  const { authUser } = useAuth();
  useEffect(() => {
    console.log(authUser);
  }, [authUser]);
  if (!authUser || authUser.user_role !== "client") {
    return null;
  }
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start p-4">
      <ProjectUploadFlow />
    </main>
  );
}
