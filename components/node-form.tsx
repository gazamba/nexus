"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Play } from "lucide-react";
import { NodeInput } from "@/types/types";

interface CredentialType {
  id: string;
  name: string;
  service: string;
  fields: { name: string; variable: string }[];
}

export function NodeForm({ nodeId }: { nodeId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testLogs, setTestLogs] = useState<any[]>([]);
  const [testError, setTestError] = useState<string | null>(null);
  const [credentialTypes, setCredentialTypes] = useState<CredentialType[]>();
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [testInputs, setTestInputs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(nodeId ? true : false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "email",
    code: `// This function will be executed when the node runs
// You have access to the inputs object and context
async function execute(inputs, context) {
  // Your code here
  
  // Access credentials
  // const slackCredentials = context.credentials.slack;
  // const workspaceUrl = slackCredentials.WORKSPACE_URL;
  
  // Log information
  await context.logger.info("Node execution started", { inputs });
  
  // Return outputs
  return {
    // Your outputs here
    success: true,
    message: "Node executed successfully"
  };
}

// Return the execute function
return execute;`,
    inputs: [],
    credentials: [],
    is_public: false,
  });

  const [inputs, setInputs] = useState<NodeInput[]>([]);

  useEffect(() => {
    if (nodeId) {
      console.log("Fetching node data for editing:", nodeId);
      setLoading(true);

      fetch(`/api/nodes/${nodeId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch node data");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Node data:", data);
          setFormData({
            name: data.name,
            description: data.description,
            type: data.type,
            code: data.code,
            inputs: data.inputs,
            credentials: data.credentials,
            is_public: data.is_public,
          });

          setInputs(data.inputs);
          setSelectedCredentials(data.credentials);
          setCredentialTypes(data.credentials);
        })
        .catch((err) => {
          console.error("Error fetching node data:", err);
          setError(err.message);
          toast({
            title: "Error",
            description:
              err.message || "Failed to fetch node data. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [nodeId, toast]);

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        id: `new-${Date.now()}`,
        node_id: nodeId || "",
        name: "",
        type: "string",
        description: "",
        required: false,
      },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof NodeInput,
    value: any
  ) => {
    const newInputs = [...inputs];
    newInputs[index] = {
      ...newInputs[index],
      [field]: value,
    };
    setInputs(newInputs);
  };

  const handleCredentialToggle = (credentialId: string) => {
    if (selectedCredentials.includes(credentialId)) {
      setSelectedCredentials(
        selectedCredentials.filter((id) => id !== credentialId)
      );
    } else {
      setSelectedCredentials([...selectedCredentials, credentialId]);
    }
  };

  const handleTestInputChange = (name: string, value: string) => {
    try {
      // Try to parse as JSON if it looks like an object or array
      if (
        (value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]"))
      ) {
        setTestInputs({
          ...testInputs,
          [name]: JSON.parse(value),
        });
      } else {
        setTestInputs({
          ...testInputs,
          [name]: value,
        });
      }
    } catch (e) {
      // If parsing fails, store as string
      setTestInputs({
        ...testInputs,
        [name]: value,
      });
    }
  };

  const handleTestNode = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestLogs([]);
    setTestError(null);

    try {
      const response = await fetch(`/api/node/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.code,
          inputs: testInputs,
          credentials: selectedCredentials,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to test node");
      }

      setTestResult(data.result);
      setTestLogs(data.logs || []);

      toast({
        title: "Node tested successfully",
        description: "Check the results tab to see the output.",
      });
    } catch (error: any) {
      console.error("Error testing node:", error);
      setTestError(error.message || "An error occurred while testing the node");
      toast({
        title: "Error",
        description:
          error.message || "Failed to test the node. Please try again.",
        variant: "destructive",
      });
      setIsTesting(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: any) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Submitting node data:", formData);

      const updatedFormData = {
        ...formData,
        inputs,
        credentials: selectedCredentials,
      };

      console.log("Updated form data:", updatedFormData);
      console.log(
        nodeId ? "Node updated successfully!" : "Node created successfully!"
      );

      const data = { id: nodeId || "new-node-" + Date.now() };

      toast({
        title: nodeId ? "Node updated" : "Node created",
        description: nodeId
          ? "The node has been updated successfully."
          : "The node has been created successfully.",
      });

      setTimeout(() => {
        router.push("/nodes");
      }, 1000);
    } catch (err: any) {
      console.error("Error saving node:", err);
      setError(err.message);
      toast({
        title: "Error",
        description:
          err.message || "Failed to save the node. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>{nodeId ? "Loading node data..." : "Preparing form..."}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{nodeId ? "Edit Node" : "Create New Node"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              {nodeId && <TabsTrigger value="test">Test</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter node name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter node description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="messaging">Messaging</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_public: checked }))
                  }
                />
                <Label htmlFor="is_public">Make this node public</Label>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Node Code</Label>
                <Textarea
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter node code"
                  className="font-mono"
                  rows={15}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="inputs" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Node Inputs</h3>
                <Button
                  type="button"
                  onClick={handleAddInput}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Input
                </Button>
              </div>

              {inputs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No inputs defined. Add an input to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {inputs.map((input, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveInput(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor={`input-name-${index}`}>Name</Label>
                          <Input
                            id={`input-name-${index}`}
                            value={input.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            placeholder="e.g., emailAddress"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`input-type-${index}`}>Type</Label>
                          <Select
                            value={input.type}
                            onValueChange={(value) =>
                              handleInputChange(index, "type", value)
                            }
                          >
                            <SelectTrigger id={`input-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label htmlFor={`input-description-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`input-description-${index}`}
                          value={input.description ?? ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this input..."
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`input-required-${index}`}
                          checked={input.required}
                          onCheckedChange={(checked) =>
                            handleInputChange(index, "required", checked)
                          }
                        />
                        <Label htmlFor={`input-required-${index}`}>
                          Required
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Required Credentials</h3>
              <p className="text-muted-foreground mb-4">
                Select the credentials this node needs to access external
                services.
              </p>

              <div className="space-y-4">
                {credentialTypes?.map((credType) => (
                  <div key={credType.id} className="border rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch
                        id={`cred-${credType.id}`}
                        checked={selectedCredentials.includes(credType.id)}
                        onCheckedChange={() =>
                          handleCredentialToggle(credType.id)
                        }
                      />
                      <Label
                        htmlFor={`cred-${credType.id}`}
                        className="font-medium"
                      >
                        {credType.name}
                      </Label>
                    </div>

                    {selectedCredentials.includes(credType.id) && (
                      <div className="mt-2 pl-6 border-l-2 border-gray-200">
                        <h4 className="text-sm font-medium mb-2">
                          Available Variables:
                        </h4>
                        <div className="space-y-1">
                          {credType.fields.map((field) => (
                            <div key={field.variable} className="text-sm">
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                context.credentials.
                                {credType.service.toLowerCase()}.
                                {field.variable}
                              </code>
                              <span className="text-muted-foreground ml-2">
                                {field.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {nodeId && (
              <TabsContent value="test">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <h3 className="text-lg font-medium">Test Node</h3>

                    <div className="space-y-4">
                      <h4 className="font-medium">Test Inputs</h4>
                      {inputs.length > 0 ? (
                        <div className="space-y-4">
                          {inputs.map((input) => (
                            <div key={input.name} className="space-y-2">
                              <Label htmlFor={`test-${input.name}`}>
                                {input.name}
                                {input.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                                <span className="text-muted-foreground ml-2">
                                  ({input.type})
                                </span>
                              </Label>
                              {input.type === "boolean" ? (
                                <Select
                                  value={testInputs[input.name] || ""}
                                  onValueChange={(value) =>
                                    handleTestInputChange(input.name, value)
                                  }
                                >
                                  <SelectTrigger id={`test-${input.name}`}>
                                    <SelectValue placeholder="Select value" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Textarea
                                  id={`test-${input.name}`}
                                  value={testInputs[input.name] || ""}
                                  onChange={(e) =>
                                    handleTestInputChange(
                                      input.name,
                                      e.target.value
                                    )
                                  }
                                  placeholder={getPlaceholder(input.type)}
                                  rows={
                                    input.type === "object" ||
                                    input.type === "array"
                                      ? 4
                                      : 1
                                  }
                                  className="font-mono text-sm"
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
                          No inputs defined for this node.
                        </p>
                      )}

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleTestNode}
                          disabled={isTesting}
                          className="mt-4"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isTesting ? "Testing..." : "Test Node"}
                        </Button>
                      </div>
                    </div>

                    {(testResult || testError || testLogs.length > 0) && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-medium">Test Results</h4>

                        {testError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                            <h5 className="font-medium mb-2">Error</h5>
                            <p className="font-mono text-sm">{testError}</p>
                          </div>
                        )}

                        {testResult && (
                          <div className="space-y-2">
                            <h5 className="font-medium">Output</h5>
                            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-sm">
                              {JSON.stringify(testResult, null, 2)}
                            </pre>
                          </div>
                        )}

                        {testLogs.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium">Logs</h5>
                            <div className="space-y-2">
                              {testLogs.map((log, index) => (
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
                                      [
                                      {new Date(
                                        log.timestamp
                                      ).toLocaleTimeString()}
                                      ]
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
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : nodeId ? "Update Node" : "Create Node"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
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
