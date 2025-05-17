import { type NextRequest, NextResponse } from "next/server";
import { useAuth } from "@/contexts/auth-provider";
import { createClient } from "@/utils/supabase/server";

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
    const workflowId = url.searchParams.get("workflowId");
    const agentId = url.searchParams.get("agentId");
    const nodeId = url.searchParams.get("nodeId");
    const status = url.searchParams.get("status");
    const limit = Number.parseInt(url.searchParams.get("limit") || "100");
    const offset = Number.parseInt(url.searchParams.get("offset") || "0");

    if (!clientId) {
      return NextResponse.json({ error: "Missing client ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("execution_log")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // Build the query
    let query = await supabase
      .from("execution_log")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // if (workflowId) {
    //   query = query.eq("workflow_id", workflowId);
    // }

    // if (agentId) {
    //   query = query.eq("agent_id", agentId);
    // }

    // if (nodeId) {
    //   query = query.eq("node_id", nodeId);
    // }

    // if (status) {
    //   query = query.eq("status", status);
    // }

    // const { data, error } = await query;

    if (error) {
      console.error("Error fetching logs:", error);
      return NextResponse.json(
        { error: "Failed to fetch logs" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
