"use client";

import { Desktop } from "@/components/desktop/Desktop";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { GridPattern } from "@/components/effects/GridPattern";
import { RadialGradient } from "@/components/effects/GridPattern";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { motion } from "framer-motion";

export default function Home() {
  const { resolvedTheme, primaryColor } = useTheme();
  const { lang } = useI18n();

  // 设置 CSS 变量
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty(
      "--primary-rgb",
      primaryColor
        .replace("#", "")
        .match(/.{2}/g)
        ?.map((x) => parseInt(x, 16))
        .join(" ") || "59 130 246"
    );
  }

  return (
    <>
      {/* 背景效果层 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RadialGradient color={primaryColor} opacity={0.1} />
        <GridPattern size={80} color={primaryColor} opacity={0.03} />
        <ParticleBackground particleCount={40} color={primaryColor} lineColor={primaryColor} maxDistance={120} speed={0.2} />
      </div>

      {/* 光标跟随发光 */}
      <CursorGlow color={primaryColor} size={400} opacity={0.08} enabled={resolvedTheme === "dark"} />

      {/* 桌面场景 */}
      <Desktop />

      {/* 启动动画 */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center pointer-events-none"
      >
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient mb-4">交互式简历</div>
          <div className="text-muted-foreground">正在加载桌面环境...</div>
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}