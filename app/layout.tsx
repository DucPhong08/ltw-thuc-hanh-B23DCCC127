import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Class Deadline Hub — Cổng thông tin Deadline của Lớp",
    template: "%s | Class Deadline Hub",
  },
  description:
    "Cổng thông tin theo dõi và quản lý deadline các môn học dành cho sinh viên PTIT. Cập nhật liên tục, chính xác và trực quan.",
  authors: [{ name: "PTIT Class Hub" }],
  keywords: [
    "deadline hub",
    "ptit",
    "lớp học",
    "quản lý deadline",
    "sinh viên",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
