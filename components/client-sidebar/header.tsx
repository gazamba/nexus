"use client";

import { BraintrustLogo } from "@/components/braintrust-logo";

export function ClientSidebarHeader() {
  return (
    <div className="h-14 border-b flex items-center justify-center gap-2">
      <BraintrustLogo />
      <span className="font-semibold">Braintrust</span>
    </div>
  );
}
