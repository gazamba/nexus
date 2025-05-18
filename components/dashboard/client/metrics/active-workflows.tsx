"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "./metric-card";

interface ActiveWorkflowsProps {
  count: number;
}

export function ActiveWorkflows({ count }: ActiveWorkflowsProps) {
  return (
    <MetricCard title="Active Workflows">
      <div className="text-2xl font-bold mb-2">{count}</div>
      <Link
        href="/workflows"
        className="text-primary text-sm flex items-center"
      >
        View workflows <ArrowRight className="h-3 w-3 ml-1" />
      </Link>
    </MetricCard>
  );
}
