"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface MetricData {
  totalWorkflows: number;
  totalExceptions: number;
  totalTimeSaved: number;
  totalClients: number;
}

interface MetricChange {
  change: number;
  increasing: boolean;
}

interface MetricCardsProps {
  selectedPeriod: string;
}

function getDateRange(period: string) {
  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();
  let prevEndDate = new Date();

  switch (period) {
    case "Last 7 days": {
      startDate.setDate(now.getDate() - 7);
      prevEndDate = new Date(startDate);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
      break;
    }
    case "Last 30 days": {
      startDate.setDate(now.getDate() - 30);
      prevEndDate = new Date(startDate);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 30);
      break;
    }
    case "MTD": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevEndDate = new Date(startDate);
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(prevStartDate.getMonth() - 1);
      break;
    }
    case "QTD": {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      prevEndDate = new Date(startDate);
      prevStartDate = new Date(startDate);
      prevStartDate.setMonth(prevStartDate.getMonth() - 3);
      break;
    }
    case "YTD": {
      startDate = new Date(now.getFullYear(), 0, 1);
      prevEndDate = new Date(startDate);
      prevStartDate = new Date(startDate);
      prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
      break;
    }
    case "ITD": {
      startDate = new Date(0);
      prevStartDate = new Date(0);
      prevEndDate = new Date(0);
      break;
    }
    default: {
      startDate = new Date(0);
      prevStartDate = new Date(0);
      prevEndDate = new Date(0);
    }
  }

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    prevStartDate: prevStartDate.toISOString(),
    prevEndDate: prevEndDate.toISOString(),
  };
}

function calculateChange(current: number, previous: number): MetricChange {
  if (previous === 0 && current === 0) return { change: 0, increasing: false };
  if (previous === 0) return { change: 100, increasing: true };
  const diff = current - previous;
  const percent = Math.abs(Math.round((diff / previous) * 100));
  return { change: percent, increasing: diff >= 0 };
}

export function MetricCards({ selectedPeriod }: MetricCardsProps) {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<MetricData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const supabase = createClient();
      const { startDate, endDate, prevStartDate, prevEndDate } =
        getDateRange(selectedPeriod);

      try {
        // Fetch current period metrics
        const [
          { count: workflowCount, error: workflowError },
          { count: clientCount, error: clientError },
          { data: workflowData, error: workflowDataError },
        ] = await Promise.all([
          supabase
            .from("workflow")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate)
            .lte("created_at", endDate),
          supabase
            .from("client")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate)
            .lte("created_at", endDate),
          supabase
            .from("workflow")
            .select("exceptions, timesaved")
            .gte("created_at", startDate)
            .lte("created_at", endDate),
        ]);

        // Fetch previous period metrics
        const [
          { count: prevWorkflowCount },
          { count: prevClientCount },
          { data: prevWorkflowData },
        ] = await Promise.all([
          supabase
            .from("workflow")
            .select("*", { count: "exact", head: true })
            .gte("created_at", prevStartDate)
            .lte("created_at", prevEndDate),
          supabase
            .from("client")
            .select("*", { count: "exact", head: true })
            .gte("created_at", prevStartDate)
            .lte("created_at", prevEndDate),
          supabase
            .from("workflow")
            .select("exceptions, timesaved")
            .gte("created_at", prevStartDate)
            .lte("created_at", prevEndDate),
        ]);

        if (workflowError || clientError || workflowDataError) {
          throw new Error("Failed to fetch metrics");
        }

        // Calculate totals
        const totalExceptions =
          workflowData?.reduce((sum, w) => sum + (w.exceptions || 0), 0) || 0;
        const totalTimeSaved =
          workflowData?.reduce((sum, w) => sum + (w.timesaved || 0), 0) || 0;
        const prevTotalExceptions =
          prevWorkflowData?.reduce((sum, w) => sum + (w.exceptions || 0), 0) ||
          0;
        const prevTotalTimeSaved =
          prevWorkflowData?.reduce((sum, w) => sum + (w.timesaved || 0), 0) ||
          0;

        setMetrics({
          totalWorkflows: workflowCount || 0,
          totalExceptions,
          totalTimeSaved,
          totalClients: clientCount || 0,
        });
        setPrevMetrics({
          totalWorkflows: prevWorkflowCount || 0,
          totalExceptions: prevTotalExceptions,
          totalTimeSaved: prevTotalTimeSaved,
          totalClients: prevClientCount || 0,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchMetrics();
  }, [selectedPeriod]);

  if (isLoading || !metrics || !prevMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const workflowChange = calculateChange(
    metrics.totalWorkflows,
    prevMetrics.totalWorkflows
  );
  const exceptionChange = calculateChange(
    metrics.totalExceptions,
    prevMetrics.totalExceptions
  );
  const timeSavedChange = calculateChange(
    metrics.totalTimeSaved,
    prevMetrics.totalTimeSaved
  );
  const clientChange = calculateChange(
    metrics.totalClients,
    prevMetrics.totalClients
  );

  const metricCards = [
    {
      title: "Total Workflows",
      value: metrics.totalWorkflows.toLocaleString(),
      change: workflowChange.change,
      increasing: workflowChange.increasing,
    },
    {
      title: "Total Exceptions",
      value: metrics.totalExceptions.toLocaleString(),
      change: exceptionChange.change,
      increasing: !exceptionChange.increasing, // Decrease is good for exceptions
    },
    {
      title: "Time Saved",
      value: `${Math.round(metrics.totalTimeSaved)}h`,
      change: timeSavedChange.change,
      increasing: timeSavedChange.increasing,
    },
    {
      title: "Revenue",
      value: "$847K",
      change: 16,
      increasing: true,
    },
    {
      title: "Active Clients",
      value: metrics.totalClients.toLocaleString(),
      change: clientChange.change,
      increasing: clientChange.increasing,
    },
  ];

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
