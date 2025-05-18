"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const metricCards = [
  { title: "Total Workflows", value: "2,847", change: 12, increasing: true },
  { title: "Total Exceptions", value: "156", change: 8, increasing: false },
  { title: "Time Saved", value: "1,284h", change: 24, increasing: true },
  { title: "Revenue", value: "$847K", change: 16, increasing: true },
  { title: "Active Clients", value: "128", change: 5, increasing: true },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {metricCards.map((card, index) => (
        <Card key={index} className="border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <div
                className={`flex items-center text-xs ${
                  card.increasing ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.increasing ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {card.change}%
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
