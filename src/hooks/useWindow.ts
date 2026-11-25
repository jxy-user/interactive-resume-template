"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { WindowState, WindowId, WindowConfig } from "@/types/desktop";

interface UseWindowReturn {
  windows: Record<WindowId, WindowState>;
  activeWindow: WindowId | null;
  openWindow: (id: WindowId, config?: Partial<WindowConfig>) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  setWindowPosition: (id: WindowId, x: number, y: number) => void;
  setWindowSize: (id: WindowId, width: number, height: number) => void;
  bringToFront: (id: WindowId) => void;
  startDrag: (id: WindowId, e: React.MouseEvent) => void;
  startResize: (id: WindowId, e: React.MouseEvent, direction: string) => void;
}

const defaultWindowConfigs: Record<WindowId, WindowConfig> = {
  about: {
    id: "about",
    title: "关于我",
    icon: "👤",
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    component: "AboutApp",
  },
  education: {
    id: "education",
    title: "教育经历",
    icon: "📚",
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    component: "EducationApp",
  },
  experience: {
    id: "experience",
    title: "工作经历",
    icon: "💼",
    width: 900,
    height: 650,
    minWidth: 600,
    minHeight: 450,
    component: "ExperienceApp",
  },
  skills: {
    id: "skills",
    title: "技能专长",
    icon: "🛠️",
    width: 850,
    height: 650,
    minWidth: 550,
    minHeight: 450,
    component: "SkillsApp",
  },
  projects: {
    id: "projects",
    title: "项目作品集",
    icon: "📦",
    width: 950,
    height: 700,
    minWidth: 650,
    minHeight: 500,
    component: "ProjectsApp",
  },
  writing: {
    id: "writing",
    title: "博客文章",
    icon: "📝",
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 400,
    component: "WritingApp",
  },
  contact: {
    id: "contact",
    title: "联系我",
    icon: "📱",
    width: 600,
    height: 550,
    minWidth: 450,
    minHeight: 400,
    component: "ContactApp",
  },
  terminal: {
    id: "terminal",
    title: "终端",
    icon: "💻",
    width: 900,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    component: "TerminalApp",
  },
};

const initialWindowState: Record<WindowId, WindowState> = {
  about: { id: "about", x: 100, y: 100, width: 800, height: 600, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  education: { id: "education", x: 150, y: 150, width: 800, height: 600, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  experience: { id: "experience", x: 200, y: 200, width: 900, height: 650, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  skills: { id: "skills", x: 250, y: 250, width: 850, height: 650, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  projects: { id: "projects", x: 300, y: 300, width: 950, height: 700, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  writing: { id: "writing", x: 350, y: 350, width: 800, height: 600, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  contact: { id: "contact", x: 400, y: 400, width: 600, height: 550, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
  terminal: { id: "terminal", x: 450, y: 450, width: 900, height: 600, zIndex: 10, isMinimized: false, isMaximized: false, isActive: false },
};

let zIndexCounter = 100;

export { defaultWindowConfigs, initialWindowState };

export function useWindow(): UseWindowReturn {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindowState);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const dragRef = useRef<{ id: WindowId; startX: number; startY: number; startWindowX: number; startWindowY: number } | null>(null);
  const resizeRef = useRef<{ id: WindowId; startX: number; startY: number; startWidth: number; startHeight: number; direction: string } | null>(null);

  // 生成新的 z-index
  const getNextZIndex = useCallback(() => {
    return ++zIndexCounter;
  }, []);

  // 打开窗口
  const openWindow = useCallback((id: WindowId, config?: Partial<WindowConfig>) => {
    setWindows((prev) => {
      const windowConfig = { ...defaultWindowConfigs[id], ...config };
      const newState = {
        ...prev[id],
        ...windowConfig,
        isMinimized: false,
        isActive: true,
        zIndex: getNextZIndex(),
      };
      return { ...prev, [id]: newState };
    });
    setActiveWindow(id);
  }, [getNextZIndex]);

  // 关闭窗口
  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isActive: false } }));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  // 最小化窗口
  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: true, isActive: false } }));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  // 最大化窗口
  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => {
      const win = prev[id];
      if (win.isMaximized) {
        // 还原到之前的位置和大小（这里简化处理）
        return { ...prev, [id]: { ...win, isMaximized: false, isActive: true, zIndex: getNextZIndex() } };
      }
      return { ...prev, [id]: { ...win, isMaximized: true, isActive: true, zIndex: getNextZIndex() } };
    });
    setActiveWindow(id);
  }, [getNextZIndex]);

  // 还原窗口
  const restoreWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: false, isMaximized: false, isActive: true, zIndex: getNextZIndex() } }));
    setActiveWindow(id);
  }, [getNextZIndex]);

  // 设置窗口位置
  const setWindowPosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }));
  }, []);

  // 设置窗口大小
  const setWindowSize = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], width, height } }));
  }, []);

  // 置顶窗口
  const bringToFront = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: getNextZIndex(), isActive: true } }));
    setActiveWindow(id);
  }, [getNextZIndex]);

  // 开始拖拽
  const startDrag = useCallback((id: WindowId, e: React.MouseEvent) => {
    const win = windows[id];
    if (win.isMaximized) return;

    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startWindowX: win.x,
      startWindowY: win.y,
    };

    e.preventDefault();
    bringToFront(id);
  }, [windows, bringToFront]);

  // 开始调整大小
  const startResize = useCallback((id: WindowId, e: React.MouseEvent, direction: string) => {
    const win = windows[id];
    if (win.isMaximized) return;

    resizeRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: win.width,
      startHeight: win.height,
      direction,
    };

    e.preventDefault();
    e.stopPropagation();
    bringToFront(id);
  }, [windows, bringToFront]);

  // 全局鼠标移动处理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 处理拖拽
      if (dragRef.current) {
        const { id, startX, startY, startWindowX, startWindowY } = dragRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        setWindowPosition(id, startWindowX + dx, startWindowY + dy);
      }

      // 处理调整大小
      if (resizeRef.current) {
        const { id, startX, startY, startWidth, startHeight, direction } = resizeRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction.includes("e")) newWidth = Math.max(400, startWidth + dx);
        if (direction.includes("w")) newWidth = Math.max(400, startWidth - dx);
        if (direction.includes("s")) newHeight = Math.max(300, startHeight + dy);
        if (direction.includes("n")) newHeight = Math.max(300, startHeight - dy);

        setWindowSize(id, newWidth, newHeight);

        // 如果向西/北调整，同时调整位置
        if (direction.includes("w")) {
          const win = windows[id];
          setWindowPosition(id, win.x + (startWidth - newWidth), win.y);
        }
        if (direction.includes("n")) {
          const win = windows[id];
          setWindowPosition(id, win.x, win.y + (startHeight - newHeight));
        }
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setWindowPosition, setWindowSize, windows]);

  return {
    windows,
    activeWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    setWindowPosition,
    setWindowSize,
    bringToFront,
    startDrag,
    startResize,
  };
}