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
import { getSolutionEngineer } from "@/lib/services/solution-engineer-service";
import { Profile } from "@/types/types";
import { Loading } from "@/components/ui/loading";

export function ClientDashboard() {
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [solutionEngineer, setSolutionEngineer] = useState<Profile | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const fetchAll = async () => {
      try {
        const clientId = await getClientId(user.id);
        setClientId(clientId);
        const { data } = await getPipelineData(user.id);
        console.log("Pipeline data:", data);
        setPipelineData(data);
        const { data: solutionEngineer } = await getSolutionEngineer(clientId);
        console.log("Solution engineer:", solutionEngineer);
        setSolutionEngineer(solutionEngineer || undefined);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.id]);

  if (loading) {
    return <Loading text="Loading dashboard..." fullScreen />;
  }

  const isInitialSurveyCompleted =
    pipelineData.find((step) => step.step_name === "Discovery: Initial Survey")
      ?.progress?.status === "completed";

  const isFactoryBuildCompleted =
    pipelineData.find((step) => step.step_name === "Factory build initiated")
      ?.progress?.status === "completed";

  const lastStep = pipelineData.reduce((prev, curr) =>
    prev.step_order > curr.step_order ? prev : curr
  );
  const isPipelineFullyCompleted = lastStep?.progress?.status === "completed";

  return (
    <div className="space-y-6">
      <SurveyBanner isPipelineFullyCompleted={isPipelineFullyCompleted} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TimeSaved lastWeek="24.5 hrs" allTime="168.2 hrs" />
        <MoneySaved lastWeek="$2,450" allTime="$16,820" />
        <ActiveWorkflows count={12} />
        {solutionEngineer && <UserCard user={solutionEngineer} />}
      </div>
      {clientId && <Pipeline pipelineData={pipelineData} clientId={clientId} />}
    </div>
  );
}
