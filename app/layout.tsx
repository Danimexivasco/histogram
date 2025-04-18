import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils/cn";
import Providers from "@/providers";
import Header from "@/components/Header";
import "./globals.css";
import BottomTabBar from "@/components/BottomTabBar";
import AsideMenu from "@/components/AsideMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"]
});

export const metadata: Metadata = {
  title:       "Histogram",
  description: "The social media for history lovers 🏺"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");

  return (
    <html
      lang="en"
      className={cn(theme?.value === "dark" && "dark")}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        <Providers>
          <Header />
          <div className="flex">
            <AsideMenu />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <BottomTabBar />
        </Providers>
      </body>
    </html>
  );
}
