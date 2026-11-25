"use client";

import { Desktop } from "@/components/desktop/Desktop";
import { useTheme } from "@/hooks/useTheme";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { GridPattern } from "@/components/effects/GridPattern";
import { RadialGradient } from "@/components/effects/GridPattern";
import { CursorGlow } from "@/components/effects/CursorGlow";

export default function Home() {
  const { resolvedTheme, primaryColor } = useTheme();

  return (
    <>
      {/* 背景效果层 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RadialGradient color={primaryColor} opacity={0.1} />
        <GridPattern size={80} color={primaryColor} opacity={0.03} />
        <ParticleBackground
          particleCount={40}
          color={primaryColor}
          lineColor={primaryColor}
          maxDistance={120}
          speed={0.2}
        />
      </div>

      {/* 光标跟随发光 */}
      <CursorGlow
        color={primaryColor}
        size={400}
        opacity={0.08}
        enabled={resolvedTheme === "dark"}
      />

      {/* 桌面场景 */}
      <Desktop />
    </>
  );
}
