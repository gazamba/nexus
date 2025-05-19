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
    const fetchAll = async () => {
      try {
        const clientId = await getClientId(user.id);
        setClientId(clientId);
        const { data } = await getPipelineData(user.id);
        console.log("Pipeline data:", data); // Debug log
        setPipelineData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading...</span>
      </div>
    );
  }

  // Only check status after data is loaded
  const isInitialSurveyCompleted =
    pipelineData.find((step) => step.step_name === "Discovery: Initial Survey")
      ?.progress?.status === "completed";

  const isFactoryBuildCompleted =
    pipelineData.find((step) => step.step_name === "Factory build initiated")
      ?.progress?.status === "completed";

  // New: check if the final step is completed
  const lastStep = pipelineData.reduce((prev, curr) =>
    prev.step_order > curr.step_order ? prev : curr
  );
  const isPipelineFullyCompleted = lastStep?.progress?.status === "completed";

  console.log("Survey completed:", isInitialSurveyCompleted); // Debug log
  console.log("Factory build completed:", isFactoryBuildCompleted); // Debug log
  console.log("Pipeline fully completed:", isPipelineFullyCompleted); // Debug log

  return (
    <div className="space-y-6">
      <SurveyBanner isPipelineFullyCompleted={isPipelineFullyCompleted} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TimeSaved lastWeek="24.5 hrs" allTime="168.2 hrs" />
        <MoneySaved lastWeek="$2,450" allTime="$16,820" />
        <ActiveWorkflows count={12} />
        {user && <UserCard user={user} />}
      </div>
      {clientId && <Pipeline pipelineData={pipelineData} clientId={clientId} />}
    </div>
  );
}
