"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { SurveyResponse } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface SurveyResponseWithId extends SurveyResponse {
  id: string;
  created_at: string;
  analyzed_survey_response: any;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyResponseWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("/api/surveys");
        if (!response.ok) {
          throw new Error("Failed to fetch surveys");
        }
        const data = await response.json();
        console.log(data);
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading surveys...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto p-2">
      <div className="flex justify-between items-center"></div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow Type</TableHead>
              <TableHead>Current Process</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow
                key={survey.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/surveys/${survey.id}`)}
              >
                <TableCell>{survey.workflow_type}</TableCell>
                <TableCell className="max-w-md truncate">
                  {survey.current_process}
                </TableCell>
                <TableCell>{survey.volume}</TableCell>
                <TableCell>{survey.priority}</TableCell>
                <TableCell>
                  {survey.created_at
                    ? format(new Date(survey.created_at), "MMM d, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {survey.analyzed_survey_response ? (
                    <span className="text-green-600">Analyzed</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {surveys.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No surveys found. Create your first survey to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
