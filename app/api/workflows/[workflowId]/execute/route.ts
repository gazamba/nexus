import { type NextRequest, NextResponse } from "next/server";
import { executeWorkflow } from "@/lib/services/workflow-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
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

    const workflowId = params.workflowId;
    const body = await request.json();

    let clientId = body.clientId;
    if (!clientId) {
      const { data } = await supabase
        .from("workflow")
        .select("client_id")
        .eq("id", workflowId)
        .single();

      if (!data) {
        return NextResponse.json(
          { error: "Workflow not found" },
          { status: 404 }
        );
      }

      clientId = data.client_id;
    }

    const result = await executeWorkflow(workflowId, body.inputs || {}, {
      clientId,
      userId: userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
