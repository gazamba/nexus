"use client";

import { useAuth } from "@/contexts/auth-provider";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { getPipelineData } from "@/lib/services/pipeline-service";
import { useEffect, useState } from "react";

function getUserAvatar(user: any) {
  return user?.avatar || "/placeholder.svg?height=64&width=64&query=avatar";
}

export function ClientDashboard() {
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const fetchPipelineData = async () => {
      const { data } = await getPipelineData(user.id);
      setPipelineData(data);
      setLoading(false);
    };
    fetchPipelineData();
  }, [user?.id]);

  useEffect(() => {
    if (pipelineData.length > 0) {
      console.log("pipelineData updated:", pipelineData);
      console.log("pipelineData:", JSON.stringify(pipelineData));
    }
  }, [pipelineData]);

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
        <div className="mb-6 bg-muted p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-medium text-foreground">
                Help Us Improve Your Workflow
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete our workflow survey to help us automate your processes
              </p>
            </div>
            {isInitialSurveyCompleted ? (
              <Button disabled>Pipeline is already in progress</Button>
            ) : (
              <Link href="/survey">
                <Button>Start Workflow Survey</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-md border">
            <h2 className="text-lg font-medium mb-4">Pipeline Progress</h2>
            <div className="space-y-4">
              {pipelineData.map((step, index) => {
                let status = step.progress?.status || "pending";
                if (
                  step.step_name === "Discovery: Initial Survey" &&
                  status !== "completed"
                ) {
                  status = "in-progress";
                }
                const completedAt = step.progress?.completed_at;
                return (
                  <div key={index} className="flex items-start gap-3">
                    {status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    ) : status === "in-progress" ? (
                      <Circle className="h-5 w-5 text-primary mt-0.5 fill-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">{step.step_name}</div>
                      {status === "completed" && completedAt && (
                        <div className="text-sm text-muted-foreground">
                          Completed {completedAt}
                        </div>
                      )}
                      {status === "in-progress" && (
                        <div className="text-sm text-primary">In Progress</div>
                      )}
                      {status === "pending" && (
                        <div className="text-sm text-muted-foreground">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-md border">
              <h3 className="text-sm text-muted-foreground mb-2">Time Saved</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">24.5 hrs</div>
                  <div className="text-sm text-muted-foreground">
                    Last 7 days
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">168.2 hrs</div>
                  <div className="text-sm text-muted-foreground">All time</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-md border">
              <h3 className="text-sm text-muted-foreground mb-2">
                Money Saved
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">$2,450</div>
                  <div className="text-sm text-muted-foreground">
                    Last 7 days
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$16,820</div>
                  <div className="text-sm text-muted-foreground">All time</div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-md border">
              <h3 className="text-sm text-muted-foreground mb-2">
                Active Workflows
              </h3>
              <div className="text-2xl font-bold mb-2">12</div>
              <Link
                href="/workflows"
                className="text-primary text-sm flex items-center"
              >
                View workflows <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>

          <div className="bg-card p-6 rounded-md border">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 overflow-hidden">
                <img
                  src={getUserAvatar(user)}
                  alt="Solutions Engineer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-lg">
                  {user?.name || "John Smith"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Solutions Engineer
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message SE
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
