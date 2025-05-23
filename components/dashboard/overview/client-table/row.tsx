"use client";

import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { TableCell } from "./cell";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
        <span
          className="hover:underline text-blue-500 cursor-pointer flex items-center"
          onClick={() => router.push(`/clients/${client.id}`)}
        >
          {client.contractStart}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </span>
      </TableCell>
      <TableCell>
        <Link
          href={`#`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.workflows}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>{client.nodes}</TableCell>
      <TableCell>
        <Link
          href={`#`}
          className="hover:underline text-blue-500 flex items-center"
        >
          {client.executions}
          <ExternalLinkIcon className="h-3 w-3 ml-1 opacity-50" />
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/exceptions`}
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
