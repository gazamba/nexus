"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { VaultService } from "@/lib/services/vault-service";
import { Credential } from "@/types/types";

export function CredentialsManager({ clientId }: { clientId: string }) {
  const { toast } = useToast();
  const { createSecret, deleteCredential } = VaultService();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialName, setCredentialName] = useState("");
  const [extraFields, setExtraFields] = useState<
    { key: string; value: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialName) {
      toast({
        title: "Error",
        description: "Please enter a credential name.",
        variant: "destructive",
      });
      return;
    }
    if (!clientId) {
      toast({
        title: "Error",
        description: "No client selected.",
        variant: "destructive",
      });
      return;
    }
    if (extraFields.length === 0 || extraFields.some((f) => !f.key)) {
      toast({
        title: "Error",
        description:
          "Please add at least one field and ensure all keys are filled.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      const { data: newCredential, error: insertError } = await supabase
        .from("credential")
        .insert({
          name: credentialName,
          client_id: clientId,
        })
        .select()
        .single();
      if (insertError) {
        console.error(
          "Supabase insert error (credential):",
          JSON.stringify(insertError, null, 2)
        );
        throw insertError;
      }
      for (const { key, value } of extraFields) {
        const vaultKey = await createSecret(
          value,
          `${credentialName}_${key}_${Date.now()}`
        );
        if (!vaultKey) {
          throw new Error(`Failed to store ${key} in the vault.`);
        }
        const { error: fieldInsertError } = await supabase
          .from("credential_field")
          .insert({
            credential_id: newCredential.id,
            variable_name: key,
            vault_key: vaultKey,
          });
        if (fieldInsertError) {
          console.error(
            `Supabase insert error (credential_field for ${key}):`,
            JSON.stringify(fieldInsertError, null, 2)
          );
          throw fieldInsertError;
        }
      }
      toast({
        title: "Success",
        description: "Credentials saved successfully.",
      });
      setCredentialName("");
      setExtraFields([]);
      fetchCredentials();
      setActiveTab("saved");
    } catch (error: unknown) {
      console.error("Error saving credentials:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      console.log("Deleting credential:", id);

      const { data: fields, error: fetchError } = await supabase
        .from("credential_field")
        .select("vault_key, variable_name")
        .eq("credential_id", id);

      console.log("Credential fields:", fields);

      if (fetchError) throw fetchError;

      await Promise.all(
        fields.map((field) => deleteCredential(field.vault_key))
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
  };

  const handleEdit = async (cred: Credential) => {
    setCredentialName(cred.name);
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    const { data: fields, error } = await supabase
      .from("credential_field")
      .select("vault_key, variable_name")
      .eq("credential_id", cred.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load credential fields.",
        variant: "destructive",
      });
      return;
    }

    setExtraFields(
      fields.map((field) => ({
        key: field.variable_name,
        value: field.vault_key,
      }))
    );
    setActiveTab("add");
  };

  const handleAddExtraField = () => {
    setExtraFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleExtraFieldChange = (
    idx: number,
    key: "key" | "value",
    value: string
  ) => {
    setExtraFields((prev) =>
      prev.map((field, i) => (i === idx ? { ...field, [key]: value } : field))
    );
  };

  const handleRemoveExtraField = (idx: number) => {
    setExtraFields((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="saved">Saved Credentials</TabsTrigger>
          <TabsTrigger value="add">Add New Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {loading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
              <span>Loading...</span>
            </div>
          ) : !credentials || credentials.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">
                No credentials saved yet. Add your first credentials to get
                started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentials?.map((cred) => {
                return (
                  <Card key={cred.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cred.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {cred.name}
                      </p>
                      <div className="space-y-2">
                        {Object.entries(cred.fields || {}).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center"
                            >
                              <div className="text-sm font-medium">{key}</div>
                              <div className="text-sm truncate max-w-[150px]">
                                {String(value).length > 0 ? "••••••••" : "N/A"}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cred)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(cred.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="credential-name">Credential Name</Label>
                  <Input
                    id="credential-name"
                    value={credentialName}
                    onChange={(e) => setCredentialName(e.target.value)}
                    required
                    placeholder="Enter credential name"
                  />
                </div>
                <div className="mt-4">
                  <div className="mb-2 font-medium">Fields</div>
                  {extraFields.map((field, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) =>
                          handleExtraFieldChange(idx, "key", e.target.value)
                        }
                        required
                      />
                      <div className="relative flex-grow">
                        <Input
                          placeholder="Value"
                          type="password"
                          value={field.value}
                          onChange={(e) =>
                            handleExtraFieldChange(idx, "value", e.target.value)
                          }
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveExtraField(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddExtraField}
                    variant="outline"
                    className="mt-2"
                  >
                    Add Field
                  </Button>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  Save Credentials
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
