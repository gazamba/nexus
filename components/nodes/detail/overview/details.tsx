"use client";

interface DetailsProps {
  type: string;
  isPublic: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export function Details({
  type,
  isPublic,
  createdAt,
  updatedAt,
}: DetailsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Details</h3>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Type</dt>
          <dd className="font-medium">{type}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Public</dt>
          <dd className="font-medium">{isPublic ? "Yes" : "No"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium">
            {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Last Updated</dt>
          <dd className="font-medium">
            {updatedAt ? new Date(updatedAt).toLocaleDateString() : "Unknown"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
