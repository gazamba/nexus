import { type NextRequest, NextResponse } from "next/server";
import {
  getSurveyResponse,
  processSurveyResponse,
} from "@/lib/services/input-processing-service";
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

    if (!body.clientId || !body.responses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await processSurveyResponse({
      clientId: body.clientId,
      userId: userId,
      responses: body.responses,
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
    const userId = userData?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing survey ID" }, { status: 400 });
    }

    const surveyResponse = await getSurveyResponse(id);
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
