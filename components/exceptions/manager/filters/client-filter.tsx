"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterProps } from "../types";
import { Client } from "@/types/types";

interface ClientFilterProps extends FilterProps {
  clients: Client[];
}

export function ClientFilter({
  value,
  onChange,
  label = "Client name",
  placeholder = "All clients",
  clients,
}: ClientFilterProps) {
  return (
    <div>
      <label
        htmlFor="client-filter"
        className="block text-sm mb-1 text-muted-foreground"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="client-filter">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All clients</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
