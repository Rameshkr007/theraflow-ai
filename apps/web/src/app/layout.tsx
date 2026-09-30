import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TheraFlow AI",
    default: "TheraFlow AI — Your Practice, Intelligently Managed",
  },
  description:
    "An AI-Native Digital Operating System for Modern Therapy Practices. Website builder, booking, analytics, and AI copilot — all in one platform.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://theraflow.app",
    siteName: "TheraFlow AI",
    title: "TheraFlow AI — Your Practice, Intelligently Managed",
    description:
      "AI-Native Digital Operating System for Modern Therapy Practices.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-surface font-sans antialiased",
          inter.variable,
          lora.variable
        )}
      >
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
