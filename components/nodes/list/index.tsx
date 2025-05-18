"use client";

import { useState, useEffect } from "react";
import { NodeListItem } from "@/types/types";
import { NodeFilters } from "@/components/nodes/list/filters";
import { NodeGrid } from "@/components/nodes/list/grid";
import { LoadingState } from "@/components/nodes/list/loading-state";
import { ErrorState } from "@/components/nodes/list/error-state";
import { EmptyState } from "@/components/nodes/list/empty-state";

interface NodesListProps {
  initialNodes?: NodeListItem[];
}

export function NodesList({ initialNodes = [] }: NodesListProps) {
  const [nodes, setNodes] = useState<NodeListItem[]>(initialNodes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true);
        console.log("Fetching nodes data...");

        const response = await fetch("/api/nodes");
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(errorData.error || "Failed to fetch nodes");
        }

        const data = await response.json();
        console.log("Fetched nodes:", data);
        setNodes(data || []);
      } catch (err: unknown) {
        console.error("Error fetching nodes:", err);
        if (err instanceof Error) {
          setError(`Failed to load nodes: ${err.message}`);
        } else {
          setError("Failed to load nodes: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const nodeTypes = [
    "all",
    ...new Set(nodes.map((node) => node.type || "unknown").filter(Boolean)),
  ];

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      (node.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || node.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <NodeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        nodeTypes={nodeTypes}
      />

      {filteredNodes.length === 0 ? (
        <EmptyState hasNodes={nodes.length > 0} />
      ) : (
        <NodeGrid nodes={filteredNodes} />
      )}
    </div>
  );
}
