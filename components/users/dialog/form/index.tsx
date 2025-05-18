"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RoleSelect } from "./role-select";
import { ClientSelect } from "./client-select";
import { RateInputs } from "./rate-inputs";
import { UserRole } from "../types";

interface UserFormProps {
  onSubmit: (user: { name: string; email: string; role: UserRole }) => void;
  onCancel: () => void;
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("client");
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
    onSubmit({ name, email, role });
    setName("");
    setEmail("");
    setRole("client");
    setSelectedClients({});
  };

  return (
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
      <RoleSelect value={role} onChange={setRole} />
      {role === "se" && (
        <>
          <RateInputs />
          <ClientSelect
            selectedClients={selectedClients}
            onClientToggle={handleClientToggle}
          />
        </>
      )}
      <Button type="submit" className="w-full">
        Add User
      </Button>
    </form>
  );
}
