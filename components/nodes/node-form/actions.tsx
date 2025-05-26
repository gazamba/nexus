"use client";

import { useNodeForm } from "./context";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Actions({ nodeId }: { nodeId: string }) {
  const { formData } = useNodeForm();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = nodeId ? "PATCH" : "POST";
      const url = nodeId ? `/api/nodes/${nodeId}` : "/api/nodes";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast({
          title: "Failed to save node",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Node saved successfully",
        description: "Your node has been saved.",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Failed to save node",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-end gap-4">
      <Button onClick={handleSave} disabled={isSaving}>
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Saving..." : "Save Node"}
      </Button>
    </div>
  );
}
