import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/types";

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableCellProps {
  children: React.ReactNode;
}

interface UserTableProps {
  users: User[];
  clients?: any[];
  canManageUser?: (user: User) => boolean;
}

export function UserTable({ users, canManageUser }: UserTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-t" key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {canManageUser?.(user) && (
                    <>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({ children }: TableCellProps) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}
