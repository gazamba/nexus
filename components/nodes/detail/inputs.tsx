"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Node } from "@/types/types";
import { InputItem } from "./input-item";

interface InputsProps {
  node: Node;
}

export function Inputs({ node }: InputsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {node.inputs && node.inputs.length > 0 ? (
          <div className="space-y-4">
            {node.inputs.map((input) => (
              <InputItem key={input.id} input={input} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No inputs defined for this node.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
