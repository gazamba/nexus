"use client";

import { ExternalLink, Download } from "lucide-react";
import { Document } from "./types";
import { Button } from "@/components/ui/button";

interface DocumentsProps {
  documents: Document[];
}

export function Documents({ documents }: DocumentsProps) {
  const handleDownloadPDF = async (relatedId: string) => {
    try {
      const response = await fetch(`/api/documents/${relatedId}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document-${relatedId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Document Links</h3>
      </div>
      <div className="p-4 space-y-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
          >
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium"
            >
              {doc.title}
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadPDF(doc.related_id)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
