import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/types";

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableCellProps {
  children: React.ReactNode;
}

interface UserTableProps {
  users: Profile[];
  clients?: any[];
  canManageUser?: (user: Profile) => boolean;
}

export function UserTable({ users, clients, canManageUser }: UserTableProps) {
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
            <TableHeader>Phone</TableHeader>
            <TableHeader>Cost Rate</TableHeader>
            <TableHeader>Bill Rate</TableHeader>
            <TableHeader>Assigned Clients</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-t" key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={(user as any).avatar || ""}
                      alt={user.name || user.email}
                    />
                    <AvatarFallback>
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : user.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{(user as any).phone || "-"}</TableCell>
              <TableCell>
                {(user as any).cost_rate
                  ? `$${(user as any).cost_rate}/hr`
                  : "-"}
              </TableCell>
              <TableCell>
                {(user as any).bill_rate
                  ? `$${(user as any).bill_rate}/hr`
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {((user as any).assigned_clients || []).map(
                    (client: string) => (
                      <span
                        key={client}
                        className="bg-muted px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {client}
                      </span>
                    )
                  )}
                </div>
              </TableCell>
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
