"use client";

import { useNodeForm } from "./context";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Code() {
  const { formData, setFormData } = useNodeForm();

  const handleCodeChange = (value: string) => {
    setFormData({
      ...formData,
      code: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Code</h2>
      </div>

      <div className="space-y-2">
        <Label>Node Code</Label>
        <Textarea
          value={formData.code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Enter node code here..."
          className="font-mono min-h-[400px]"
        />
      </div>
    </div>
  );
}
