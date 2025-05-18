"use client";

import { Suspense } from "react";
import { ClientSidebarHeader } from "./header";
import { ClientSidebarNavigation } from "./navigation";
import { ClientSidebarLoading } from "./loading";

export function ClientSidebar() {
  return (
    <div className="w-48 border-r bg-background h-full flex flex-col">
      <ClientSidebarHeader />
      <Suspense fallback={<ClientSidebarLoading />}>
        <ClientSidebarNavigation />
      </Suspense>
    </div>
  );
}
