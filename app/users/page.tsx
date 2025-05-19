"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserTable } from "@/components/user-table";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      if (user?.role === "admin") {
        const { data: allUsers } = await supabase.from("profile").select("*");
        const { data: allClients } = await supabase.from("client").select("*");
        const usersWithClients = (allUsers || []).map((u) => ({
          ...u,
          assigned_clients: (u.assigned_clients_ids || []).map(
            (cid: string) =>
              allClients?.find((c: any) => c.id === cid)?.name || cid
          ),
        }));
        setUsers(usersWithClients);
        setClients(allClients || []);
        setShowAddUser(true);
      } else if (user?.role === "se") {
        const { data: assignments } = await supabase
          .from("solutions_engineer_assignment")
          .select("client_id")
          .eq("se_user_id", user.id);
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
          .from("users")
          .select("*")
          .in("id", clientUserIds);

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
    }

    fetchData();
  }, [user]);

  const canManageUser = (rowUser: User) => {
    if (user?.role === "admin") return true;
    if (user?.role === "se" && rowUser.role === "client") return true;
    return false;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        {showAddUser && (
          <Button className="flex items-center gap-2" size="lg">
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
    </div>
  );
}
