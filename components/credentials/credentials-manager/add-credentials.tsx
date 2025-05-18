"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Credential } from "@/types/types";
import { VaultService } from "@/lib/services/vault-service";

interface AddCredentialsProps {
  clientId: string;
  onSuccess: () => void;
  initialCredential?: Credential;
}

export function AddCredentials({
  clientId,
  onSuccess,
  initialCredential,
}: AddCredentialsProps) {
  const [credentialName, setCredentialName] = useState(
    initialCredential?.name || ""
  );
  const [extraFields, setExtraFields] = useState<
    { key: string; value: string }[]
  >(initialCredential ? [] : [{ key: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialName) {
      toast.error("Please enter a credential name.");
      return;
    }
    if (!clientId) {
      toast.error("No client selected.");
      return;
    }
    if (extraFields.length === 0 || extraFields.some((f) => !f.key)) {
      toast.error(
        "Please add at least one field and ensure all keys are filled."
      );
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
        const vaultService = VaultService();
        const vaultKey = await vaultService.createSecret(
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

      toast.success("Credentials saved successfully.");
      setCredentialName("");
      setExtraFields([{ key: "", value: "" }]);
      onSuccess();
    } catch (error: unknown) {
      console.error("Error saving credentials:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="credentialName">Credential Name</Label>
        <Input
          id="credentialName"
          value={credentialName}
          onChange={(e) => setCredentialName(e.target.value)}
          placeholder="Enter credential name"
        />
      </div>

      <div className="space-y-4">
        {extraFields.map((field, idx) => (
          <div key={idx} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Key</Label>
              <Input
                value={field.key}
                onChange={(e) =>
                  handleExtraFieldChange(idx, "key", e.target.value)
                }
                placeholder="Enter key"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Value</Label>
              <Input
                type="password"
                value={field.value}
                onChange={(e) =>
                  handleExtraFieldChange(idx, "value", e.target.value)
                }
                placeholder="Enter value"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveExtraField(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleAddExtraField}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Credentials"}
        </Button>
      </div>
    </form>
  );
}
