import type { Metadata } from "next";
import "./globals.css";
import BottomBar from "@/components/BottomBar";
import { GoogleAnalytics } from "@next/third-parties/google";
import TanstackQueryProvider from "./provider/TanstackQueryProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DigBook",
  description: "Your digital bookshelf companion",
  openGraph: {
    title: "DigBook",
    description: "Your digital bookshelf companion",
    url: "https://dig-book.vercel.app",
    siteName: "DigBook",
    images: [
      {
        url: "/assets/ogp.png", // OGP画像のURL
        width: 1200,
        height: 630,
        alt: "DigBook - Your digital bookshelf companion",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigBook",
    description: "Your digital bookshelf companion",
    images: ["/assets/ogp.png"], // OGP画像のURL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID!} />
        <main className="flex-1">
          <Suspense fallback={<div>Loading...</div>}>
            <TanstackQueryProvider>
              {children}
            </TanstackQueryProvider>
          </Suspense>
        </main>
        <BottomBar />
      </body>
    </html>
  );
}
