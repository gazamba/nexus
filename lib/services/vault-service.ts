import { Credential } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function createSecret(secretName: string, secretKey: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.rpc("create_vault_secret", {
    secret_value: secretKey,
    secret_key: secretName,
  });

  if (error) {
    console.error("Error creating secret:", error);
    throw new Error(`Failed to create secret: ${error.message}`);
  }

  console.log("Secret created with UUID:", data);
  return data;
}

export const retrieveCredentialDecryptedSecret = async (
  vaultkey: string
): Promise<Record<string, string>> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase.rpc("retrieve_vault_secret", {
    vaultkey: vaultkey,
  });

  if (error) {
    throw new Error(
      `Failed to decrypt credential from vault: ${error.message}`
    );
  }

  return data.credential_data;
};

export const retrieveCredentialByCredentialId = async (
  credentialId: string
): Promise<Credential[]> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase
    .from("credential")
    .select("*")
    .eq("id", credentialId);

  if (error) {
    throw new Error(
      `Failed to retrieve credential from vault: ${error.message}`
    );
  }

  return data;
};

export const deleteVaultSecret = async (vaultKey: string): Promise<void> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }
  const { error } = await supabase.rpc("delete_vault_secret", {
    secret_id: vaultKey,
  });

  if (error) {
    console.error("Error deleting credential:", error);
    throw new Error(`Failed to delete credential from vault: ${error.message}`);
  }
};
