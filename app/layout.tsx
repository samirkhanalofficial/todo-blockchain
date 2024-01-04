import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "TODO Blockchain",
  description:
    "Simple todo app based on blockchain and smart contracts using solidity and ethers.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>{children}</body>
      <Toaster />
    </html>
  );
}
