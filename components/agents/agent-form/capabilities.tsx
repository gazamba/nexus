"use client";

import { useAgentForm } from "./context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CAPABILITIES = [
  "email processing",
  "response generation",
  "scheduling",
  "document parsing",
  "data extraction",
  "summarization",
  "query understanding",
  "ticket routing",
];

export function Capabilities() {
  const { formData, setFormData } = useAgentForm();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Capabilities</Label>
        <div className="grid grid-cols-2 gap-4">
          {CAPABILITIES.map((capability) => (
            <div key={capability} className="flex items-center space-x-2">
              <Switch
                id={capability}
                checked={formData.capabilities?.includes(capability)}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    capabilities: checked
                      ? [...(prev.capabilities || []), capability]
                      : (prev.capabilities || []).filter(
                          (c) => c !== capability
                        ),
                  }));
                }}
              />
              <Label htmlFor={capability}>{capability}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
