import { createClient } from "@/utils/supabase/server";
import { Document } from "@/types/types";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const createDocument = async (data: Document) => {
  const supabase = await createClient();
  console.log(`data: ${JSON.stringify(data)}`);
  const { data: document, error } = await supabase
    .from("document")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create document: ${error.message}`);
  }

  return document;
};

export const generatePDFFromDocument = async (
  relatedId: string,
  relatedType: string
) => {
  const supabase = await createClient();
  console.log(`relatedId: ${relatedId}`);
  console.log(`relatedType: ${relatedType}`);

  if (relatedType !== "proposal") {
    throw new Error("Invalid related type: Only 'proposal' is supported");
  }

  const { data: document, error } = await supabase
    .from("proposal")
    .select("html_content") // Contains HTML content
    .eq("id", relatedId)
    .single();

  if (error || !document?.html_content) {
    throw new Error(
      `Proposal not found for ID ${relatedId}: ${
        error?.message || "No content"
      }`
    );
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(document.html_content, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="font-size: 10pt; text-align: center; width: 100%;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>`,
      preferCSSPageSize: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  } catch (error) {
    throw new Error(
      `Failed to generate PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
