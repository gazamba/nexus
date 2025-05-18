"use client";

export function ClientSidebarLoading() {
  return (
    <div className="w-48 border-r bg-background h-full flex flex-col">
      <div className="h-14 border-b flex items-center justify-center gap-2">
        <div className="h-5 w-5 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {[...Array(8)].map((_, i) => (
            <li key={i} className="h-9 bg-muted animate-pulse rounded" />
          ))}
        </ul>
      </nav>
    </div>
  );
}
