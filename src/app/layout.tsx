import type { Metadata } from "next";
import "./globals.css";
import BottomBar from "@/components/BottomBar";
import { GoogleAnalytics } from "@next/third-parties/google";
import TanstackQueryProvider from "./provider/TanstackQueryProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DigBook - 本との新しい出会い",
  description: "スワイプで見つける、あなたの次に読む1冊",
  openGraph: {
    title: "DigBook - 本との新しい出会い",
    description: "スワイプで見つける、あなたの次に読む1冊",
    url: "https://dig-book.vercel.app",
    siteName: "DigBook",
    images: [
      {
        url: "/assets/ogp.png",
        width: 1200,
        height: 630,
        alt: "DigBook - スワイプで本と出会う、新しい読書体験",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigBook - 本との新しい出会い",
    description: "スワイプで見つける、あなたの次に読む1冊",
    images: ["/assets/ogp.png"],
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
