"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TableHeader } from "./header";
import { ClientTableRow } from "./row";
import { getPipelineDataByClient } from "@/lib/services/pipeline-service";

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

async function fetchClientWorkflowStats(clientId: string) {
  const res = await fetch(`/api/workflows?clientId=${clientId}`);
  if (!res.ok) return null;
  const workflows = await res.json();
  let workflowCount = 0;
  let nodeCount = 0;
  let executions = 0;
  let exceptions = 0;
  let timeSaved = 0;
  let costSaved = 0;
  if (Array.isArray(workflows)) {
    workflowCount = workflows.length;
    nodeCount = workflows.reduce(
      (sum, w) =>
        sum +
        (Array.isArray(w.nodes)
          ? w.nodes.length
          : typeof w.nodes === "number"
          ? w.nodes
          : 0),
      0
    );
    executions = workflows.reduce((sum, w) => sum + (w.executions || 0), 0);
    exceptions = workflows.reduce((sum, w) => sum + (w.exceptions || 0), 0);
    timeSaved = workflows.reduce(
      (sum, w) => sum + (parseFloat(w.timesaved) || 0),
      0
    );
    costSaved = workflows.reduce(
      (sum, w) => sum + (parseFloat(w.costsaved) || 0),
      0
    );
  }
  return {
    workflowCount,
    nodeCount,
    executions,
    exceptions,
    timeSaved,
    costSaved,
  };
}

async function fetchClientContractStart(clientId: string) {
  const { data: stepsWithProgress } = await getPipelineDataByClient(clientId);
  if (!Array.isArray(stepsWithProgress)) return null;
  const step7 = stepsWithProgress.find((s: any) => s.step_order === 7);
  if (step7 && step7.progress && step7.progress.created_at) {
    return new Date(step7.progress.created_at).toLocaleDateString();
  }
  return null;
}

export function ClientTable({ clients }: ClientTableProps) {
  const [liveStats, setLiveStats] = useState<Record<string, any>>({});
  const [contractStarts, setContractStarts] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllStats() {
      setLoading(true);
      const stats: Record<string, any> = {};
      const contractStartMap: Record<string, string> = {};
      await Promise.all(
        clients.map(async (client) => {
          const stat = await fetchClientWorkflowStats(client.id);
          stats[client.id] = stat;
          const contractStart = await fetchClientContractStart(client.id);
          contractStartMap[client.id] =
            contractStart || "Processing pipeline approval";
        })
      );
      setLiveStats(stats);
      setContractStarts(contractStartMap);
      setLoading(false);
    }
    fetchAllStats();
  }, [clients]);

  if (loading) {
    return (
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
            {[...Array(clients.length || 3)].map((_, idx) => (
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">All Clients</h2>
          <Button className="bg-black text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="border-t overflow-hidden">
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
            {clients.map((client, index) => {
              const stats = liveStats[client.id];
              const contractStart =
                contractStarts[client.id] || client.contractStart;
              return (
                <ClientTableRow
                  key={index}
                  client={{
                    ...client,
                    contractStart,
                    workflows: stats ? stats.workflowCount : client.workflows,
                    nodes: stats ? stats.nodeCount : client.nodes,
                    executions: stats ? stats.executions : client.executions,
                    exceptions: stats ? stats.exceptions : client.exceptions,
                    timeSaved: stats
                      ? stats.timeSaved.toLocaleString() + "h"
                      : client.timeSaved,
                    moneySaved: stats
                      ? "$" + stats.costSaved.toLocaleString()
                      : client.moneySaved,
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
