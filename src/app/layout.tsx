import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/utils/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Esprit Social Network",
  description: "Stage d'été",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
