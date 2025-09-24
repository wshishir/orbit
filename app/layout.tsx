import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Host_Grotesk, Inter } from "next/font/google";
import "./globals.css";


const host = Host_Grotesk({
  subsets: ["latin"],
  display: "swap",
}) ;

export const metadata: Metadata = {
  title: "orbit3.chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${host.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
