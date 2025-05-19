import { type NextRequest, NextResponse } from "next/server";
import {
  createSurveyResponse,
  listSurveyResponses,
  getSurveyResponseByClientAndUser,
} from "@/lib/services/survey-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    console.log(`body: ${JSON.stringify(body, null, 2)}`);
    const result = await createSurveyResponse({
      ...body,
      user_id: userId,
      client_id: body.client_id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const clientId = url.searchParams.get("client_id");
    const userId = url.searchParams.get("user_id");

    if (clientId && userId) {
      const surveyResponse = await getSurveyResponseByClientAndUser(
        clientId,
        userId
      );
      if (!surveyResponse) {
        return NextResponse.json(
          { error: "Survey response not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(surveyResponse);
    }

    const surveyResponse = await listSurveyResponses(user.id);
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
