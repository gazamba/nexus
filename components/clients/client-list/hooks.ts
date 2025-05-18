import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientProfile, PipelineStep, Workflow } from "./types";
import { API_ENDPOINTS } from "./constants";

export function useClientData() {
  const params = useParams();
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(
    null
  );
  const [pipelineData, setPipelineData] = useState<PipelineStep[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        const profileResponse = await fetch(
          API_ENDPOINTS.CLIENT_PROFILE(params.id as string)
        );
        if (!profileResponse.ok) {
          throw new Error("Client not found");
        }
        const profileData = await profileResponse.json();
        setClientProfile(profileData);

        const pipelineResponse = await fetch(
          API_ENDPOINTS.PIPELINE(params.id as string)
        );
        if (pipelineResponse.ok) {
          const pipelineData = await pipelineResponse.json();
          setPipelineData(pipelineData);
        }

        const workflowsResponse = await fetch(
          API_ENDPOINTS.WORKFLOWS(params.id as string)
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
  }, [params.id]);

  return {
    clientProfile,
    pipelineData,
    workflows,
    isLoading,
    error,
  };
}
