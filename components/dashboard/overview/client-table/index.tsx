"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TableHeader } from "./header";
import { ClientTableRow } from "./row";

interface ClientDashboard {
  id: string;
  name: string;
  contractId: string;
  contractStart: string;
  workflows: number;
  nodes: number;
  executions: number;
  exceptions: number;
  revenue: string;
  timeSaved: string;
  moneySaved: string;
}

interface ClientTableProps {
  clients: ClientDashboard[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Clients</h2>
        <Button className="bg-black text-white">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <TableHeader>Client Name</TableHeader>
              <TableHeader>Contract Start</TableHeader>
              <TableHeader>Workflows</TableHeader>
              <TableHeader>Nodes</TableHeader>
              <TableHeader>Executions</TableHeader>
              <TableHeader>Exceptions</TableHeader>
              <TableHeader>Revenue</TableHeader>
              <TableHeader>Time Saved</TableHeader>
              <TableHeader>Money Saved</TableHeader>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <ClientTableRow key={index} client={client} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
