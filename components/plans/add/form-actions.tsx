"use client";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = "Create Plan",
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );
}
