"use client";

import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
}

export function GridPattern({ className, size = 60, color = "#3b82f6", opacity = 0.05 }: GridPatternProps) {
  return (
    <div
      className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden", className)}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  );
}

/**
 * 径向渐变背景
 */
export function RadialGradient({
  className,
  color = "#3b82f6",
  opacity = 0.15,
}: { className?: string; color?: string; opacity?: number } = {}) {
  return (
    <div
      className={cn("fixed inset-0 z-0 pointer-events-none", className)}
      style={{
        background: `radial-gradient(ellipse at center, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
      }}
    />
  );
}

/**
 * 网格动画背景
 */
export function AnimatedGrid({
  className,
  color = "#3b82f6",
  speed = 20,
}: { className?: string; color?: string; speed?: number } = {}) {
  return (
    <div
      className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden", className)}
      style={{
        backgroundImage: `
          linear-gradient(${color}15 1px, transparent 1px),
          linear-gradient(90deg, ${color}15 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: `gridMove ${speed}s linear infinite`,
      }}
    >
      <style jsx global>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
      `}</style>
    </div>
  );
}