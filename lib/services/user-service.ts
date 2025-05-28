import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

type User = Database["public"]["Tables"]["user"]["Row"];

export async function getUsersByRole(role: string): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("role", role);

  if (error) {
    throw new Error(`Error fetching users by role '${role}': ${error.message}`);
  }

  return data || [];
}

export async function getUserByUserID(userId: string): Promise<User> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Error fetching user by id ${userId}: ${error.message}`);
  }

  return data;
}
