import type { Metadata, Viewport } from "next";
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
  title: {
    default: "交互式个人简历模板 | Interactive Resume Template",
    template: "%s | 交互式个人简历模板",
  },
  description: "基于桌面场景的交互式个人简历网站模板，支持主题切换、多语言、终端模拟器、彩蛋系统等特色功能。参加 Qoder 高校创造力大赛 LifeHack 赛道作品。",
  keywords: ["简历", "个人网站", "作品集", "交互式简历", "Next.js", "TypeScript", "Tailwind CSS", "Qoder大赛"],
  authors: [{ name: "交互式简历模板团队" }],
  creator: "交互式简历模板团队",
  publisher: "交互式简历模板团队",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://github.com/jxy-user/interactive-resume-template",
    siteName: "交互式个人简历模板",
    title: "交互式个人简历模板 - 桌面场景交互式简历",
    description: "基于桌面场景的交互式个人简历网站模板，参加 Qoder 高校创造力大赛 LifeHack 赛道作品。",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "交互式个人简历模板预览",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "交互式个人简历模板",
    description: "基于桌面场景的交互式个人简历网站模板",
    images: ["/images/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-hidden">
        {children}
      </body>
    </html>
  );
}