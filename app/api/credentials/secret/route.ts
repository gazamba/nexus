import { NextRequest, NextResponse } from "next/server";
import {
  createSecret,
  retrieveCredentialDecryptedSecret,
  retrieveCredentialByCredentialId,
  deleteVaultSecret,
} from "@/lib/services/vault-service";

export async function POST(req: NextRequest) {
  try {
    const { secretName, secretKey } = await req.json();
    if (!secretName || !secretKey) {
      return NextResponse.json(
        { error: "Missing required fields for createSecret" },
        { status: 400 }
      );
    }
    console.log(`secretName: ${secretName}`);
    console.log(`secretKey: ${secretKey}`);
    const data = await createSecret(secretName, secretKey);
    console.log(`data vault: ${data}`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { vaultKey } = await req.json();
    if (!vaultKey) {
      return NextResponse.json(
        { error: "Missing vaultKey for deleteCredential" },
        { status: 400 }
      );
    }
    await deleteVaultSecret(vaultKey);
    return NextResponse.json({ success: true });
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
    const vaultkey = searchParams.get("vaultkey");
    const credentialId = searchParams.get("credentialId");

    if (vaultkey) {
      const data = await retrieveCredentialDecryptedSecret(vaultkey);
      return NextResponse.json({ data });
    }
    if (credentialId) {
      const data = await retrieveCredentialByCredentialId(credentialId);
      return NextResponse.json({ data });
    }
    return NextResponse.json(
      { error: "Missing vaultkey or credentialId query parameter" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
