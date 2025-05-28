import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientUser, PipelineStep, Workflow } from "./types";
import { API_ENDPOINTS } from "./constants";
import { getPipelineDataByClient } from "@/lib/services/pipeline-service";

export function useClientData() {
  const params = useParams();
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      console.log(JSON.stringify(params));
      try {
        setIsLoading(true);
        const clientUserResponse = await fetch(
          API_ENDPOINTS.CLIENT_USER(params.clientId as string)
        );
        if (!clientUserResponse.ok) {
          throw new Error("Client not found");
        }
        const clientUserData = await clientUserResponse.json();
        setClientUser(clientUserData);

        const pipelineResponse = await getPipelineDataByClient(
          params.clientId as string
        );

        console.log(`pipelineResponse: ${JSON.stringify(pipelineResponse)}`);
        setPipelineData(pipelineResponse.data || []);

        const workflowsResponse = await fetch(
          `/api/workflows?clientId=${params.clientId as string}`
        );
        if (workflowsResponse.ok) {
          const workflowsData = await workflowsResponse.json();
          setWorkflows(workflowsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [params.clientId]);

  return {
    clientUser,
    pipelineData,
    workflows,
    isLoading,
    error,
  };
}
