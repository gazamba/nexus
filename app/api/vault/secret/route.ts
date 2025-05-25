import { NextRequest, NextResponse } from "next/server";
import { createSecret } from "@/lib/services/vault-service";

export async function POST(req: NextRequest) {
  try {
    const { secretName, secretKey } = await req.json();

    if (!secretName || !secretKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await createSecret(secretName, secretKey);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
