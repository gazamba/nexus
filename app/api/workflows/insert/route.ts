import { NextResponse } from "next/server";
import { insertWorkflowsAndNodesFromSurveyResponse } from "@/lib/services/input-processing-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysisResult = await request.json();

    if (!analysisResult || !analysisResult.workflows) {
      return NextResponse.json(
        { error: "Invalid analysis result" },
        { status: 400 }
      );
    }

    await insertWorkflowsAndNodesFromSurveyResponse(analysisResult);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error inserting workflows and nodes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
