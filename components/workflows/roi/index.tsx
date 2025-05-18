"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { AddWorkflowDialog } from "../add-workflow-dialog";
import { Actions } from "./actions";
import { WorkflowTable } from "./table";
import { Workflow } from "./types";

// Sample workflow data
const initialWorkflowData: Workflow[] = [
  {
    id: 1,
    createDate: "2025-05-14 09:30",
    department: "Finance",
    workflowName: "Invoice Processing",
    description: "Automated invoice processing workflow",
    nodes: 12,
    executions: 1234,
    exceptions: 23,
    timeSaved: "155.5 hrs",
    costSaved: "$15,650",
  },
  {
    id: 2,
    createDate: "2025-05-13 14:15",
    department: "HR",
    workflowName: "Employee Onboarding",
    description: "New employee onboarding automation",
    nodes: 8,
    executions: 456,
    exceptions: 5,
    timeSaved: "89.2 hrs",
    costSaved: "$8,920",
  },
];

export function WorkflowROI() {
  const { user } = useAuth();
  const [workflowData, setWorkflowData] =
    useState<Workflow[]>(initialWorkflowData);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddWorkflow = (newWorkflow: Workflow) => {
    setWorkflowData([newWorkflow, ...workflowData]);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <Actions onAddWorkflow={() => setDialogOpen(true)} />
        <WorkflowTable workflows={workflowData} />
      </main>

      <AddWorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddWorkflow={handleAddWorkflow}
      />
    </div>
  );
}
