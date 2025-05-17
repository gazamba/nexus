"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowUpDown } from "lucide-react";
import { AddWorkflowDialog } from "./add-workflow-dialog";

// Sample workflow data
const initialWorkflowData = [
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

interface Workflow {
  id: number;
  createDate: string;
  department: string;
  workflowName: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  costSaved: string;
}

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
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Button
            className="bg-black text-white"
            onClick={() => setDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>

        {/* Workflow ROI Table */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <TableHeader>
                  Create Date/Time
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Department
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Workflow Name
                  <SortIcon />
                </TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>
                  Nodes
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Executions
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Exceptions
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Time Saved
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Cost Saved
                  <SortIcon />
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {workflowData.map((workflow) => (
                <tr key={workflow.id} className="border-t hover:bg-muted/20">
                  <TableCell>{workflow.createDate}</TableCell>
                  <TableCell>{workflow.department}</TableCell>
                  <TableCell className="text-blue-500">
                    {workflow.workflowName}
                  </TableCell>
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>{workflow.nodes}</TableCell>
                  <TableCell>{workflow.executions}</TableCell>
                  <TableCell>{workflow.exceptions}</TableCell>
                  <TableCell>{workflow.timeSaved}</TableCell>
                  <TableCell>{workflow.costSaved}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Workflow Dialog */}
      <AddWorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddWorkflow={handleAddWorkflow}
      />
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
      <div className="flex items-center">{children}</div>
    </th>
  );
}

function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}

function SortIcon() {
  return <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground/50" />;
}
