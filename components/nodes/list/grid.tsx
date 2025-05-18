"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { NodeListItem } from "@/types/types";

interface NodeGridProps {
  nodes: NodeListItem[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  const router = useRouter();

  const handleEditNode = (nodeId: string) => {
    console.log("Navigating to edit page for node:", nodeId);
    router.push(`/nodes/${nodeId}/edit`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
