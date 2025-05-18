"use client";

import { useAuth } from "@/contexts/auth-provider";

export function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-md border">
            <h2 className="text-lg font-medium mb-4">
              Welcome, {user?.name || "Admin"}
            </h2>
            <p className="text-muted-foreground">
              Manage your clients, workflows, and system settings from this
              dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
