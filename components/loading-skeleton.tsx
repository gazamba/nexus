"use client";

export function LoadingSkeleton() {
  return (
    <div className="flex h-screen">
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

      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="h-12 bg-muted/50" />
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
