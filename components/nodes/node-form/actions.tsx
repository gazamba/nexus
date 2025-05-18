"use client";

import { useNodeForm } from "./context";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Actions() {
  const { formData } = useNodeForm();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/nodes", {
        method: formData.name ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save node");
      router.push("/nodes");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save node. Please try again.");
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
