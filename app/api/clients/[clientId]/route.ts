import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
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

    const { clientId } = await params;

    console.log(`clientId: ${clientId}`);

    if (!clientId) {
      return NextResponse.json({ error: "Missing client ID" }, { status: 400 });
    }

    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .select(
        `
        id,
        name,
        url,
        document:document (*),
        workflow (*),
        client_user_assignment (client_user_id),
        solutions_engineer_assignment (se_user_id)
      `
      )
      .eq("id", clientId)
      .single();

    if (clientError || !clientData) {
      console.error("Error fetching client:", clientError);
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const clientUserId = clientData.client_user_assignment?.[0]?.client_user_id;
    const seUserId = clientData.solutions_engineer_assignment?.[0]?.se_user_id;

    const [{ data: clientUser }, { data: solutionsEngineer }] =
      await Promise.all([
        clientUserId
          ? supabase.from("user").select("*").eq("id", clientUserId).single()
          : Promise.resolve({ data: null }),
        seUserId
          ? supabase.from("user").select("*").eq("id", seUserId).single()
          : Promise.resolve({ data: null }),
      ]);

    const response = {
      ...clientData,
      client_user: clientUser ? [clientUser] : [],
      solutions_engineer: solutionsEngineer ? [solutionsEngineer] : [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
