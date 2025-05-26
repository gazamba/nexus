"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface UsageItem {
  label: string;
  value: string;
}

interface UsageSummaryProps {
  items: UsageItem[];
}

export function UsageSummary({ items }: UsageSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Usage Summary</h3>
          <Link
            href="/reporting"
            className="text-blue-500 text-sm flex items-center"
          >
            View detailed report <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`flex justify-between items-center py-2 ${
                index !== items.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
