"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const role = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (isLoaded && isSignedIn && role && !allowedRoles.includes(role)) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, role, allowedRoles, router]);

  if (!isLoaded || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking permissions...
      </div>
    );
  }

  if (!isSignedIn) {
    router.replace("/sign-in");
    return null;
  }

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
