"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useNodeForm } from "./context";

export function Header() {
  const { formData } = useNodeForm();

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <Link
          href="/nodes"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back to Nodes</span>
        </Link>
        <span className="text-gray-400 mx-2">|</span>
        <h1 className="text-xl font-medium">
          {formData.name ? `Edit Node: ${formData.name}` : "Create New Node"}
        </h1>
      </div>
    </div>
  );
}
