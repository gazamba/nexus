"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowOption } from "./types";

interface WorkflowSelectProps {
  options: WorkflowOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export function WorkflowSelect({
  options,
  value,
  onValueChange,
}: WorkflowSelectProps) {
  return (
    <div className="w-64">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select workflow" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
