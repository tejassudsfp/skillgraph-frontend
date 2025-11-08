import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "skillgraph - ai agent framework",
  description: "an experimental agentic framework that replaces traditional tool-calling with skills. built for developers who want more control, lower costs, and better workflows. open source under apache 2.0.",
  icons: {
    icon: "/skillgraph.png",
    apple: "/skillgraph.png",
  },
  metadataBase: new URL("https://skillgraph.live"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillgraph.live",
    siteName: "skillgraph",
    title: "skillgraph - AI Agent Framework",
    description: "An experimental agentic framework that replaces traditional tool-calling with skills. Built for developers who want more control, lower costs, and better workflows.",
    images: [
      {
        url: "/skillgraph.png",
        width: 1200,
        height: 630,
        alt: "skillgraph - AI Agent Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "skillgraph - AI Agent Framework",
    description: "An experimental agentic framework that replaces traditional tool-calling with skills. Built for developers who want more control, lower costs, and better workflows.",
    images: ["/skillgraph.png"],
    creator: "@tejassudsfp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <Navbar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
