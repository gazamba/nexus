"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Circle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate } from "date-fns";
import { getPipelineDataByClient } from "@/lib/services/pipeline-service";

export function ClientsList({ clientId = "1" }: { clientId?: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        const data = await res.json();
        console.log("Data:", data);
        setClientProfile(data);

        const { data: pipelineSteps } = await getPipelineDataByClient(clientId);
        console.log("Pipeline Steps:", pipelineSteps);
        setPipelineData(pipelineSteps);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!clientProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Client not found</h2>
          <p className="text-gray-500 mb-4">
            The client you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/clients"
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Back to Clients</span>
          </Link>
          <span className="text-gray-400 mx-2">|</span>
          <h1 className="text-xl font-medium">
            Client Manager: {clientProfile.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl ">
        <div className="mb-6">
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList>
              <TabsTrigger
                value="overview"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="workflows"
                onClick={() => setActiveTab("workflows")}
              >
                Client Workflows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Assigned Solutions Engineers
              </h2>
              <div className="flex gap-4">
                {clientProfile.solutions_engineer_profile.map(
                  (engineer: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 border rounded-md"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">{engineer.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium">{engineer.name}</p>
                        <p className="text-sm text-gray-500">{engineer.role}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border rounded-md overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Client Users</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Billing
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Admin
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientProfile.client_user_profile.map(
                        (user: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-3">{user.full_name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">{user.phone}</td>
                            <td className="px-4 py-3">
                              {user.billing ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {user.admin ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3">{user.notes}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Document Links</h3>
                </div>
                <div className="p-4 space-y-4">
                  {clientProfile.document.map((doc: any, index: number) => (
                    <div key={index}>
                      <p className="text-sm text-gray-500">{doc.title}</p>
                      <a
                        href={doc.url}
                        className="text-sm text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Pipeline Progress</h3>
              </div>
              <div className="p-4 space-y-4">
                {pipelineData.map((step: any, index: number) => {
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
                        <Check className="h-5 w-5 text-green-500 rounded-full bg-green-100 p-1" />
                      ) : status === "in-progress" ? (
                        <Circle className="h-5 w-5 text-blue-500 rounded-full bg-blue-100 p-1" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium">{step.step_name}</div>
                        {status === "completed" && completedAt && (
                          <div className="text-sm text-muted-foreground">
                            Completed {completedAt}
                          </div>
                        )}
                        {status === "in-progress" && (
                          <div className="text-sm text-primary">
                            In Progress
                          </div>
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
          </div>
        )}

        {activeTab === "workflows" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Workflows</h2>
              <Button>Add Workflow</Button>
            </div>

            {clientProfile.workflow.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Create Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Workflow Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          # of Nodes
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          # of Executions
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          # of Exceptions
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Time Saved
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          $ Saved
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientProfile.workflow.map(
                        (workflow: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-3">
                              {formatDate(workflow.created_at, "MMM d, yyyy")}
                            </td>
                            <td className="px-4 py-3">{workflow.department}</td>
                            <td className="px-4 py-3">{workflow.name}</td>
                            <td className="px-4 py-3">{workflow.nodes}</td>
                            <td className="px-4 py-3 text-blue-500">
                              {workflow.executions}
                            </td>
                            <td className="px-4 py-3 text-blue-500">
                              {workflow.exceptions}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="mr-1">
                                  {workflow.timeSaved}
                                </span>
                                <span className="text-xs text-gray-500">
                                  min
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="mr-1">
                                  {workflow.moneySaved}
                                </span>
                                <span className="text-xs text-gray-500">
                                  USD
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="relative inline-block w-10 h-5 rounded-full bg-gray-200">
                                <div
                                  className={`absolute ${
                                    workflow.status === "active"
                                      ? "left-0"
                                      : "right-0"
                                  } top-0 bottom-0 w-5 h-5 mt-0 rounded-full bg-black`}
                                ></div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <a
                                  href="#"
                                  className="text-blue-500 hover:underline"
                                >
                                  ROI
                                </a>
                                <a
                                  href="#"
                                  className="text-blue-500 hover:underline"
                                >
                                  Report
                                </a>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <svg
                  className="h-12 w-12 mx-auto text-gray-300 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6H2Z" />
                  <path d="M2 15a3 3 0 0 0 0 6h20a3 3 0 0 0 0-6H2Z" />
                  <path d="M6 9v6" />
                  <path d="M18 9v6" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No workflows found</h3>
                <p className="text-gray-500 mb-4">
                  This client doesn't have any workflows yet
                </p>
                <Button>Add Workflow</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
