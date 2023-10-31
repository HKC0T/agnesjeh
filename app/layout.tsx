import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/siteHeader";
import { AuthProvider } from "@/components/auth-provider";
import QueryProviders from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgnesJeh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <QueryProviders>
          <body className={inter.className}>
            <SiteHeader />
            {children}
          </body>
        </QueryProviders>
      </AuthProvider>
    </html>
  );
}
