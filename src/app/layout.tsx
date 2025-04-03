import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import dynamic from "next/dynamic";
import SiteFooter from "@/components/layout/SiteFooter";

// Dynamically import the Header to avoid client/server incompatibility issues
const Header = dynamic(() => import('@/components/layout/Header'), { loading: () => null });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered Digital Content Generator",
  description: "Create stunning digital content for your business with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
