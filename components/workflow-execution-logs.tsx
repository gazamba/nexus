"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

// Sample workflow options
const workflowOptions = [
  "Invoice Processing Workflow",
  "Employee Onboarding Workflow",
  "Expense Approval Workflow",
  "Customer Onboarding Workflow",
];

// Sample log data
const logData = [
  {
    id: 1,
    timestamp: "2025-05-14 02:15:47",
    workflow: "Invoice Processing",
    details: "Successfully processed invoice #INV-2025-001",
  },
  {
    id: 2,
    timestamp: "2025-05-14 02:14:32",
    workflow: "Invoice Processing",
    details: "Data extraction completed for invoice #INV-2025-002",
  },
  {
    id: 3,
    timestamp: "2025-05-14 02:13:15",
    workflow: "Invoice Processing",
    details: "Started processing invoice batch #BATCH-051",
  },
  {
    id: 4,
    timestamp: "2025-05-14 02:12:03",
    workflow: "Invoice Processing",
    details: "Validation checks passed for invoice #INV-2025-003",
  },
  {
    id: 5,
    timestamp: "2025-05-14 02:10:47",
    workflow: "Invoice Processing",
    details: "New invoice detected in input folder",
  },
];

export function WorkflowExecutionLogs() {
  const { user } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowOptions[0]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="w-64">
            <Select
              defaultValue={selectedWorkflow}
              onValueChange={setSelectedWorkflow}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflowOptions.map((workflow) => (
                  <SelectItem key={workflow} value={workflow}>
                    {workflow}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Workflow
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Execution Details
                </th>
              </tr>
            </thead>
            <tbody>
              {logData.map((log) => (
                <tr key={log.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm">{log.workflow}</td>
                  <td className="px-4 py-3 text-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
