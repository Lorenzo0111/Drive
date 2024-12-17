import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Drive",
  description: "Your drive app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Sidebar session={session?.session ?? null} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
