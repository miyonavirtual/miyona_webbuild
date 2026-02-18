import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google"; 
import "./globals.css";
import { cn } from "@/lib/utils";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata: Metadata = {
  title: "Miyona.ai | Your Cute AI Companion",
  description: "Experience the most adorable AI companionship with 3D interaction, emotional intelligence, and voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          nunito.variable,
          quicksand.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
