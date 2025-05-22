"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Play, Search, Bot } from "lucide-react";
import { Agent } from "@/types/types";
import { Loading } from "@/components/ui/loading";

export function AgentsList({
  initialAgents = [],
}: {
  initialAgents?: Agent[];
}) {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/agents");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        console.log(data);
        setAgents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleEditAgent = (agentId: string) => {
    router.push(`/agents/${agentId}/edit`);
  };

  const handleTestAgent = (agentId: string) => {
    router.push(`/agents/${agentId}/test`);
  };

  const agentTypes = [
    "all",
    ...new Set(agents.map((agent) => agent.type).filter(Boolean)),
  ];
  const agentStatuses = [
    "all",
    ...new Set(agents.map((agent) => agent.status).filter(Boolean)),
  ];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      (agent.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || agent.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <Loading text="Loading agents..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Agents</h2>
          <Link href="/agents/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {agentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {agentStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all"
                    ? "All Statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            {agents.length > 0
              ? "No agents match your search criteria. Try adjusting your filters."
              : "No agents found. Create your first agent to get started."}
          </p>
          {agents.length === 0 && (
            <div className="mt-4">
              <Link href="/agents/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Agent
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {agent.description}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="text-xs bg-muted px-2 py-1 rounded">
                      {agent.type}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        agent.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agent.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAgent(agent.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestAgent(agent.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
