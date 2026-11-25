"use client";

import React, { useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { Monitor, RefreshCw, Palette } from "lucide-react";
import { useWindow } from "@/hooks/useWindow";
import { Window } from "@/components/desktop/Window";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { defaultWindowConfigs } from "@/lib/windowConfigs";
import type { DesktopIcon as DesktopIconType } from "@/types/desktop";

// 桌面展签配置 —— 图标视觉由 windowIcons 统一映射
const desktopIcons: DesktopIconType[] = [
  { id: "museum", label: "数字展厅", windowId: "museum", x: 40, y: 40 },
  { id: "about", label: "关于我", windowId: "about", x: 180, y: 40 },
  { id: "education", label: "教育经历", windowId: "education", x: 320, y: 40 },
  { id: "experience", label: "工作经历", windowId: "experience", x: 460, y: 40 },
  { id: "skills", label: "技能专长", windowId: "skills", x: 600, y: 40 },
  { id: "projects", label: "项目作品集", windowId: "projects", x: 740, y: 40 },
  { id: "writing", label: "博客文章", windowId: "writing", x: 880, y: 40 },
  { id: "contact", label: "联系我", windowId: "contact", x: 1020, y: 40 },
  { id: "terminal", label: "终端", windowId: "terminal", x: 1160, y: 40 },
];

// 组件映射 - 懒加载各应用组件
const AppComponents: Record<string, React.ComponentType<any>> = {
  MuseumApp: React.lazy(() => import("@/components/apps/MuseumApp").then((m) => ({ default: m.MuseumApp }))),
  AboutApp: React.lazy(() => import("@/components/apps/AboutApp").then((m) => ({ default: m.AboutApp }))),
  EducationApp: React.lazy(() => import("@/components/apps/EducationApp").then((m) => ({ default: m.EducationApp }))),
  ExperienceApp: React.lazy(() => import("@/components/apps/ExperienceApp").then((m) => ({ default: m.ExperienceApp }))),
  SkillsApp: React.lazy(() => import("@/components/apps/SkillsApp").then((m) => ({ default: m.SkillsApp }))),
  ProjectsApp: React.lazy(() => import("@/components/apps/ProjectsApp").then((m) => ({ default: m.ProjectsApp }))),
  WritingApp: React.lazy(() => import("@/components/apps/WritingApp").then((m) => ({ default: m.WritingApp }))),
  ContactApp: React.lazy(() => import("@/components/apps/ContactApp").then((m) => ({ default: m.ContactApp }))),
  TerminalApp: React.lazy(() => import("@/components/apps/TerminalApp").then((m) => ({ default: m.TerminalApp }))),
};

export function Desktop() {
  const {
    windows,
    openWindow,
    closeWindow,
    maximizeWindow,
    restoreWindow,
    setWindowPosition,
    setWindowSize,
    bringToFront,
    startDrag,
    startResize,
  } = useWindow();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // 关闭右键菜单
  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  // 桌面背景点击 - 取消选中
  const handleDesktopClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  // 桌面图标右键菜单
  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, icon: DesktopIconType) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  // 打开桌面图标对应的窗口
  const handleOpenIcon = useCallback((windowId: DesktopIconType["windowId"]) => {
    openWindow(windowId);
    closeContextMenu();
  }, [openWindow, closeContextMenu]);

  return (
    <div
      className="fixed inset-0 bg-ink overflow-hidden flex flex-col"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopClick}
    >
      {/* 壁纸背景 */}
      <Image
        src="/images/wallpaper.svg"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="z-0 object-cover opacity-50"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/80" />

      {/* 桌面展签区域 */}
      <div className="relative z-20 h-full p-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3 content-start">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            onOpen={handleOpenIcon}
            onContextMenu={handleIconContextMenu}
          />
        ))}
      </div>

      {/* 窗口区域 */}
      <div className="relative z-30 h-full overflow-hidden pointer-events-none">
        {Object.values(windows).filter((win) => win.isOpen).map((win) => {
            const config = defaultWindowConfigs[win.id];
            const AppComponent = AppComponents[config.component];

            return (
              <div key={win.id}>
                {win.isMinimized ? null : (
                  <Window
                    window={win}
                    config={config}
                    onClose={closeWindow}
                    onMaximize={maximizeWindow}
                    onRestore={restoreWindow}
                    onPositionChange={setWindowPosition}
                    onSizeChange={setWindowSize}
                    onBringToFront={bringToFront}
                    onStartDrag={startDrag}
                    onStartResize={startResize}
                  >
                    {/* 窗口内容 */}
                    {AppComponent ? (
                      <Suspense fallback={<div className="p-4 text-muted-foreground text-sm">组件加载中...</div>}>
                        <AppComponent />
                      </Suspense>
                    ) : (
                      <div className="p-4 text-muted-foreground text-sm">组件加载中...</div>
                    )}
                  </Window>
                )}
              </div>
            );
          })}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-card/95 backdrop-blur-md rounded-sm plaque-edge border border-border p-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={closeContextMenu}
        >
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/85 hover:bg-secondary cursor-default">
            <Monitor size={14} strokeWidth={1.5} aria-hidden="true" /> 桌面
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/85 hover:bg-secondary cursor-pointer" onClick={() => { closeContextMenu(); }}>
            <RefreshCw size={14} strokeWidth={1.5} aria-hidden="true" /> 刷新桌面
          </div>
          <div className="h-px bg-border my-1" />
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/85 hover:bg-secondary cursor-pointer" onClick={() => { closeContextMenu(); }}>
            <Palette size={14} strokeWidth={1.5} aria-hidden="true" /> 个性化设置
          </div>
        </div>
      )}
    </div>
  );
}
