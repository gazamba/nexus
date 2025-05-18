"use client";

import { WorkflowExecutionLogs } from "@/components/workflow-execution-logs/index";

export default function ReportingPage() {
  return (
    <div className="flex h-screen bg-background">
      <WorkflowExecutionLogs />
    </div>
  );
}
