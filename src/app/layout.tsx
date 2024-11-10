import type { Metadata } from "next";
import "./globals.css";
import BottomBar from "@/components/BottomBar";
import Header from "../components/Header";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "DigBook",
  description: "Your digital bookshelf companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID!} />
        <main className="flex-1">
          {children}
        </main>
        <BottomBar />
      </body>
    </html>
  );
}
