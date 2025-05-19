import { type NextRequest, NextResponse } from "next/server";
import {
  getSurveyResponse,
  updateAnalyzedSurveyResponse,
} from "@/lib/services/survey-service";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const surveyId = await params.surveyId;

    if (!surveyId) {
      return NextResponse.json({ error: "Missing survey ID" }, { status: 400 });
    }

    const surveyResponse = await getSurveyResponse(surveyId);
    if (!surveyResponse) {
      return NextResponse.json(
        { error: "Survey response not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(surveyResponse);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const surveyId = await params.surveyId;

    if (!surveyId) {
      return NextResponse.json({ error: "Missing survey ID" }, { status: 400 });
    }

    const { analyzedSurveyResponse } = await request.json();

    if (!analyzedSurveyResponse) {
      return NextResponse.json(
        { error: "Analyzed survey response is required" },
        { status: 400 }
      );
    }

    await updateAnalyzedSurveyResponse(analyzedSurveyResponse, surveyId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
