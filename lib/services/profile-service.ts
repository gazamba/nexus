import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

type Profile = Database["public"]["Tables"]["profile"]["Row"];

export async function getProfilesByRole(role: string): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("role", role);

  if (error) {
    throw new Error(
      `Error fetching profiles by role '${role}': ${error.message}`
    );
  }

  return data || [];
}

export async function getClients(): Promise<Profile[]> {
  return getProfilesByRole("client");
}

export async function getSolutionsEngineers(): Promise<Profile[]> {
  return getProfilesByRole("se");
}
