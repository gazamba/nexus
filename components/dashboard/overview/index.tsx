"use client";

import { useState, useEffect } from "react";
import { TimePeriodSelector } from "./time-period-selector";
import { MetricCards } from "./metric-cards";
import { ClientTable } from "./client-table";

interface ClientDashboard {
  id: string;
  name: string;
  contractId: string;
  contractStart: string;
  workflows: number;
  nodes: number;
  executions: number;
  exceptions: number;
  revenue: string;
  timeSaved: string;
  moneySaved: string;
}

export function DashboardOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("ITD");
  const [clientData, setClientData] = useState<ClientDashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClientData(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <TimePeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <MetricCards selectedPeriod={selectedPeriod} />
        <ClientTable clients={clientData} />
      </main>
    </div>
  );
}
