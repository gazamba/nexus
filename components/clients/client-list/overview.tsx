"use client";

import { Engineers } from "@/components/clients/client-list/engineers";
import { Users } from "@/components/clients/client-list/users";
import { Documents } from "@/components/clients/client-list/documents";
import { Pipeline } from "@/components/clients/client-list/pipeline";
import { ClientProfile, PipelineStep } from "./types";
import { useState } from "react";

interface OverviewProps {
  clientProfile: ClientProfile;
  pipelineData: PipelineStep[];
}

export function Overview({ clientProfile, pipelineData }: OverviewProps) {
  const [documents, setDocuments] = useState(clientProfile.document);

  const handleDocumentsRefresh = async () => {
    try {
      const response = await fetch(
        `/api/clients/${clientProfile.id}/documents`
      );
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
        <Engineers engineers={clientProfile.solutions_engineer_profile} />
        <Users users={clientProfile.client_user_profile} />
        <Documents documents={documents} />
      </div>
      <div>
        <Pipeline
          pipelineData={pipelineData}
          clientId={clientProfile.id}
          onDocumentsRefresh={handleDocumentsRefresh}
        />
      </div>
    </div>
  );
}
