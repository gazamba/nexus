"use client";

import { Button } from "@/components/ui/button";

const timePeriods = ["Last 7 days", "Last 30 days", "MTD", "QTD", "YTD", "ITD"];

interface TimePeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function TimePeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: TimePeriodSelectorProps) {
  return (
    <div className="flex gap-2 mb-6">
      {timePeriods.map((period) => (
        <Button
          key={period}
          variant={selectedPeriod === period ? "default" : "outline"}
          className={`px-4 py-2 ${
            selectedPeriod === period ? "bg-black text-white" : ""
          }`}
          onClick={() => onPeriodChange(period)}
        >
          {period}
        </Button>
      ))}
    </div>
  );
}
