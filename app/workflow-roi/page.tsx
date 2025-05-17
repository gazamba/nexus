"use client";

import { useAuth } from "@/contexts/auth-provider";
import { WorkflowROI } from "@/components/workflow-roi";
import { ClientSidebar } from "@/components/client-sidebar";
import { Sidebar } from "@/components/sidebar";

export default function WorkflowROIPage() {
  const { isAdmin, isClient } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <WorkflowROI />
    </div>
  );
}
