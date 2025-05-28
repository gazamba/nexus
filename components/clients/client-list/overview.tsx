"use client";

import { Engineers } from "@/components/clients/client-list/engineers";
import { Users } from "@/components/clients/client-list/users";
import { Documents } from "@/components/clients/client-list/documents";
import { Pipeline } from "@/components/clients/client-list/pipeline";
import { ClientUser, PipelineStep } from "./types";
import { useState } from "react";

interface OverviewProps {
  clientUser: ClientUser;
  pipelineData: PipelineStep[];
}

export function Overview({ clientUser, pipelineData }: OverviewProps) {
  const [documents, setDocuments] = useState(clientUser.document);

  const handleDocumentsRefresh = async () => {
    try {
      const response = await fetch(`/api/clients/${clientUser.id}/documents`);
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error refreshing documents:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Engineers engineers={clientUser.solutions_engineer} />
        <Users users={clientUser.client_user} />
        <Documents documents={documents} />
      </div>
      <div>
        <Pipeline
          pipelineData={pipelineData}
          clientId={clientUser.id}
          // onDocumentsRefresh={handleDocumentsRefresh}
        />
      </div>
    </div>
  );
}
