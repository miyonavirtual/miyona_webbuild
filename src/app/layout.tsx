import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TextSettingsProvider } from "@/components/TextSettingsProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Luvoia.ai | Your Deepest Connection",
  description: "Experience an AI companionship that understands your desires, with immersive 3D interaction and emotional depth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@100;300;400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TextSettingsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster theme="dark" position="bottom-right" richColors />
          </ThemeProvider>
        </TextSettingsProvider>
      </body>
    </html>
  );
}
