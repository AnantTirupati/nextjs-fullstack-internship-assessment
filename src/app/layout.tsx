import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PrimeTradeAI — Full-Stack Platform",
  description: "A production-ready full-stack application with Next.js 15, MongoDB, JWT authentication, RBAC, and comprehensive product management.",
  keywords: ["Next.js", "MongoDB", "Full-Stack", "JWT", "Authentication", "Product Management"],
  authors: [{ name: "PrimeTradeAI Platform" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 72px)' }}>
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
