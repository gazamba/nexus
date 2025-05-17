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
import { Plus, Edit, Search } from "lucide-react";
import { Node } from "@/types/types";

export function NodesList({ initialNodes = [] }) {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
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

  const handleEditNode = (nodeId: string) => {
    console.log("Navigating to edit page for node:", nodeId);
    router.push(`/nodes/${nodeId}/edit`);
  };

  const nodeTypes = [
    "all",
    ...new Set(
      nodes.map((node: any) => node.type || "unknown").filter(Boolean)
    ),
  ];

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      (node.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || node.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading nodes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Nodes</h2>
          <Link href="/nodes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Node
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
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
              {nodeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredNodes.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {nodes.length > 0
              ? "No nodes match your search criteria. Try adjusting your filters."
              : "No nodes found. Create your first node to get started."}
          </p>
          {nodes.length === 0 && (
            <div className="mt-4">
              <Link href="/nodes/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Node
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {filteredNodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <Card key={node.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {node.name || "Untitled Node"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {node.description || "No description provided"}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs bg-muted px-2 py-1 rounded">
                    {node.type || "Unknown"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNode(node.id)}
                    >
                      <Edit className="h-4 w-4" />
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
