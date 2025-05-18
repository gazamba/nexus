"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Node } from "@/types/types";

interface CodeProps {
  node: Node;
}

export function Code({ node }: CodeProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-sm">
          {node.code}
        </pre>
      </CardContent>
    </Card>
  );
}
