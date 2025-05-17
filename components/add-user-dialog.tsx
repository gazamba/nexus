"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Client {
  id: string;
  name: string;
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: {
    name: string;
    email: string;
    role: "admin" | "client" | "se";
  }) => void;
}

const availableClients: Client[] = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Globex Inc" },
  { id: "3", name: "Initech" },
];

export function AddUserDialog({
  open,
  onOpenChange,
  onAddUser,
}: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "client" | "se">("client");
  const [selectedClients, setSelectedClients] = useState<
    Record<string, boolean>
  >({});

  const handleClientToggle = (clientId: string) => {
    setSelectedClients((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({ name, email, role });
    setName("");
    setEmail("");
    setRole("client");
    setSelectedClients({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value: "admin" | "client" | "se") =>
                setRole(value)
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="se">Solutions Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "se" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="cost-rate">Hourly Rate: Cost</Label>
                <Input id="cost-rate" placeholder="$0/hr" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bill-rate">Hourly Rate: Billable</Label>
                <Input id="bill-rate" placeholder="$0/hr" required />
              </div>
              <div className="grid gap-2">
                <Label>Assigned Clients</Label>
                <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                  {availableClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={selectedClients[client.id] || false}
                        onCheckedChange={() => handleClientToggle(client.id)}
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
            </>
          )}
          <Button type="submit" className="w-full">
            Add User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
