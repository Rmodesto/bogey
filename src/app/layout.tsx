import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BogeyMan | Drone Exam Training",
  description:
    "Aviation-grade training platform for FAA Part 107 drone certification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
