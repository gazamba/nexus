import { NextResponse } from "next/server";
import { getUsersByRole } from "@/lib/services/user-service";

export async function GET() {
  try {
    const users = await getUsersByRole("client");
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
