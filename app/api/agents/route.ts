import { type NextRequest, NextResponse } from "next/server";
import { createAgent, listAgents } from "@/lib/services/agent-service";
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

    if (
      !body.name ||
      !body.clientId ||
      !body.channels ||
      body.channels.length === 0
    ) {
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
      lastactive: body.lastActive,
      model: body.model,
      temperature: body.temperature,
      maxtokens: body.maxTokens,
      systemprompt: body.systemPrompt,
      ispublic: body.isPublic,
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
      .from("profile")
      .select("role")
      .eq("user_id", userId)
      .single();

    console.log(userRole);

    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");

    if (userRole?.role !== "admin" && !clientId) {
      return NextResponse.json(
        { error: "Client ID is required for non-admin users" },
        { status: 400 }
      );
    }

    if (userRole?.role !== "admin" && clientId) {
      const { data: userClient } = await supabase
        .from("users")
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
