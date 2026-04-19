import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SavFlix — Stop Overpaying for Streaming",
  description: "SavFlix analyzes your streaming subscriptions and shows you exactly which platforms to keep, cancel, or binge — saving you $30 to $100 every month.",
  icons: {
    icon: "/savflix/savflix_app_icon_gradient.png",
    apple: "/savflix/savflix_app_icon_gradient.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07060b] text-white">
        {children}
      </body>
    </html>
  );
}