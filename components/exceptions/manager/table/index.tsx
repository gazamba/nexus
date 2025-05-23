"use client";

import { TableHeader } from "./header";
import { ExceptionTableRow } from "./row";
import { ExceptionsTableProps } from "../types";

export function ExceptionsTable({
  exceptions,
  isLoading,
  clients,
}: ExceptionsTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <TableHeader sortable>Datetime reported</TableHeader>
              <TableHeader>Client name</TableHeader>
              <TableHeader>Department</TableHeader>
              <TableHeader>Workflow name</TableHeader>
              <TableHeader>Notifications</TableHeader>
              <TableHeader>Exception type</TableHeader>
              <TableHeader>Severity</TableHeader>
              <TableHeader>Remedy</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} className="border-t animate-pulse">
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <td key={i} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <TableHeader sortable>Datetime reported</TableHeader>
            <TableHeader>Client name</TableHeader>
            <TableHeader>Department</TableHeader>
            <TableHeader>Workflow name</TableHeader>
            <TableHeader>Notifications</TableHeader>
            <TableHeader>Exception type</TableHeader>
            <TableHeader>Severity</TableHeader>
            <TableHeader>Remedy</TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {exceptions.map((exception) => (
            <ExceptionTableRow
              key={exception.id}
              exception={exception}
              clients={clients}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
