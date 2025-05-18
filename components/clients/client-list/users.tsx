"use client";

import { Check } from "lucide-react";
import { User } from "./types";

interface UsersProps {
  users: User[];
}

export function Users({ users }: UsersProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Client Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Phone</th>
              <th className="text-left p-4 font-medium">Billing</th>
              <th className="text-left p-4 font-medium">Admin</th>
              <th className="text-left p-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">
                  {user.billing && <Check className="h-4 w-4 text-green-500" />}
                </td>
                <td className="p-4">
                  {user.admin && <Check className="h-4 w-4 text-green-500" />}
                </td>
                <td className="p-4">{user.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
