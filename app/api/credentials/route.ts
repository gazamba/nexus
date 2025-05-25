import { NextRequest, NextResponse } from "next/server";
import {
  createCredential,
  getCredentials,
} from "@/lib/services/credential-service";
import { createClient } from "@/utils/supabase/server";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, string> = {};
    const client_id = searchParams.get("client_id");
    const provider = searchParams.get("provider");
    const variable_name = searchParams.get("variable_name");

    if (client_id) params.client_id = client_id;
    if (provider) params.provider = provider;
    if (variable_name) params.variable_name = variable_name;

    const credentials = await getCredentials(params);
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { client_id, provider, variable_name, variable_value, vault_key } =
      body;

    if (!client_id || !provider || !variable_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const updateData: Record<string, any> = {};
    if (typeof variable_value !== "undefined")
      updateData.variable_value = variable_value;
    if (typeof vault_key !== "undefined") updateData.vault_key = vault_key;

    const { data, error } = await supabase
      .from("credential")
      .update(updateData)
      .eq("client_id", client_id)
      .eq("provider", provider)
      .eq("variable_name", variable_name)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to update credential" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
