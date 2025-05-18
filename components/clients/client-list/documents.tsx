"use client";

import { ExternalLink } from "lucide-react";
import { Document } from "./types";

interface DocumentsProps {
  documents: Document[];
}

export function Documents({ documents }: DocumentsProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Document Links</h3>
      </div>
      <div className="p-4 space-y-4">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
          >
            <span className="font-medium">{doc.title}</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
