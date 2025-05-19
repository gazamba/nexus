import type React from "react";
import { AuthProvider } from "@/contexts/auth-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Suspense } from "react";
import "./globals.css";

export const metadata = {
  title: "Nexus App",
  description:
    "A platform that automates client workflows by generating custom code and AI agents from survey data and documentation.",
  icons: {
    icon: "/favicon.png",
  },
};

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
