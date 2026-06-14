import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "F1 Data Hub",
  description: "Your home for Formula 1 data, drivers, teams, and races.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-gray-950 text-white min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}