import { createClient } from "../../utils/supabase/client";

export async function getClientId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("client_user_assignment")
    .select("client_id")
    .eq("client_user_id", userId);

  if (error) {
    console.error("Error fetching client id:", error);
    return null;
  }

  return data[0].client_id;
}

export async function getClientName(clientId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("client")
    .select("name")
    .eq("id", clientId)
    .single();

  if (error) {
    console.error("Error fetching client name:", error);
    return null;
  }

  return data.name;
}
