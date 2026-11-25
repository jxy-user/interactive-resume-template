"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  hover?: boolean;
}

export function GlassCard({ children, className, intensity = "medium", hover = false }: GlassCardProps) {
  const intensityClasses = {
    light: "bg-white/5 backdrop-blur-sm border-white/10",
    medium: "bg-white/10 backdrop-blur-md border-white/20",
    heavy: "bg-white/15 backdrop-blur-lg border-white/30",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        intensityClasses[intensity],
        hover && "hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 玻璃拟态按钮
 */
export function GlassButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-xl px-4 py-2 font-medium transition-all duration-300",
        "bg-white/10 backdrop-blur-md border border-white/20 text-white",
        "hover:bg-white/20 hover:border-white/30",
        "active:scale-[0.98] active:bg-white/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* 光泽效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
    </button>
  );
}

/**
 * 玻璃拟态输入框
 */
export function GlassInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 rounded-xl",
        "bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-gray-500",
        "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
        "hover:border-white/20",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}