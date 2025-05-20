import { NextResponse } from "next/server";
import { markPipelineStepCompleted } from "@/lib/services/pipeline-service";

export async function POST(request: Request) {
  try {
    const { userId, pipelineGroupId, stepId } = await request.json();

    console.log(`userId: ${userId}`);
    console.log(`pipelineGroupId: ${pipelineGroupId}`);

    await markPipelineStepCompleted(userId, pipelineGroupId, stepId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking pipeline step as completed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
