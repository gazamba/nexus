"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Save } from "lucide-react";

interface TestInputsProps {
  node: any;
  inputValues: Record<string, any>;
  isRunning: boolean;
  onInputChange: (name: string, value: string) => void;
  onRunNode: () => void;
  onSaveTest: () => void;
}

function getPlaceholder(type: string) {
  switch (type) {
    case "string":
      return "Enter text...";
    case "number":
      return "Enter a number...";
    case "boolean":
      return "Select true or false...";
    case "object":
      return 'Enter JSON object (e.g., {"key": "value"})...';
    case "array":
      return 'Enter JSON array (e.g., ["item1", "item2"])...';
    default:
      return "Enter value...";
  }
}

export function TestInputs({
  node,
  inputValues,
  isRunning,
  onInputChange,
  onRunNode,
  onSaveTest,
}: TestInputsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Inputs</CardTitle>
      </CardHeader>
      <CardContent>
        {node.inputs && node.inputs.length > 0 ? (
          <div className="space-y-4">
            {node.inputs.map((input: any) => (
              <div key={input.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {input.name}
                  {input.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                  <span className="text-muted-foreground ml-2">
                    ({input.type})
                  </span>
                </label>
                {input.type === "boolean" ? (
                  <select
                    className="w-full p-2 border rounded-md"
                    value={inputValues[input.name] || ""}
                    onChange={(e) => onInputChange(input.name, e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <textarea
                    className="w-full p-2 border rounded-md font-mono text-sm"
                    rows={
                      input.type === "object" || input.type === "array" ? 4 : 1
                    }
                    placeholder={getPlaceholder(input.type)}
                    value={inputValues[input.name] || ""}
                    onChange={(e) => onInputChange(input.name, e.target.value)}
                  />
                )}
                {input.description && (
                  <p className="text-xs text-muted-foreground">
                    {input.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            This node does not have any defined inputs.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSaveTest}>
          <Save className="h-4 w-4 mr-2" />
          Save Test
        </Button>
        <Button onClick={onRunNode} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running..." : "Run Node"}
        </Button>
      </CardFooter>
    </Card>
  );
}
