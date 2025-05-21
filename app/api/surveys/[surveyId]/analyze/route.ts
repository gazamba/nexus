import { NextResponse } from "next/server";
import { analyzeSurveyResponse } from "@/lib/services/survey-service";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

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

    const surveyId = await params.surveyId;

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const supabase = await createClient();
    const surveyId = await params.surveyId;

    const { analyzedSurveyResponse } = await request.json();

    if (!analyzedSurveyResponse) {
      return NextResponse.json(
        { error: "Analyzed survey response is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("survey_response")
      .update({
        analyzed_survey_response: analyzedSurveyResponse,
        updated_at: new Date().toISOString(),
      })
      .eq("id", surveyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating survey response:", error);
      return NextResponse.json(
        { error: "Failed to update survey response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in PATCH /api/surveys/[surveyId]/analyze:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
