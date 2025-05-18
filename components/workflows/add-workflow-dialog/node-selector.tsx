"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Node {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface NodeSelectorProps {
  selectedNodeIds: string[];
  onNodeSelectionChange: (nodeIds: string[]) => void;
}

export function NodeSelector({
  selectedNodeIds,
  onNodeSelectionChange,
}: NodeSelectorProps) {
  const [availableNodes, setAvailableNodes] = useState<Node[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [nodesError, setNodesError] = useState("");

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    setLoadingNodes(true);
    setNodesError("");

    try {
      const response = await fetch("/api/nodes");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAvailableNodes(data.nodes || []);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      setNodesError("Failed to load nodes. Please try again.");

      // Fallback mock data
      setAvailableNodes([
        {
          id: "1",
          name: "Email Parser",
          description: "Parses emails for data extraction",
          type: "Parser",
        },
        {
          id: "2",
          name: "Slack Notifier",
          description: "Sends notifications to Slack",
          type: "Notification",
        },
        {
          id: "3",
          name: "PDF Extractor",
          description: "Extracts data from PDF files",
          type: "Parser",
        },
        {
          id: "4",
          name: "Salesforce Connector",
          description: "Connects to Salesforce API",
          type: "Integration",
        },
        {
          id: "5",
          name: "Data Transformer",
          description: "Transforms data between formats",
          type: "Processor",
        },
      ]);
    } finally {
      setLoadingNodes(false);
    }
  };

  const toggleNodeSelection = (nodeId: string) => {
    const newSelection = selectedNodeIds.includes(nodeId)
      ? selectedNodeIds.filter((id) => id !== nodeId)
      : [...selectedNodeIds, nodeId];
    onNodeSelectionChange(newSelection);
  };

  if (loadingNodes) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading nodes...</span>
      </div>
    );
  }

  if (nodesError) {
    return <div className="text-red-500 py-2">{nodesError}</div>;
  }

  return (
    <div className="space-y-2">
      {availableNodes.map((node) => (
        <div key={node.id} className="flex items-start space-x-2">
          <Checkbox
            id={node.id}
            checked={selectedNodeIds.includes(node.id)}
            onCheckedChange={() => toggleNodeSelection(node.id)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor={node.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {node.name}
            </Label>
            <p className="text-sm text-muted-foreground">{node.description}</p>
            <span className="text-xs text-muted-foreground">{node.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
