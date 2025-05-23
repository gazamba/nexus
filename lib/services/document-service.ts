import { createClient } from "@/utils/supabase/server";
import { Document } from "@/types/types";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const createDocument = async (data: Document) => {
  const supabase = await createClient();

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

export async function generatePDFFromDocument(
  relatedId: string,
  relatedType: string
) {
  const supabase = await createClient();

  if (relatedType !== "proposal") {
    throw new Error(
      "Invalid related type: Only 'proposal' is supported for PDF generation."
    );
  }

  const { data: documentData, error: fetchError } = await supabase
    .from("proposal")
    .select("html_content")
    .eq("id", relatedId)
    .single();

  if (fetchError || !documentData?.html_content) {
    console.error(`Error fetching proposal for ID ${relatedId}:`, fetchError);
    throw new Error(
      `Proposal not found or content missing for ID ${relatedId}. ${
        fetchError?.message || "No html_content field."
      }`
    );
  }

  const htmlContent = documentData.html_content;

  const isLocal = process.env.NODE_ENV === "development";

  console.log("PDF Generation Environment:", {
    isLocal,
    platform: process.platform,
    arch: process.arch,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV, // Common Vercel env var
    VERCEL_ENV: process.env.VERCEL_ENV,
  });

  let browser = null;

  try {
    if (isLocal) {
      console.log("Launching puppeteer (local)...");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      console.log("Attempting to use @sparticuz/chromium...");
      const executablePath = await chromium.executablePath();
      console.log("Using @sparticuz/chromium executablePath:", executablePath);

      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
      console.log("Launched puppeteer-core with @sparticuz/chromium.");
    }

    const page = await browser.newPage();

    console.log("Setting page content...");
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });
    console.log("Page content set.");

    console.log("Generating PDF buffer...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "1in",
        right: "1in",
        bottom: "1in",
        left: "1in",
      },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="font-size: 10pt; text-align: center; width: 100%; padding-top: 5px; border-top: 1px solid #bbb;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>`,
    });
    console.log("PDF buffer generated.");

    return pdfBuffer;
  } catch (err) {
    console.error("Error during PDF generation process:", err);
    if (err instanceof Error && err.stack) {
      console.error("Stack trace:", err.stack);
    }
    throw new Error(
      `Failed to generate PDF: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
      console.log("Browser closed.");
    }
  }
}
