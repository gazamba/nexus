"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useEffect, useState } from "react";
import { getPipelineData } from "@/lib/services/pipeline-service";
import { SurveyBanner } from "./survey-banner";
import { Pipeline } from "@/components/clients/client-list/pipeline";
import { TimeSaved } from "./metrics/time-saved";
import { MoneySaved } from "./metrics/money-saved";
import { ActiveWorkflows } from "./metrics/active-workflows";
import { UserCard } from "./user-card";
import { getClientId } from "@/lib/services/client-service";

export function ClientDashboard() {
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const fetchClientId = async () => {
      const clientId = await getClientId(user.id);
      setClientId(clientId);
      setLoading(false);
    };

    const fetchPipelineData = async () => {
      const { data } = await getPipelineData(user.id);
      setPipelineData(data);
      setLoading(false);
    };
    fetchClientId();
    fetchPipelineData();
  }, [user?.id]);

  const isInitialSurveyCompleted =
    pipelineData.find((step) => step.step_name === "Discovery: Initial Survey")
      ?.progress?.status === "completed";

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <SurveyBanner isInitialSurveyCompleted={isInitialSurveyCompleted} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Pipeline pipelineData={pipelineData} clientId={clientId || ""} />

          <div className="space-y-6">
            <TimeSaved lastWeek="24.5 hrs" allTime="168.2 hrs" />
            <MoneySaved lastWeek="$2,450" allTime="$16,820" />
            <ActiveWorkflows count={12} />
          </div>

          {user && <UserCard user={user} />}
        </div>
      </main>
    </div>
  );
}
