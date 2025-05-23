"use client";

import { useEffect, useState } from "react";
import { Client } from "@/types/types";
import { Filters } from "./filters";
import { ExceptionsTable } from "./table";
import { Exception, FiltersProps } from "./types";

export function ExceptionsManager() {
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingExceptions, setIsLoadingExceptions] = useState(true);
  const [exceptions, setExceptions] = useState<Exception[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientResponse = await fetch("/api/clients");
        const clientData = await clientResponse.json();
        console.log("Clients data:", clientData);
        setClients(clientData);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchExceptions = async () => {
      setIsLoadingExceptions(true);
      try {
        const url = new URL("/api/exceptions", window.location.origin);
        if (clientFilter !== "all") {
          url.searchParams.append("client", clientFilter);
        }
        const response = await fetch(url);
        const data = await response.json();
        console.log("Exceptions data:", data);
        setExceptions(data);
      } finally {
        setIsLoadingExceptions(false);
      }
    };

    fetchExceptions();
  }, [clientFilter, typeFilter, severityFilter]);

  const handleClientFilterChange = (value: string) => setClientFilter(value);
  const handleTypeFilterChange = (value: string) => setTypeFilter(value);
  const handleSeverityFilterChange = (value: string) =>
    setSeverityFilter(value);

  const isLoading = isLoadingClients || isLoadingExceptions;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <Filters
          clients={clients}
          clientFilter={clientFilter}
          typeFilter={typeFilter}
          severityFilter={severityFilter}
          onClientFilterChange={handleClientFilterChange}
          onTypeFilterChange={handleTypeFilterChange}
          onSeverityFilterChange={handleSeverityFilterChange}
        />
        <ExceptionsTable
          exceptions={exceptions}
          isLoading={isLoading}
          clients={clients}
        />
      </main>
    </div>
  );
}
