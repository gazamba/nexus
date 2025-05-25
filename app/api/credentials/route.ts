import { NextRequest, NextResponse } from "next/server";
import { createCredential } from "@/lib/services/credential-service";

export async function POST(req: NextRequest) {
  try {
    const {
      client_id,
      provider,
      variable_name,
      variable_value,
      vault_key,
      is_secret,
    } = await req.json();
    console.log("Passou aqui");
    console.log(`client_id: ${client_id}`);
    console.log(`provider: ${provider}`);
    console.log(`variable_name: ${variable_name}`);
    console.log(`variable_value: ${variable_value}`);
    console.log(`vault_key: ${vault_key}`);
    console.log(`is_secret: ${is_secret}`);

    if (!client_id || !provider || !variable_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let credential;
    if (is_secret) {
      credential = await createCredential({
        client_id,
        provider,
        variable_name,
        vault_key,
        is_secret,
      });
    } else {
      credential = await createCredential({
        client_id,
        provider,
        variable_name,
        variable_value,
        is_secret,
      });
    }
    return NextResponse.json(credential);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
