"use client";

import { useNodeForm } from "./context";
import { NodeInput } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function Inputs() {
  const { formData, setFormData } = useNodeForm();

  const handleAddInput = (e: React.MouseEvent) => {
    e.preventDefault();
    const newInput: NodeInput = {
      id: `new-${Date.now()}`,
      node_id: formData.name ? "temp" : "",
      name: "",
      type: "string",
      required: false,
      description: null,
    };

    setFormData({
      ...formData,
      inputs: [...(formData.inputs || []), newInput],
    });
  };

  const handleRemoveInput = (index: number) => {
    const newInputs = [...formData.inputs];
    newInputs.splice(index, 1);
    setFormData({
      ...formData,
      inputs: newInputs,
    });
  };

  const handleInputChange = (
    index: number,
    field: keyof NodeInput,
    value: any
  ) => {
    const newInputs = [...formData.inputs];
    newInputs[index] = {
      ...newInputs[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      inputs: newInputs,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <Button onClick={handleAddInput}>
          <Plus className="h-4 w-4 mr-2" />
          Add Input
        </Button>
      </div>

      <div className="space-y-4">
        {formData.inputs?.map((input, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Name</Label>
              <Input
                value={input.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                placeholder="Input name"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Type</Label>
              <select
                value={input.type}
                onChange={(e) =>
                  handleInputChange(index, "type", e.target.value)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={input.required}
                onChange={(e) =>
                  handleInputChange(index, "required", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label>Required</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveInput(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
