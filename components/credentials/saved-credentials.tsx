"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Credential } from "@/types/types";
import { Loading } from "@/components/ui/loading";

interface SavedCredentialsProps {
  credentials: Credential[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (credential: Credential) => void;
}

export function SavedCredentials({
  credentials,
  loading,
  onDelete,
  onEdit,
}: SavedCredentialsProps) {
  if (loading) {
    return <Loading text="Loading credentials..." fullScreen />;
  }

  if (!credentials || credentials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">
          No credentials saved yet. Add your first credentials to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {credentials.map((cred) => (
        <Card key={cred.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{cred.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(cred)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(cred.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
