"use client";

import { TableHeader } from "./header";
import { ExceptionTableRow } from "./row";

interface Exception {
  id: number;
  datetime: string;
  clientName: string;
  department: string;
  workflow: string;
  notifications: number;
  exceptionType: string;
  severity: string;
  remedy: string;
  status: string;
}

interface ExceptionsTableProps {
  exceptions: Exception[];
}

export function ExceptionsTable({ exceptions }: ExceptionsTableProps) {
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
            <ExceptionTableRow key={exception.id} exception={exception} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
