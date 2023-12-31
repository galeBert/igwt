import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import AddContactModal from "@/providers/add-contact-provider";
import ToastProvider from "@/providers/toast-provider";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import LandingPage from "./(root)/components/landing-page";

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
            <ToastProvider />
            <AddContactModal />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
