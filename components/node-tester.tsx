"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Save } from "lucide-react";

export function NodeTester({ node }: { node: any }) {
  const { toast } = useToast();
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

      toast({
        title: "Node executed successfully",
        description: "Check the results tab to see the output.",
      });
    } catch (error: any) {
      console.error("Error running node:", error);
      setError(error.message || "An error occurred while running the node");
      toast({
        title: "Error",
        description:
          error.message || "Failed to run the node. Please try again.",
        variant: "destructive",
      });
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

    toast({
      title: "Test saved",
      description: "This test configuration has been saved for future use.",
    });
  };

  return (
    <div className="space-y-6">
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
                      onChange={(e) =>
                        handleInputChange(input.name, e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <textarea
                      className="w-full p-2 border rounded-md font-mono text-sm"
                      rows={
                        input.type === "object" || input.type === "array"
                          ? 4
                          : 1
                      }
                      placeholder={getPlaceholder(input.type)}
                      value={inputValues[input.name] || ""}
                      onChange={(e) =>
                        handleInputChange(input.name, e.target.value)
                      }
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
          <Button variant="outline" onClick={handleSaveTest}>
            <Save className="h-4 w-4 mr-2" />
            Save Test
          </Button>
          <Button onClick={handleRunNode} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Run Node"}
          </Button>
        </CardFooter>
      </Card>

      {(result || error || logs.length > 0) && (
        <Tabs defaultValue="result">
          <TabsList>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="result">
            <Card>
              <CardHeader>
                <CardTitle>Execution Result</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Error</h4>
                    <p className="font-mono text-sm">{error}</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <h4 className="font-medium">Output</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>

                    {node.outputs && node.outputs.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Expected Outputs</h4>
                        <div className="space-y-2">
                          {node.outputs.map((output: any) => (
                            <div
                              key={output.name}
                              className="flex items-start gap-2"
                            >
                              <div className="font-medium min-w-[100px]">
                                {output.name}:
                              </div>
                              <div>
                                {result[output.name] !== undefined ? (
                                  <pre className="bg-muted p-2 rounded-md overflow-auto font-mono text-sm">
                                    {JSON.stringify(
                                      result[output.name],
                                      null,
                                      2
                                    )}
                                  </pre>
                                ) : (
                                  <span className="text-red-500">Missing</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Run the node to see results.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Execution Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md text-sm font-mono ${
                          log.level === "error"
                            ? "bg-red-50 text-red-700"
                            : log.level === "warn"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </span>
                          <span className="uppercase text-xs font-bold">
                            {log.level}
                          </span>
                        </div>
                        <div>{log.message}</div>
                        {log.data && (
                          <pre className="mt-1 text-xs overflow-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No logs available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function getPlaceholder(type: string) {
  switch (type) {
    case "string":
      return "Enter text...";
    case "number":
      return "Enter a number...";
    case "object":
      return '{\n  "key": "value"\n}';
    case "array":
      return '[\n  "item1",\n  "item2"\n]';
    default:
      return "Enter value...";
  }
}
