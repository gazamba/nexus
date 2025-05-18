"use client";

import { useAuth } from "@/contexts/auth-provider";
import { DashboardOverview } from "@/components/dashboard/overview";
import { ClientDashboard } from "@/components/dashboard/client";

export default function Home() {
  const { isAdmin, isClient, isSE } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {(isAdmin || isSE) && (
        <>
          <DashboardOverview />
        </>
      )}
      {isClient && (
        <>
          <ClientDashboard />
        </>
      )}
    </div>
  );
}
