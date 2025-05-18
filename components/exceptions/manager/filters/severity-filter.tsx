"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeverityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SeverityFilter({ value, onChange }: SeverityFilterProps) {
  return (
    <div>
      <label
        htmlFor="severity-filter"
        className="block text-sm mb-1 text-muted-foreground"
      >
        Severity
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="severity-filter">
          <SelectValue placeholder="All severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
