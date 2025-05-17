"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExternalLinkIcon,
} from "lucide-react";

// Time period options
const timePeriods = ["Last 7 days", "Last 30 days", "MTD", "QTD", "YTD", "ITD"];

// Metric card data
const metricCards = [
  { title: "Total Workflows", value: "2,847", change: 12, increasing: true },
  { title: "Total Exceptions", value: "156", change: 8, increasing: false },
  { title: "Time Saved", value: "1,284h", change: 24, increasing: true },
  { title: "Revenue", value: "$847K", change: 16, increasing: true },
  { title: "Active Clients", value: "128", change: 5, increasing: true },
];

// TODO: PENDING UPDATE CURRENT CLIENT TABLE
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

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("ITD");
  const [clientData, setClientData] = useState<ClientDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClientData(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex gap-2 mb-6">
          {timePeriods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              className={`px-4 py-2 ${
                selectedPeriod === period ? "bg-black text-white" : ""
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {metricCards.map((card, index) => (
            <Card key={index} className="border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <div
                    className={`flex items-center text-xs ${
                      card.increasing ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {card.increasing ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {card.change}%
                  </div>
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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
                <TableHeader>
                  Client Name
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Contract Start
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Workflows
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Nodes
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Executions
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Exceptions
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Revenue
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Time Saved
                  <SortIcon />
                </TableHeader>
                <TableHeader>
                  Money Saved
                  <SortIcon />
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client, index) => (
                <tr key={index} className="border-t hover:bg-muted/20">
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
      <div className="flex items-center">{children}</div>
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

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 ml-1 text-muted-foreground/50"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}
