import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { createDocument } from "@/lib/services/document-service";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const jsonData = await request.json();
    console.log(`jsonData: ${JSON.stringify(jsonData)}`);
    const { client_id, related_type, related_id, title } = jsonData;
    jsonData;

    if (!client_id || !related_id || !related_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const document = await createDocument({
        client_id,
        related_id,
        related_type,
        title: title,
      });

      return NextResponse.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      return NextResponse.json(
        { error: "Failed to create document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
