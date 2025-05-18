"use client";

import { TableHeader } from "./header";
import { TableCell } from "./cell";
import { Workflow } from "../types";

interface WorkflowTableProps {
  workflows: Workflow[];
}

export function WorkflowTable({ workflows }: WorkflowTableProps) {
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
  );
}
