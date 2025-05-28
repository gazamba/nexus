import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

type ClientInsert = Database["public"]["Tables"]["client"]["Insert"];
type ClientUserAssignmentInsert =
  Database["public"]["Tables"]["client_user_assignment"]["Insert"];
type SolutionsEngineerAssignmentInsert =
  Database["public"]["Tables"]["solutions_engineer_assignment"]["Insert"];
type UserInsert = Database["public"]["Tables"]["user"]["Insert"];

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

    const { data, error } = await supabase
      .from("client")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      return NextResponse.json(
        { error: "Failed to fetch clients" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const authUserId = userData?.user?.id;

    if (!authUserId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { client, user, solutionsEngineerId } = body;

    if (!client) {
      return NextResponse.json(
        { error: "Missing required client data" },
        { status: 400 }
      );
    }

    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .insert(client as ClientInsert)
      .select("id")
      .single();

    if (clientError || !clientData) {
      return NextResponse.json(
        { error: "Failed to create client" },
        { status: 500 }
      );
    }
    const clientId = clientData.id;

    if (user) {
      let userId = user.id;
      if (!userId) {
        const { data: userData, error: userError } = await supabase
          .from("user")
          .insert(user as UserInsert)
          .select("id")
          .single();
        if (userError || !userData) {
          return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
          );
        }
        userId = userData.id;
      }

      const { error: assignmentError } = await supabase
        .from("client_user_assignment")
        .insert({
          client_id: clientId,
          client_user_id: userId,
        } as ClientUserAssignmentInsert);
      if (assignmentError) {
        return NextResponse.json(
          { error: "Failed to create client_user_assignment" },
          { status: 500 }
        );
      }
    }

    if (solutionsEngineerId) {
      const { error: seAssignmentError } = await supabase
        .from("solutions_engineer_assignment")
        .insert({
          client_id: clientId,
          se_user_id: solutionsEngineerId,
        } as SolutionsEngineerAssignmentInsert);
      if (seAssignmentError) {
        return NextResponse.json(
          { error: "Failed to create solutions_engineer_assignment" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ id: clientId });
  } catch (error) {
    console.error("Error creating client and assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
