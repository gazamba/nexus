import { createClient } from "@/utils/supabase/server";
import { Document } from "@/types/types";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execAsync = promisify(exec);

export const createDocument = async (data: Document) => {
  const supabase = await createClient();
  console.log(`data: ${JSON.stringify(data)}`);
  const { data: document, error } = await supabase
    .from("document")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return document;
};

export const generatePDFFromDocument = async (
  relatedId: string,
  relatedType: string
) => {
  const supabase = await createClient();

  if (relatedType === "proposal") {
    const { data: document, error } = await supabase
      .from("proposal")
      .select("*")
      .eq("id", relatedId)
      .single();

    if (error || !document) {
      throw new Error("Document not found");
    }

    const tempDir = path.join(process.cwd(), "tmp", uuidv4());
    await fs.mkdir(tempDir, { recursive: true });
    const texFilePath = path.join(tempDir, "document.tex");
    const pdfFilePath = path.join(tempDir, "document.pdf");

    try {
      await fs.writeFile(texFilePath, document.latex_content);

      await execAsync(
        `latexmk -pdf -pdflatex="pdflatex -interaction=nonstopmode" ${texFilePath}`,
        { cwd: tempDir }
      );

      await fs.access(pdfFilePath);

      const pdfBuffer = await fs.readFile(pdfFilePath);

      await fs.rm(tempDir, { recursive: true, force: true });

      return pdfBuffer;
    } catch (error) {
      await fs.rm(tempDir, { recursive: true, force: true });
      throw error;
    }
  } else {
    throw new Error("Invalid related type");
  }
};
