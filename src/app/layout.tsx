import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "此人在展 · 一个人的博物馆式简历",
    template: "%s | 此人在展",
  },
  description:
    "把一份简历做成一座博物馆：策展式排版、展签导视、克制的光影。任何人只需修改一份 JSON 即可复用。参加 Qoder 高校创造力大赛 LifeHack 赛道作品。",
  keywords: ["简历", "个人网站", "作品集", "交互式简历", "数字展厅", "Next.js", "Qoder大赛"],
  authors: [{ name: "交互式简历模板团队" }],
  creator: "交互式简历模板团队",
  publisher: "交互式简历模板团队",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://github.com/jxy-user/interactive-resume-template",
    siteName: "此人在展",
    title: "此人在展 · 一个人的博物馆式简历",
    description: "把简历做成一座博物馆，用策展的方式呈现一段职业轨迹。",
  },
  twitter: {
    card: "summary",
    title: "此人在展 · 一个人的博物馆式简历",
    description: "把简历做成一座博物馆，用策展的方式呈现一段职业轨迹。",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
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
      <body className="min-h-full bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
