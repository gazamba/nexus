"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserTable } from "@/components/user-table";
import { User } from "@/types/types";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      if (user?.role === "admin") {
        const { data: allUsers } = await supabase.from("users").select("*");
        const { data: allClients } = await supabase.from("clients").select("*");
        setUsers(allUsers || []);
        setClients(allClients || []);
      } else if (user?.role === "se") {
        const { data: assignments } = await supabase
          .from("solutions_engineer_assignment")
          .select("client_id")
          .eq("se_user_id", user.id);
        const clientIds = assignments?.map((a) => a.client_id) || [];

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

        setUsers(clientUsers || []);
        setClients(clientIds);
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
    <UserTable users={users} clients={clients} canManageUser={canManageUser} />
  );
}
