"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Node {
  id: string;
  name: string;
  type: string;
}

interface NodeTesterProps {
  node: Node;
}

export function NodeTester({ node }: NodeTesterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual node testing logic
      setOutput("Test output will appear here");
    } catch (error) {
      console.error("Error testing node:", error);
      setOutput("Error testing node");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Node: {node.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter test input..."
              className="h-32"
            />
          </div>
          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Node"}
          </Button>
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
