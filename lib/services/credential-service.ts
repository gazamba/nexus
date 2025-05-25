import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

export type CredentialInsert =
  Database["public"]["Tables"]["credential"]["Insert"];
export type Credential = Database["public"]["Tables"]["credential"]["Row"];

export async function createCredential(
  credential: CredentialInsert
): Promise<Credential> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("credential")
    .insert(credential)
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating credential:", error);
    throw new Error("Failed to create credential");
  }

  return data;
}
