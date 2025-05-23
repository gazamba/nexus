import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/types";
import { createClient } from "@/utils/supabase/client";

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

const TABS = {
  ADMIN: "Admin Users",
  SE: "SE Users",
};

function UserEditDialog({ user, open, onClose, onSave }: any) {
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "client",
    notes: user?.notes || "",
    billing: user?.billing || false,
    admin: user?.admin || false,
    cost_rate: user?.cost_rate || "",
    bill_rate: user?.bill_rate || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "client",
      notes: user?.notes || "",
      billing: user?.billing || false,
      admin: user?.admin || false,
      cost_rate: user?.cost_rate || "",
      bill_rate: user?.bill_rate || "",
    });
  }, [user]);

  if (!open) return null;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profile")
        .update({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          notes: form.notes,
          billing: form.billing,
          admin: form.admin,
          cost_rate: form.role === "se" ? form.cost_rate : null,
          bill_rate: form.role === "se" ? form.bill_rate : null,
        })
        .eq("user_id", user.user_id);
      if (error) throw error;
      onSave();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border rounded px-2 py-1 w-full"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            className="border rounded px-2 py-1 w-full"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="border rounded px-2 py-1 w-full"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            type="tel"
          />
          <select
            className="border rounded px-2 py-1 w-full"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="client">Client</option>
            <option value="se">Solutions Engineer</option>
          </select>
          {form.role === "se" && (
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                name="cost_rate"
                value={form.cost_rate}
                onChange={handleChange}
                placeholder="Cost Rate"
                type="number"
                min="0"
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                name="bill_rate"
                value={form.bill_rate}
                onChange={handleChange}
                placeholder="Bill Rate"
                type="number"
                min="0"
              />
            </div>
          )}
          <input
            className="border rounded px-2 py-1 w-full"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
          />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="billing"
                checked={form.billing}
                onChange={handleChange}
              />
              Billing Access
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="admin"
                checked={form.admin}
                onChange={handleChange}
              />
              Admin Access
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UserTable({ users, clients, canManageUser }: UserTableProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>("ADMIN");
  const [editUser, setEditUser] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  if (!users || users.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  // Filter users by role
  const filteredUsers = users.filter((user) =>
    activeTab === "ADMIN" ? user.role === "admin" : user.role === "se"
  );

  const handleEdit = (user: any) => {
    setEditUser(user);
    setShowEdit(true);
  };

  const handleDelete = async (user: any) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingUser(user.user_id);
    setLoadingDelete(true);
    try {
      const supabase = createClient();
      // Delete from profile
      await supabase.from("profile").delete().eq("user_id", user.user_id);
      // Delete from auth
      await supabase.auth.admin.deleteUser(user.user_id);
      window.location.reload();
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setLoadingDelete(false);
      setDeletingUser(null);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex gap-2 p-4 bg-muted/50">
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "ADMIN"
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
          onClick={() => setActiveTab("ADMIN")}
        >
          Admin Users
        </button>
        <button
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "SE"
              ? "bg-black text-white"
              : "bg-white text-black border"
          }`}
          onClick={() => setActiveTab("SE")}
        >
          SE Users
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Phone</TableHeader>
            {activeTab === "SE" && (
              <>
                <TableHeader>Cost Rate</TableHeader>
                <TableHeader>Bill Rate</TableHeader>
                <TableHeader>Assigned Clients</TableHeader>
              </>
            )}
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr className="border-t" key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={(user as any).avatar || ""}
                      alt={user.full_name || user.email}
                    />
                    <AvatarFallback>
                      {user.full_name
                        ? user.full_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : user.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{(user as any).phone || "-"}</TableCell>
              {activeTab === "SE" && (
                <>
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
                </>
              )}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user)}
                    disabled={loadingDelete && deletingUser === user.user_id}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
      <UserEditDialog
        user={editUser}
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={() => window.location.reload()}
      />
    </div>
  );
}

function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({ children }: TableCellProps) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}

export { UserEditDialog };
