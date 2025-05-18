"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Credential } from "@/types/types";
import { SavedCredentials } from "@/components/credentials/credentials-manager/saved-credentials";
import { AddCredentials } from "@/components/credentials/credentials-manager/add-credentials";
import { VaultService } from "@/lib/services/vault-service";

export function CredentialsManager({ clientId }: { clientId: string }) {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(false);

  const fetchCredentials = async () => {
    setLoading(true);
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("credential")
      .select("*")
      .eq("client_id", clientId);
    if (error) {
      console.error("Error fetching credentials:", error);
    } else {
      setCredentials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!clientId) return;
    fetchCredentials();
  }, [clientId]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="saved">Saved Credentials</TabsTrigger>
        <TabsTrigger value="add">Add New Credentials</TabsTrigger>
      </TabsList>

      <TabsContent value="saved">
        <SavedCredentials
          credentials={credentials}
          loading={loading}
          onDelete={async (id: string) => {
            try {
              const { createClient } = await import("@/utils/supabase/client");
              const supabase = createClient();
              const { data: fields, error: fetchError } = await supabase
                .from("credential_field")
                .select("vault_key, variable_name")
                .eq("credential_id", id);

              if (fetchError) throw fetchError;

              const vaultService = VaultService();
              await Promise.all(
                fields.map((field) =>
                  vaultService.deleteCredential(field.vault_key)
                )
              );

              const { error: deleteError } = await supabase
                .from("credential")
                .delete()
                .eq("id", id);

              if (deleteError) throw deleteError;

              setCredentials((prev) => prev?.filter((cred) => cred.id !== id));
              toast({ title: "Success", description: "Credential deleted." });
            } catch (error) {
              console.error("Error deleting credential:", error);
              toast({
                title: "Error",
                description: "Failed to delete credential.",
                variant: "destructive",
              });
            }
          }}
          onEdit={(cred: Credential) => {
            setActiveTab("add");
          }}
        />
      </TabsContent>

      <TabsContent value="add">
        <AddCredentials
          clientId={clientId}
          onSuccess={() => {
            fetchCredentials();
            setActiveTab("saved");
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
