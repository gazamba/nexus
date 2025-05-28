import { type NextRequest, NextResponse } from "next/server";
import {
  createAgent,
  listAgents,
  getAgent,
} from "@/lib/services/agent-service";
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

    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const agentId = await createAgent({
      name: body.name,
      description: body.description || "",
      clientId: body.clientId,
      createdBy: userId,
      type: body.type,
      status: body.status,
      capabilities: body.capabilities,
      model: body.model,
      temperature: body.temperature,
      maxtokens: body.max_tokens,
      systemprompt: body.system_prompt,
      ispublic: body.is_public,
    });

    if (!agentId) {
      return NextResponse.json(
        { error: "Failed to create agent" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: agentId });
  } catch (error) {
    console.error("Error creating agent:", error);
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

    const { data: userRole } = await supabase
      .from("user")
      .select("role")
      .eq("id", userId)
      .single();

    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");
    const agentId = url.searchParams.get("agentId");

    if (userRole?.role !== "admin" && !clientId) {
      return NextResponse.json(
        { error: "Client ID is required for non-admin users" },
        { status: 400 }
      );
    }

    if (userRole?.role !== "admin" && clientId) {
      const { data: userClient } = await supabase
        .from("user")
        .select("client_id")
        .eq("id", userId)
        .single();

      if (userClient?.client_id !== clientId) {
        return NextResponse.json(
          { error: "Unauthorized to access this client's agents" },
          { status: 403 }
        );
      }
    }

    if (agentId) {
      const agent = await getAgent(agentId);
      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }
      return NextResponse.json(agent);
    }

    const agents = await listAgents(clientId || undefined);
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
