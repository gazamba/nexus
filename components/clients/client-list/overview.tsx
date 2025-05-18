"use client";

import { Engineers } from "@/components/clients/client-list/engineers";
import { Users } from "@/components/clients/client-list/users";
import { Documents } from "@/components/clients/client-list/documents";
import { Pipeline } from "@/components/clients/client-list/pipeline";
import { ClientProfile, PipelineStep } from "./types";

interface OverviewProps {
  clientProfile: ClientProfile;
  pipelineData: PipelineStep[];
}

export function Overview({ clientProfile, pipelineData }: OverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Engineers engineers={clientProfile.engineers} />
        <Users users={clientProfile.users} />
        <Documents documents={clientProfile.documents} />
      </div>
      <div>
        <Pipeline pipelineData={pipelineData} />
      </div>
    </div>
  );
}
