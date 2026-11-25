"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CursorGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
  enabled?: boolean;
}

export function CursorGlow({
  color = "#3b82f6",
  size = 300,
  opacity = 0.15,
  className,
  enabled = true,
}: CursorGlowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 使用 requestAnimationFrame 优化性能
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!visible) return null;

  const { r, g, b } = hexToRgb(color);

  return (
    <div
      className={cn(
        "fixed pointer-events-none z-50 transition-all duration-300 ease-out",
        className
      )}
      style={{
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at center, rgba(${r}, ${g}, ${b}, ${opacity}) 0%, transparent 70%)`,
        transform: "translate(-50%, -50%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 59, g: 130, b: 246 };
}

/**
 * 光标跟随粒子效果
 */
export function CursorParticles({
  color = "#3b82f6",
  count = 10,
  className,
}: { color?: string; count?: number; className?: string } = {}) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 初始化粒子
    const initialParticles = Array.from({ length: count }, (_, i) => ({
      x: mousePos.current.x,
      y: mousePos.current.y,
      delay: i * 0.03,
    }));
    setParticles(initialParticles);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count]);

  // 更新粒子位置
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev.map((p, i) => ({
          ...p,
          x: p.x + (mousePos.current.x - p.x) * (0.1 + i * 0.02),
          y: p.y + (mousePos.current.y - p.y) * (0.1 + i * 0.02),
        }))
      );
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="fixed w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-100"
          style={{
            left: p.x,
            top: p.y,
            background: color,
            opacity: 1 - i / count,
            transform: "translate(-50%, -50%)",
            transitionDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}