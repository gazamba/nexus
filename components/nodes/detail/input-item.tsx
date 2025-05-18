"use client";

import { NodeInput } from "@/types/types";

interface InputItemProps {
  input: NodeInput;
}

export function InputItem({ input }: InputItemProps) {
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium mb-2">{input.name}</h4>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Type</dt>
          <dd className="font-medium">{input.type}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Required</dt>
          <dd className="font-medium">{input.required ? "Yes" : "No"}</dd>
        </div>
      </dl>
      {input.description && (
        <div className="mt-2">
          <h5 className="text-sm font-medium mb-1">Description</h5>
          <p className="text-sm text-muted-foreground">{input.description}</p>
        </div>
      )}
    </div>
  );
}
