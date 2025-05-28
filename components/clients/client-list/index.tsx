"use client";

import { useState } from "react";
import { Header } from "@/components/clients/client-list/header";
import { Overview } from "@/components/clients/client-list/overview";
import { ClientWorkflows } from "@/components/clients/client-list/workflows";
import { Loading } from "@/components/clients/client-list/loading";
import { Error } from "@/components/clients/client-list/error";
import { useClientData } from "./hooks";
import { TAB_NAMES } from "./constants";

export function ClientList() {
  const [activeTab, setActiveTab] = useState<
    (typeof TAB_NAMES)[keyof typeof TAB_NAMES]
  >(TAB_NAMES.OVERVIEW);
  const { clientUser, pipelineData, workflows, isLoading, error } =
    useClientData();

  if (isLoading) {
    return <Loading />;
  }

  if (error || !clientUser) {
    return <Error />;
  }

  return (
    <div className="space-y-6">
      <Header clientName={clientUser.name} />

      <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 px-1 ${
            activeTab === TAB_NAMES.OVERVIEW
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab(TAB_NAMES.OVERVIEW)}
        >
          Overview
        </button>
        <button
          className={`pb-2 px-1 ${
            activeTab === TAB_NAMES.WORKFLOWS
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab(TAB_NAMES.WORKFLOWS)}
        >
          Workflows
        </button>
      </div>

      {activeTab === TAB_NAMES.OVERVIEW ? (
        <Overview clientUser={clientUser} pipelineData={pipelineData} />
      ) : (
        <ClientWorkflows clientId={clientUser.id} />
      )}
    </div>
  );
}
