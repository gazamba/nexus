"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  children: ReactNode;
}

export function MetricCard({ title, children }: MetricCardProps) {
  return (
    <div className="bg-card p-6 rounded-md border">
      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}
