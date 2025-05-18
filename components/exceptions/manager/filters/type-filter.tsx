"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  return (
    <div>
      <label
        htmlFor="type-filter"
        className="block text-sm mb-1 text-muted-foreground"
      >
        Exception type
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="type-filter">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="integration">Integration</SelectItem>
          <SelectItem value="data">Data</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
