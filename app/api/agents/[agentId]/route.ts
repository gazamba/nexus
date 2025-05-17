import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  deleteAgent,
  getAgent,
  updateAgent,
} from "@/lib/services/agent-service";

export async function GET(
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

    const agent = await getAgent(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    if (!body) {
      return NextResponse.json(
        { error: "Missing request body" },
        { status: 400 }
      );
    }

    const success = await updateAgent(agentId, {
      name: body.name,
      description: body.description,
      type: body.type,
      status: body.status,
      capabilities: body.capabilities,
      lastactive: body.lastActive,
      model: body.model,
      temperature: body.temperature,
      maxtokens: body.maxTokens,
      systemprompt: body.systemPrompt,
      ispublic: body.isPublic,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update agent" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const success = await deleteAgent(agentId);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete agent" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
