"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NodeInput, NodeInputInsert } from "@/types/types";

interface NodeFormProps {
  nodeId?: string;
}

export function NodeForm({ nodeId }: NodeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    is_public: false,
    workflow_id: "",
    credentials: [],
  });
  const [nodeInputs, setNodeInputs] = useState<NodeInputInsert[]>([]);

  useEffect(() => {
    if (nodeId) {
      fetchNode();
    }
  }, [nodeId]);

  const fetchNode = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/nodes/${nodeId}`);
      if (response.ok) {
        const node = await response.json();
        setFormData({
          name: node.name || "",
          description: node.description || "",
          code: node.code || "",
          is_public: node.is_public || false,
          workflow_id: node.workflow_id || "",
          credentials: node.credentials || [],
        });
        setNodeInputs(node.inputs || []);
      }
    } catch (error) {
      console.error("Error fetching node:", error);
      toast({
        title: "Error",
        description: "Failed to fetch node details",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = nodeId ? `/api/nodes/${nodeId}` : "/api/nodes";
      const method = nodeId ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, inputs: nodeInputs }),
      });
      if (!response.ok) throw new Error("Failed to save node");
      toast({
        title: "Success",
        description: `Node ${nodeId ? "updated" : "created"} successfully`,
      });
      router.push("/nodes");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save node",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (isFetching && nodeId) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
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
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter node description"
            rows={4}
            required
          />
        </div>
        <div>
          <Label>Inputs</Label>
          <div className="space-y-2">
            {nodeInputs.map((input, idx) => (
              <div
                key={input.id || idx}
                className="flex flex-wrap gap-2 items-end border p-2 rounded-md"
              >
                <div className="flex-1 min-w-[120px]">
                  <Label>Name</Label>
                  <Input
                    value={input.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNodeInputs((inputs) =>
                        inputs.map((inp, i) =>
                          i === idx ? { ...inp, name: v } : inp
                        )
                      );
                    }}
                    placeholder="Input name"
                    required
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <Label>Type</Label>
                  <select
                    value={input.type}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNodeInputs((inputs) =>
                        inputs.map((inp, i) =>
                          i === idx ? { ...inp, type: v } : inp
                        )
                      );
                    }}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                    <option value="boolean">boolean</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <Label>Description</Label>
                  <Input
                    value={input.description || ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNodeInputs((inputs) =>
                        inputs.map((inp, i) =>
                          i === idx ? { ...inp, description: v } : inp
                        )
                      );
                    }}
                    placeholder="Description"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <Label>Value</Label>
                  <Input
                    value={
                      typeof input.value === "string" ||
                      typeof input.value === "number"
                        ? input.value
                        : input.value
                        ? String(input.value)
                        : ""
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      setNodeInputs((inputs) =>
                        inputs.map((inp, i) =>
                          i === idx ? { ...inp, value: v } : inp
                        )
                      );
                    }}
                    placeholder="Value"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!input.required}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setNodeInputs((inputs) =>
                        inputs.map((inp, i) =>
                          i === idx ? { ...inp, required: v } : inp
                        )
                      );
                    }}
                  />
                  <Label>Required</Label>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setNodeInputs((inputs) =>
                      inputs.filter((_, i) => i !== idx)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setNodeInputs((inputs) => [
                  ...inputs,
                  {
                    node_id: "",
                    name: "",
                    type: "",
                    required: false,
                    description: "",
                    value: null,
                  },
                ])
              }
            >
              Add Input
            </Button>
          </div>
        </div>
        {Array.isArray(formData.credentials) &&
          formData.credentials.length > 0 && (
            <div className="mb-4">
              <div className="font-semibold mb-1">Available Credentials</div>
              <div className="space-y-1 text-sm">
                {Object.entries(
                  formData.credentials.reduce(
                    (acc: Record<string, string[]>, cred: any) => {
                      if (!cred.provider) return acc;
                      if (!acc[cred.provider]) acc[cred.provider] = [];
                      if (cred.variable_name)
                        acc[cred.provider].push(cred.variable_name);
                      return acc;
                    },
                    {}
                  )
                ).map(([provider, vars]) => (
                  <div key={provider}>
                    <span className="font-medium">{provider}:</span>{" "}
                    {(vars as string[]).join(", ")}
                  </div>
                ))}
              </div>
            </div>
          )}
        <div>
          <Label htmlFor="code">Code</Label>
          <Textarea
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter node code"
            rows={10}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={!!formData.is_public}
            onChange={handleChange}
          />
          <Label htmlFor="is_public">Is Public</Label>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : nodeId ? "Update Node" : "Create Node"}
      </Button>
    </form>
  );
}
