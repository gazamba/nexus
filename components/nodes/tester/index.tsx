"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { NodeInputsTester } from "./inputs-tester";
import type { Node, NodeInput } from "@/types/types";
import { useAuth } from "@/contexts/auth-provider";

interface NodeTesterProps {
  node: Node;
}

export function NodeTester({ node }: NodeTesterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nodeData, setNodeData] = useState<Node | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNode = async () => {
      const response = await fetch(`/api/nodes/${node.id}`);
      const data = await response.json();
      console.log(`data with all: ${JSON.stringify(data)}`);
      setNodeData(data);
    };
    fetchNode();
  }, [input]);

  const handleTest = async (testValues: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/nodes/${node.id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: testValues }),
      });
      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2)); // Show the result
    } catch (error) {
      console.error("Error testing node:", error);
      setOutput("Error testing node");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Test Node: {node.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NodeInputsTester
            node={nodeData || null}
            nodeInputs={nodeData?.inputs || []}
            onTest={handleTest}
          />
          <div className="space-y-2">
            <Label htmlFor="output">Output</Label>
            <Textarea
              id="output"
              value={output}
              readOnly
              className="h-32 bg-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
