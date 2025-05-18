"use client";

import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { TableCell } from "./cell";

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

interface ClientTableRowProps {
  client: ClientDashboard;
}

export function ClientTableRow({ client }: ClientTableRowProps) {
  return (
    <tr className="border-t hover:bg-muted/20">
      <TableCell className="text-blue-500">
        <Link
          href={`/clients/${client.id}`}
          className="hover:underline flex items-center"
        >
          {client.name}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/contracts/${client.contractId}`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.contractStart}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/clients/${client.id}/workflows`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.workflows}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>{client.nodes}</TableCell>
      <TableCell>
        <Link
          href={`/clients/${client.id}/executions`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.executions}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/clients/${client.id}/exceptions`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.exceptions}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>{client.revenue}</TableCell>
      <TableCell>{client.timeSaved}</TableCell>
      <TableCell>{client.moneySaved}</TableCell>
    </tr>
  );
}
