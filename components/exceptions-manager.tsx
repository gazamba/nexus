"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

// Sample exception data
const exceptions = [
  {
    id: 1,
    datetime: "2025-05-14 12:30:00",
    clientName: "Acme Corp",
    department: "Finance",
    workflow: "Invoice Processing",
    notifications: 3,
    exceptionType: "Integration",
    severity: "Critical",
    remedy: "API timeout",
    status: "New",
  },
];

export function ExceptionsManager() {
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="bg-card p-4 rounded-md border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="client-filter"
                className="block text-sm mb-1 text-muted-foreground"
              >
                Client name
              </label>
              <Select defaultValue="all" onValueChange={setClientFilter}>
                <SelectTrigger id="client-filter">
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clients</SelectItem>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="globex">Globex</SelectItem>
                  <SelectItem value="initech">Initech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="type-filter"
                className="block text-sm mb-1 text-muted-foreground"
              >
                Exception type
              </label>
              <Select defaultValue="all" onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="severity-filter"
                className="block text-sm mb-1 text-muted-foreground"
              >
                Severity
              </label>
              <Select defaultValue="all" onValueChange={setSeverityFilter}>
                <SelectTrigger id="severity-filter">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <TableHeader>
                  Datetime reported
                  <Button variant="ghost" size="sm" className="ml-1 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHeader>
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
                <tr key={exception.id} className="border-t hover:bg-muted/20">
                  <TableCell>{exception.datetime}</TableCell>
                  <TableCell>{exception.clientName}</TableCell>
                  <TableCell>{exception.department}</TableCell>
                  <TableCell>{exception.workflow}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-primary border-2 border-background flex items-center justify-center text-primary-foreground text-xs">
                        JD
                      </div>
                      <div className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-secondary-foreground text-xs">
                        AS
                      </div>
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground text-xs">
                        +2
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{exception.exceptionType}</TableCell>
                  <TableCell>
                    <span className="text-destructive font-medium">
                      {exception.severity}
                    </span>
                  </TableCell>
                  <TableCell>{exception.remedy}</TableCell>
                  <TableCell>
                    <Select defaultValue={exception.status.toLowerCase()}>
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
      {children}
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
