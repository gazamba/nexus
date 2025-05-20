import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generatePDFFromDocument } from "@/lib/services/document-service";

export async function GET(
  request: Request,
  { params }: { params: { relatedId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { relatedId } = await params;
    if (!relatedId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const { data: document, error: docError } = await supabase
      .from("document")
      .select("id,related_id, related_type")
      .eq("related_id", relatedId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    try {
      const pdfBuffer = await generatePDFFromDocument(
        document.related_id,
        document.related_type
      );

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="document-${document.id}.pdf"`,
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
