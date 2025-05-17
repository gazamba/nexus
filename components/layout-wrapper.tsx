"use client";

import { useAuth } from "@/contexts/auth-provider";
import { Sidebar } from "@/components/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { TopBar } from "@/components/top-bar";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      {user?.role === "admin" || user?.role === "se" ? (
        <Sidebar />
      ) : (
        <ClientSidebar />
      )}
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
