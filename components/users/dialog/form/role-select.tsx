"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "../types";

interface RoleSelectProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
