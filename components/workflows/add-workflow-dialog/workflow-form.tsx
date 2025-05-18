"use client";

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

interface WorkflowFormProps {
  department: string;
  workflowName: string;
  description: string;
  onDepartmentChange: (value: string) => void;
  onWorkflowNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function WorkflowForm({
  department,
  workflowName,
  description,
  onDepartmentChange,
  onWorkflowNameChange,
  onDescriptionChange,
}: WorkflowFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">
          Department
        </Label>
        <div className="col-span-3">
          <Select
            value={department}
            onValueChange={onDepartmentChange}
            required
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="workflowName" className="text-right">
          Workflow Name
        </Label>
        <Input
          id="workflowName"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="col-span-3"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
    </div>
  );
}
