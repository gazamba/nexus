"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientFilter({ value, onChange }: ClientFilterProps) {
  return (
    <div>
      <label
        htmlFor="client-filter"
        className="block text-sm mb-1 text-muted-foreground"
      >
        Client name
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="client-filter">
          <SelectValue placeholder="All clients" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All clients</SelectItem>
          <SelectItem value="acme">Acme Corp</SelectItem>
          <SelectItem value="globex">Globex</SelectItem>
          <SelectItem value="initech">Initech</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
