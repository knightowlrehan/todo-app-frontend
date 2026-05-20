import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App ",
  description: "A todo app built with Next.js and AWS SAM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
