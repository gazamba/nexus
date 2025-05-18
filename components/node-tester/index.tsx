"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TestInputs } from "./test-inputs";
import { TestResults } from "./test-results";

interface NodeTesterProps {
  node: any;
}

export function NodeTester({ node }: NodeTesterProps) {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: string, value: string) => {
    try {
      if (
        (value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]"))
      ) {
        setInputValues({
          ...inputValues,
          [name]: JSON.parse(value),
        });
      } else {
        setInputValues({
          ...inputValues,
          [name]: value,
        });
      }
    } catch (e) {
      setInputValues({
        ...inputValues,
        [name]: value,
      });
    }
  };

  const handleRunNode = async () => {
    setIsRunning(true);
    setResult(null);
    setLogs([]);
    setError(null);

    try {
      const response = await fetch(`/api/nodes/${node.id}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: inputValues,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to run node");
      }

      setResult(data.result);
      setLogs(data.logs || []);

      toast.success("Node executed successfully");
    } catch (error: any) {
      console.error("Error running node:", error);
      setError(error.message || "An error occurred while running the node");
      toast.error("Failed to execute node");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveTest = () => {
    const testConfig = {
      nodeId: node.id,
      inputs: inputValues,
      name: `Test for ${node.name} - ${new Date().toLocaleString()}`,
    };

    toast.success("Test saved");
  };

  return (
    <div className="space-y-6">
      <TestInputs
        node={node}
        inputValues={inputValues}
        isRunning={isRunning}
        onInputChange={handleInputChange}
        onRunNode={handleRunNode}
        onSaveTest={handleSaveTest}
      />

      <TestResults result={result} error={error} logs={logs} node={node} />
    </div>
  );
}
