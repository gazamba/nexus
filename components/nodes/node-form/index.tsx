"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { NodeFormProvider } from "@/components/nodes/node-form/context";
import { Header } from "@/components/nodes/node-form/header";
import { NodeInput } from "@/types/types";
import { Tabs } from "@/components/nodes/node-form/tabs";
import { Inputs } from "@/components/nodes/node-form/inputs";
import { Actions } from "@/components/nodes/node-form/actions";

interface NodeFormProps {
  nodeId?: string;
}

export function NodeForm({ nodeId }: NodeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
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
    activeTab: "inputs",
  });

  const [inputs, setInputs] = useState<NodeInput[]>([]);

  useEffect(() => {
    if (nodeId) {
      fetchNodeData(nodeId);
    }
  }, [nodeId]);

  const fetchNodeData = async (id: string) => {
    try {
      const response = await fetch(`/api/nodes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch node data");

      const data = await response.json();
      setFormData({
        name: data.name,
        description: data.description,
        type: data.type,
        code: data.code,
        inputs: data.inputs,
        credentials: data.credentials,
        is_public: data.is_public,
        activeTab: "inputs",
      });
      setInputs(data.inputs);
    } catch (err: any) {
      console.error("Error fetching node data:", err);
      setError(err.message);
      toast({
        title: "Error",
        description:
          err.message || "Failed to fetch node data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        nodeId ? `/api/nodes/${nodeId}` : "/api/nodes",
        {
          method: nodeId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, inputs }),
        }
      );

      if (!response.ok) throw new Error("Failed to save node");

      toast({
        title: "Success",
        description: `Node ${nodeId ? "updated" : "created"} successfully`,
      });
      router.push("/nodes");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to save node. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <NodeFormProvider
      value={{
        formData,
        setFormData,
        inputs,
        setInputs,
        loading,
        error,
        nodeId,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Header />
        <Tabs />
        <Inputs />
        <Actions />
      </form>
    </NodeFormProvider>
  );
}
