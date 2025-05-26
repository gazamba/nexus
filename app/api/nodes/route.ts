import { type NextRequest, NextResponse } from "next/server";
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

    const { data, error } = await supabase.from("node").select("*").limit(100);
    console.log(`data: ${data}`);
    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in nodes API route:", error);
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
    const user = userData?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(`body: ${JSON.stringify(body)}`);

    const { data, error } = await supabase
      .from("node")
      .insert([
        {
          name: body.name,
          description: body.description || "",
          code: body.code,
          is_public: body.is_public || false,
          created_by: user.id,
          inputs: body.inputs,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating node:", error);
      return NextResponse.json(
        { error: "Failed to create node" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data[0].id });
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
