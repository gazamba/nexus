import { NextResponse } from "next/server";
import { analyzeSurveyResponse } from "@/lib/services/input-processing-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { surveyId: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const surveyId = params.surveyId;

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID is required" },
        { status: 400 }
      );
    }

    const { data: survey, error: fetchError } = await supabase
      .from("survey_response")
      .select("*")
      .eq("id", surveyId)
      .single();

    if (fetchError || !survey) {
      return NextResponse.json(
        { error: "Failed to fetch survey response" },
        { status: 404 }
      );
    }

    const analysisResult = await analyzeSurveyResponse(survey);

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Error analyzing survey response:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
