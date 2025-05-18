"use client";

interface DescriptionProps {
  description: string | null;
}

export function Description({ description }: DescriptionProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Description</h3>
      <p className="text-muted-foreground">
        {description || "No description provided."}
      </p>
    </div>
  );
}
