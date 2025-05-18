"use client";

import { WorkflowLog } from "./types";

interface LogsTableProps {
  logs: WorkflowLog[];
}

export function LogsTable({ logs }: LogsTableProps) {
  return (
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
          {logs.map((log) => (
            <tr key={log.id} className="border-t hover:bg-muted/20">
              <td className="px-4 py-3 text-sm">{log.timestamp}</td>
              <td className="px-4 py-3 text-sm">{log.workflow}</td>
              <td className="px-4 py-3 text-sm">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
