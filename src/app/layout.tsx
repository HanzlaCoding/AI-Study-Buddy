import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Deep Work Studio | Premium Study Companion",
  description: "A premium SaaS study companion designed to eliminate distractions and reduce cognitive load.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deep Work Studio",
  },
  formatDetection: {
    telephone: false,
  },
};

import { AudioProvider } from "@/context/AudioContext";
import { NotesProvider } from "@/context/NotesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={space_grotesk.variable}>
      <body className="antialiased font-sans">
        <AudioProvider>
          <NotesProvider>
            {children}
          </NotesProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
