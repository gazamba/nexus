"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SurveyResponse } from "@/types/types";
import { format } from "date-fns";
import { Loading } from "@/components/ui/loading";

interface SurveyResponseWithId extends SurveyResponse {
  id: string;
  created_at: string;
  analyzed_survey_response: any;
}

export default function SurveyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const surveyId = params?.surveyId as string;
  const [survey, setSurvey] = useState<SurveyResponseWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) return;
    const fetchSurvey = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/surveys/${surveyId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch survey");
        }
        const data = await response.json();
        setSurvey(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  if (loading) {
    return <Loading text="Loading survey details..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Survey Details</h1>
        <div className="text-red-600">{error}</div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  // Helper to render arrays/objects nicely
  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        <ul className="list-disc ml-6">
          {value.map((v, i) => (
            <li key={i}>
              {typeof v === "object" ? JSON.stringify(v, null, 2) : v}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-gray-400">None</span>
      );
    }
    if (typeof value === "object" && value !== null) {
      return (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return value ?? <span className="text-gray-400">None</span>;
  };

  return (
    <div className="mx-auto p-2">
      <h1 className="text-2xl font-bold mb-6">Survey Details</h1>
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-gray-900 text-white rounded-md mb-4"
          onClick={() => router.back()}
        >
          Back to Surveys
        </button>
        <div className="bg-white rounded shadow p-6">
          <dl className="grid grid-cols-1 gap-y-4">
            <div>
              <dt className="font-semibold">ID</dt>
              <dd>{survey.id}</dd>
            </div>
            <div>
              <dt className="font-semibold">Created At</dt>
              <dd>
                {survey.created_at
                  ? format(new Date(survey.created_at), "MMM d, yyyy HH:mm")
                  : "N/A"}
              </dd>
            </div>
            {Object.entries(survey).map(([key, value]) => {
              if (["id", "created_at"].includes(key)) return null;
              return (
                <div key={key}>
                  <dt className="font-semibold capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd>{renderValue(value)}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
