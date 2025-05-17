import type React from "react";
import { AuthProvider } from "@/contexts/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Suspense } from "react";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="braintrust-theme"
        >
          <AuthProvider>
            <Suspense fallback={<LoadingSkeleton />}>
              <LayoutWrapper>{children}</LayoutWrapper>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
