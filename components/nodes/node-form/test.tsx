"use client";

import { useNodeForm } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { useState } from "react";

export function Test() {
  const { formData } = useNodeForm();
  const [testInputs, setTestInputs] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const response = await fetch("/api/nodes/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          inputs: testInputs,
        }),
      });

      if (!response.ok) throw new Error("Test failed");
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error("Test error:", error);
      setTestResult({ error: "Test failed" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setTestInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Test Node</h2>
        <Button onClick={handleTest} disabled={isTesting}>
          <Play className="h-4 w-4 mr-2" />
          {isTesting ? "Running..." : "Run Test"}
        </Button>
      </div>

      <div className="space-y-4">
        {formData.inputs?.map((input, index) => (
          <div key={index} className="space-y-2">
            <Label>{input.name}</Label>
            <Input
              type={input.type === "number" ? "number" : "text"}
              value={testInputs[input.name] || ""}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              placeholder={`Enter ${input.name}`}
            />
          </div>
        ))}
      </div>

      {testResult && (
        <div className="mt-4 p-4 rounded-md bg-muted">
          <h3 className="font-medium mb-2">Test Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
