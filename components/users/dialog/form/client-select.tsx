"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Client, availableClients } from "../types";

interface ClientSelectProps {
  selectedClients: Record<string, boolean>;
  onClientToggle: (clientId: string) => void;
}

export function ClientSelect({
  selectedClients,
  onClientToggle,
}: ClientSelectProps) {
  return (
    <div className="grid gap-2">
      <Label>Assigned Clients</Label>
      <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
        {availableClients.map((client) => (
          <div key={client.id} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`client-${client.id}`}
              checked={selectedClients[client.id] || false}
              onCheckedChange={() => onClientToggle(client.id)}
            />
            <Label
              htmlFor={`client-${client.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {client.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
