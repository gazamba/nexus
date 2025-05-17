import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  let query = supabase.from("department").select("*");
  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
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
  const { name } = body;
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("department")
    .insert([{ name }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
