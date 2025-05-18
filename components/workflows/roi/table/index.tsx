"use client";

import { useState } from "react";
import { TableHeader } from "./header";
import { TableCell } from "./cell";
import { Workflow } from "@/types/types";
import { AddWorkflowDialog } from "@/components/workflows/add-workflow-dialog";

interface WorkflowTableProps {
  workflows: Workflow[];
}

export function WorkflowTable({ workflows }: WorkflowTableProps) {
  const [editWorkflow, setEditWorkflow] = useState<Workflow | null>(null);

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <TableHeader>Create Date/Time</TableHeader>
            <TableHeader>Department</TableHeader>
            <TableHeader>Workflow Name</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Nodes</TableHeader>
            <TableHeader>Executions</TableHeader>
            <TableHeader>Exceptions</TableHeader>
            <TableHeader>Time Saved</TableHeader>
            <TableHeader>Cost Saved</TableHeader>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.id} className="border-t hover:bg-muted/20">
              <TableCell>
                {workflow.created_at
                  ? new Date(workflow.created_at).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>{workflow.department || "-"}</TableCell>
              <TableCell className="text-blue-500">
                <button
                  className="hover:underline bg-transparent border-none p-0 m-0 cursor-pointer text-blue-500"
                  onClick={() =>
                    setEditWorkflow({
                      ...workflow,
                      department: workflow.department || "",
                    })
                  }
                  type="button"
                >
                  {workflow.name}
                </button>
              </TableCell>
              <TableCell>{workflow.description}</TableCell>
              <TableCell>
                {Array.isArray(workflow.nodes) ? workflow.nodes.length : "-"}
              </TableCell>
              <TableCell>{workflow.executions}</TableCell>
              <TableCell>{workflow.exceptions}</TableCell>
              <TableCell>{workflow.timesaved}</TableCell>
              <TableCell>{workflow.costsaved}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
      {editWorkflow && (
        <AddWorkflowDialog
          open={!!editWorkflow}
          onOpenChange={(open) => !open && setEditWorkflow(null)}
          workflow={editWorkflow}
          mode="edit"
        />
      )}
    </div>
  );
}
