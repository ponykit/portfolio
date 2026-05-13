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
  title: "It Kong Portfolio | Backend-focused Full-stack Developer",
  description: "백엔드 중심 풀스택 개발자 It Kong의 프로젝트 포트폴리오입니다. Trip-pocket, CalcDock, Personality Type Explorer 등 실제 서비스와 프로젝트를 소개합니다.",
  keywords: ["portfolio", "backend developer", "full-stack developer", "Java", "Kotlin", "Spring Boot", "AWS", "Next.js", "React", "AI product"],
  authors: [{ name: "It Kong" }],
  openGraph: {
    title: "It Kong Portfolio",
    description: "사용자의 문제를 실제 서비스로 풀어내는 백엔드 중심 풀스택 개발자 포트폴리오",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
