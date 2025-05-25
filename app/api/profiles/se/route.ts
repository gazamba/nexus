import { NextResponse } from "next/server";
import { getSolutionsEngineers } from "@/lib/services/profile-service";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
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

    const solutionsEngineers = await getSolutionsEngineers();
    return NextResponse.json({ solutionsEngineers });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
