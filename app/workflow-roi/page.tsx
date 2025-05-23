"use client";

import { useAuth } from "@/contexts/auth-provider";
import { WorkflowROI } from "@/components/workflows/roi";

export default function WorkflowROIPage() {
  const { isAdmin, isClient } = useAuth();

  if (!isAdmin && !isClient) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto">
      <WorkflowROI />
    </div>
  );
}
