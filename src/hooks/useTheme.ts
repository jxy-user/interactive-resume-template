"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface UseThemeReturn {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [mounted, setMounted] = useState(false);

  // 解析 system 模式下的实际主题
  const resolveTheme = useCallback((mode: ThemeMode): "light" | "dark" => {
    if (mode === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "dark";
    }
    return mode;
  }, []);

  // 应用主题到 DOM
  const applyTheme = useCallback((mode: ThemeMode, color: string) => {
    const resolved = resolveTheme(mode);
    setResolvedTheme(resolved);

    if (typeof document !== "undefined") {
      const root = document.documentElement;

      // 设置深色/浅色模式
      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // 设置主色调 CSS 变量
      root.style.setProperty("--primary", color);
      root.style.setProperty("--primary-rgb", hexToRgb(color));
    }
  }, [resolveTheme]);

  // 十六进制颜色转 RGB 字符串
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 10)} ${parseInt(result[2], 10)} ${parseInt(result[3], 10)}`;
    }
    return "59 130 246"; // 默认 blue-500
  };

  // 初始化：从 localStorage 读取
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const savedColor = localStorage.getItem("primaryColor");

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setPrimaryColor(savedColor);

    // 初始应用
    const initialTheme = savedTheme || "system";
    const initialColor = savedColor || "#3b82f6";
    applyTheme(initialTheme, initialColor);
  }, [applyTheme]);

  // 监听系统主题变化
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system", primaryColor);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, primaryColor, applyTheme, mounted]);

  // 保存设置并应用
  const handleSetTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme, primaryColor);
  }, [applyTheme, primaryColor]);

  const handleSetPrimaryColor = useCallback((color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("primaryColor", color);
    applyTheme(theme, color);
  }, [applyTheme, theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme,
    primaryColor,
    setPrimaryColor: handleSetPrimaryColor,
  };
}