"use client";

import { MetricCard } from "./metric-card";

interface MoneySavedProps {
  lastWeek: string;
  allTime: string;
}

export function MoneySaved({ lastWeek, allTime }: MoneySavedProps) {
  return (
    <MetricCard title="Money Saved">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold">{lastWeek}</div>
          <div className="text-sm text-muted-foreground">Last 7 days</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{allTime}</div>
          <div className="text-sm text-muted-foreground">All time</div>
        </div>
      </div>
    </MetricCard>
  );
}
