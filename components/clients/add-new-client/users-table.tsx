"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  name: string;
  email: string;
  phone: string;
  department: string;
  exceptions: string[];
  access: string[];
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const addUser = () => {
    setUsers([
      ...users,
      {
        name: "",
        email: "",
        phone: "",
        department: "",
        exceptions: [],
        access: [],
      },
    ]);
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium mb-4">Users</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Exceptions
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Access
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <Input placeholder="Full name" className="h-9" />
                </td>
                <td className="px-4 py-2">
                  <Input placeholder="Email" className="h-9" />
                </td>
                <td className="px-4 py-2">
                  <Input placeholder="Phone" className="h-9" />
                </td>
                <td className="px-4 py-2">
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept, index) => (
                        <SelectItem key={index} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id={`email-${index}`} />
                    <label htmlFor={`email-${index}`} className="text-sm">
                      Email
                    </label>
                    <Checkbox id={`sms-${index}`} />
                    <label htmlFor={`sms-${index}`} className="text-sm">
                      SMS
                    </label>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`billing-access-${index}`} />
                      <label
                        htmlFor={`billing-access-${index}`}
                        className="text-sm"
                      >
                        Billing Access
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`admin-access-${index}`} />
                      <label
                        htmlFor={`admin-access-${index}`}
                        className="text-sm"
                      >
                        Admin Access
                      </label>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="outline" className="mt-4" onClick={addUser}>
        + Add User
      </Button>
    </div>
  );
}
