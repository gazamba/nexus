import { type NextRequest, NextResponse } from "next/server";
import { executeAgent } from "@/lib/services/agent-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { agentId: string } }
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

    const agentId = params.agentId;
    const body = await request.json();

    if (!body.channel || !body.payload) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let clientId = body.clientId;
    if (!clientId) {
      const { data } = await supabase
        .from("agent")
        .select("client_id")
        .eq("id", agentId)
        .single();

      if (!data) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }

      clientId = data.client_id;
    }

    const input = {
      message: body.payload,
      channel: body.channel,
      metadata: body.metadata,
    };

    const result = await executeAgent(agentId, input, {
      clientId,
      userId: userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error triggering agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
