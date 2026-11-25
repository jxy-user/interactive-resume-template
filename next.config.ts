import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，适配 Qoder Sites / Vercel / GitHub Pages
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出需要
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Turbopack 配置
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // 编译时环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: "交互式个人简历模板",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  // 重定向配置（可选）
  async redirects() {
    return [];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;