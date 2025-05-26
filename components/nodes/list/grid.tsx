"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Play } from "lucide-react";
import { NodeListItem } from "@/types/types";
import { useState } from "react";

interface NodeGridProps {
  nodes: NodeListItem[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  const router = useRouter();
  const [deletingNodeId, setDeletingNodeId] = useState<string | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEditNode = (nodeId: string) => {
    console.log("Navigating to edit page for node:", nodeId);
    router.push(`/nodes/${nodeId}/edit`);
  };

  const handleTestNode = (nodeId: string) => {
    router.push(`/nodes/${nodeId}/test`);
  };

  const handleDeleteNode = async (nodeId: string) => {
    setDeletingNodeId(nodeId);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/nodes/${nodeId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete node");
      }
      setShowConfirmId(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeletingNodeId(null);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nodes.map((node) => (
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
            <div className="flex flex-col h-full gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditNode(node.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestNode(node.id)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowConfirmId(node.id)}
                    disabled={deletingNodeId === node.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {showConfirmId === node.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-2">Delete Node</h3>
                    <p className="mb-4">
                      Are you sure you want to delete{" "}
                      <span className="font-bold">{node.name}</span>? This
                      action cannot be undone.
                    </p>
                    {deleteError && (
                      <p className="text-red-500 mb-2">{deleteError}</p>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmId(null)}
                        disabled={deletingNodeId === node.id}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteNode(node.id)}
                        disabled={deletingNodeId === node.id}
                      >
                        {deletingNodeId === node.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
