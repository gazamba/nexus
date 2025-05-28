"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserTable } from "@/components/user-table";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { UserEditDialog } from "@/components/user-table";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      setLoading(true);
      if (user?.role === "admin") {
        const { data: allUsers } = await supabase.from("user").select("*");
        const { data: allClients } = await supabase.from("client").select("*");

        const seUserIds = (allUsers || [])
          .filter((u) => u.role === "se")
          .map((u) => u.user_id);

        let seAssignments: any[] = [];
        if (seUserIds.length > 0) {
          const { data: assignments } = await supabase
            .from("solutions_engineer_assignment")
            .select("se_user_id, client_id")
            .in("se_user_id", seUserIds);
          seAssignments = assignments || [];
        }

        const usersWithClients = (allUsers || []).map((u) => {
          if (u.role === "se") {
            const assignedClientIds = seAssignments
              .filter((a) => a.se_user_id === u.user_id)
              .map((a) => a.client_id);
            return {
              ...u,
              assigned_clients: assignedClientIds.map(
                (cid: string) =>
                  allClients?.find((c: any) => c.id === cid)?.name || cid
              ),
            };
          } else {
            return {
              ...u,
              assigned_clients: (u.assigned_clients_ids || []).map(
                (cid: string) =>
                  allClients?.find((c: any) => c.id === cid)?.name || cid
              ),
            };
          }
        });

        setUsers(usersWithClients);
        setClients(allClients || []);
        setShowAddUser(true);
      } else if (user?.role === "se") {
        const { data: assignments } = await supabase
          .from("solutions_engineer_assignment")
          .select("client_id")
          .eq("se_user_id", user.id);
        console.log(`assignments: ${JSON.stringify(assignments, null, 2)}`);
        const clientIds = assignments?.map((a) => a.client_id) || [];
        const { data: allClients } = await supabase
          .from("client")
          .select("*")
          .in("id", clientIds);
        const { data: clientUserAssignments } = await supabase
          .from("client_user_assignment")
          .select("client_user_id, client_id")
          .in("client_id", clientIds);
        const clientUserIds =
          clientUserAssignments?.map((a) => a.client_user_id) || [];
        const { data: clientUsers } = await supabase
          .from("user")
          .select("*")
          .in("id", clientUserIds);
        console.log(`clientUsers: ${JSON.stringify(clientUsers, null, 2)}`);
        const usersWithClients = (clientUsers || []).map((u) => ({
          ...u,
          assigned_clients: (u.assigned_clients_ids || []).map(
            (cid: string) =>
              allClients?.find((c: any) => c.id === cid)?.name || cid
          ),
        }));

        setUsers(usersWithClients);
        setClients(allClients || []);
        setShowAddUser(false);
      }
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const canManageUser = (rowUser: User) => {
    if (user?.role === "admin") return true;
    if (user?.role === "se" && rowUser.role === "client") return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        {showAddUser && (
          <Button
            className="flex items-center gap-2"
            size="sm"
            onClick={() => setShowAddUserDialog(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Add New User
          </Button>
        )}
      </div>
      <UserTable
        users={users}
        clients={clients}
        canManageUser={canManageUser}
      />
      <UserEditDialog
        user={null}
        open={showAddUserDialog}
        onClose={() => setShowAddUserDialog(false)}
        onSave={() => window.location.reload()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>
      </UserEditDialog>
    </div>
  );
}
