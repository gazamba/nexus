"use client";

import { Card, CardContent } from "@/components/ui/card";

interface PlanCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export function PlanCard({ title, value, subtitle }: PlanCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
        <div className="text-xl font-semibold mb-1">{value}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
