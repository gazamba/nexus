"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { WorkflowSelect } from "./workflow-select";
import { LogsTable } from "./logs-table";
import { workflowOptions, sampleLogs } from "./data";

export function WorkflowExecutionLogs() {
  const { user } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState(
    workflowOptions[0].value
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <WorkflowSelect
            options={workflowOptions}
            value={selectedWorkflow}
            onValueChange={setSelectedWorkflow}
          />
        </div>
        <LogsTable logs={sampleLogs} />
      </main>
    </div>
  );
}
