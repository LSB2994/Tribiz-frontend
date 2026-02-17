"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const roles = user.roles;
      if (roles.includes("ADMIN") || roles.includes("ROLE_ADMIN")) {
        router.push("/dashboard/admin");
      } else if (roles.includes("SELLER") || roles.includes("ROLE_SELLER")) {
        router.push("/dashboard/seller");
      } else if (roles.includes("SERVICE_PROVIDER") || roles.includes("ROLE_SERVICE_PROVIDER") || roles.includes("ROLE_PROVIDER")) {
        router.push("/dashboard/provider");
      } else {
        router.push("/");
      }

    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Redirecting to your dashboard...</p>
    </div>
  );
}
