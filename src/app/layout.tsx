import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import SiteFooter from "@/components/layout/SiteFooter";
import Header from "@/components/layout/Header";


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
