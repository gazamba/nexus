"use client";

import { ClientFilter } from "./client-filter";
import { TypeFilter } from "./type-filter";
import { SeverityFilter } from "./severity-filter";

interface FiltersProps {
  clientFilter: string;
  typeFilter: string;
  severityFilter: string;
  onClientFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onSeverityFilterChange: (value: string) => void;
}

export function Filters({
  clientFilter,
  typeFilter,
  severityFilter,
  onClientFilterChange,
  onTypeFilterChange,
  onSeverityFilterChange,
}: FiltersProps) {
  return (
    <div className="bg-card p-4 rounded-md border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClientFilter value={clientFilter} onChange={onClientFilterChange} />
        <TypeFilter value={typeFilter} onChange={onTypeFilterChange} />
        <SeverityFilter
          value={severityFilter}
          onChange={onSeverityFilterChange}
        />
      </div>
    </div>
  );
}
