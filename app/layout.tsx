import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#07060b] text-white">
        {children}
      </body>
    </html>
  );
}