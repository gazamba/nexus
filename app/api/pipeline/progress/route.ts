import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const { stepId, pipelineGroupId, status, completedAt } =
      await request.json();

    const supabase = await createClient();
    console.log(`stepId: ${stepId}`);
    console.log(`pipelineGroupId: ${pipelineGroupId}`);
    console.log(`status: ${status}`);
    console.log(`completedAt: ${completedAt}`);
    const { error } = await supabase
      .from("pipeline_progress")
      .update({
        status,
        // completed_at: completedAt,
      })
      .eq("step_id", stepId)
      .eq("pipeline_group_id", pipelineGroupId);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
