import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  },
  twitter: {
    card: "summary",
    title: "交互式个人简历模板",
    description: "基于桌面场景的交互式个人简历网站模板",
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
    <html lang="zh" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-hidden">
        {children}
      </body>
    </html>
  );
}