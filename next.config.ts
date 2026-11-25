import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，适配 Qoder Sites / Vercel / GitHub Pages
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // 图片优化配置（静态导出，不依赖外部图床）
  images: {
    unoptimized: true,
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

};

export default nextConfig;