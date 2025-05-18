"use client";

import { useState } from "react";
import { Filters } from "./filters";
import { ExceptionsTable } from "./table";

const exceptions = [
  {
    id: 1,
    datetime: "2025-05-14 12:30:00",
    clientName: "Acme Corp",
    department: "Finance",
    workflow: "Invoice Processing",
    notifications: 3,
    exceptionType: "Integration",
    severity: "Critical",
    remedy: "API timeout",
    status: "New",
  },
];

export function ExceptionsManager() {
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <Filters
          clientFilter={clientFilter}
          typeFilter={typeFilter}
          severityFilter={severityFilter}
          onClientFilterChange={setClientFilter}
          onTypeFilterChange={setTypeFilter}
          onSeverityFilterChange={setSeverityFilter}
        />
        <ExceptionsTable exceptions={exceptions} />
      </main>
    </div>
  );
}
