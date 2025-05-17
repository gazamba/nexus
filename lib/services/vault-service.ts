"use client";

import { useAuth } from "@/contexts/auth-provider";
import { createClient } from "@/utils/supabase/client";

export function VaultService() {
  const supabase = createClient();
  const { user } = useAuth();

  if (!user) {
    throw new Error("User not authenticated");
  }

  async function createSecret(secretValue: string, secretKey: string) {
    const { data, error } = await supabase.rpc("create_vault_secret", {
      secret_value: secretValue,
      secret_key: secretKey,
    });

    if (error) {
      console.error("Error creating secret:", error);
      return null;
    }

    console.log("Secret created with UUID:", data);
    return data;
  }

  const retrieveCredential = async (
    vaultKey: string
  ): Promise<Record<string, string>> => {
    const { data, error } = await supabase.functions.invoke(
      "vault.get_secret",
      {
        body: {
          secret_id: vaultKey,
        },
      }
    );

    if (error) {
      throw new Error(
        `Failed to retrieve credential from vault: ${error.message}`
      );
    }

    return data.credential_data;
  };

  const deleteCredential = async (vaultKey: string): Promise<void> => {
    const { error } = await supabase.rpc("delete_vault_secret", {
      secret_id: vaultKey,
    });

    if (error) {
      console.error("Error deleting credential:", error);
      throw new Error(
        `Failed to delete credential from vault: ${error.message}`
      );
    }
  };

  return {
    createSecret,
    retrieveCredential,
    deleteCredential,
  };
}
