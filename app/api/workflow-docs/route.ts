import { type NextRequest, NextResponse } from "next/server";
import {
  getWorkflowDoc,
  processWorkflowDoc,
} from "@/lib/services/input-processing-service";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;

    if (!file || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${clientId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("workflow-docs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const result = await processWorkflowDoc({
      clientId,
      uploadedBy: userId,
      filePath,
      fileName: file.name,
      fileType: file.type,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing workflow document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing document ID" },
        { status: 400 }
      );
    }

    const workflowDoc = await getWorkflowDoc(id);
    if (!workflowDoc) {
      return NextResponse.json(
        { error: "Workflow document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workflowDoc);
  } catch (error) {
    console.error("Error fetching workflow document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
