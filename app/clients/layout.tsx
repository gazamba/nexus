import type React from "react"

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-auto">{children}</div>
}
