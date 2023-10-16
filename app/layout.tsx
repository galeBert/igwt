import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Modal from "@/components/ui/modal";
import AddContactModal from "@/providers/add-contact-provider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IGWT",
  description: "Trusted finance app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning={true} className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
            <Toaster />
            <AddContactModal />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
