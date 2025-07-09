"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const role = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (isLoaded && (!isSignedIn || role !== "admin")) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, role, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isSignedIn || role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
