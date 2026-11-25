"use client";

import React, { useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { useWindow } from "@/hooks/useWindow";
import { Window } from "@/components/desktop/Window";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { defaultWindowConfigs } from "@/lib/windowConfigs";
import type { DesktopIcon as DesktopIconType } from "@/types/desktop";

// 桌面图标配置
const desktopIcons: DesktopIconType[] = [
  { id: "museum", label: "数字展厅", icon: "🏛️", windowId: "museum", x: 40, y: 40 },
  { id: "about", label: "关于我", icon: "👤", windowId: "about", x: 180, y: 40 },
  { id: "education", label: "教育经历", icon: "📚", windowId: "education", x: 320, y: 40 },
  { id: "experience", label: "工作经历", icon: "💼", windowId: "experience", x: 460, y: 40 },
  { id: "skills", label: "技能专长", icon: "🛠️", windowId: "skills", x: 600, y: 40 },
  { id: "projects", label: "项目作品集", icon: "📦", windowId: "projects", x: 740, y: 40 },
  { id: "writing", label: "博客文章", icon: "📝", windowId: "writing", x: 880, y: 40 },
  { id: "contact", label: "联系我", icon: "📱", windowId: "contact", x: 1020, y: 40 },
  { id: "terminal", label: "终端", icon: "💻", windowId: "terminal", x: 1160, y: 40 },
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
      className="fixed inset-0 bg-gray-900 overflow-hidden flex flex-col"
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
        className="z-0 object-cover opacity-60"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 to-black/10" />

      {/* 桌面图标区域 */}
      <div className="relative z-20 h-full p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 content-start">
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
                      <Suspense fallback={<div className="p-4 text-gray-400 text-sm">组件加载中...</div>}>
                        <AppComponent />
                      </Suspense>
                    ) : (
                      <div className="p-4 text-gray-400 text-sm">组件加载中...</div>
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
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 min-w-[150px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={closeContextMenu}
        >
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            🖥️ 桌面
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => { closeContextMenu(); }}>
            📋 刷新桌面
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={() => { closeContextMenu(); }}>
            🎨 个性化设置
          </div>
        </div>
      )}
    </div>
  );
}