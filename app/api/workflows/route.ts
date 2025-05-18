import { type NextRequest, NextResponse } from "next/server";
import { createWorkflow, listWorkflows } from "@/lib/services/workflow-service";
import { generateWorkflowFromSurveyResponse } from "@/lib/services/input-processing-service";
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

    if (!body.name || !body.description || !body.clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.surveyResponseIds || body.workflowDocIds) {
      const result = await generateWorkflowFromSurveyResponse(
        body.clientId,
        userId,
        {
          name: body.name,
          description: body.description,
          surveyResponseIds: body.surveyResponseIds,
          workflowDocIds: body.workflowDocIds,
        }
      );

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ id: result.workflowId });
    }

    const workflowId = await createWorkflow({
      name: body.name,
      description: body.description,
      clientId: body.clientId,
      createdBy: userId,
      nodes: body.nodes || [],
      triggers: body.triggers || [],
    });

    if (!workflowId) {
      return NextResponse.json(
        { error: "Failed to create workflow" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: workflowId });
  } catch (error) {
    console.error("Error creating workflow:", error);
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
    const clientId = url.searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Missing client ID" }, { status: 400 });
    }

    const workflows = await listWorkflows(clientId);

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
