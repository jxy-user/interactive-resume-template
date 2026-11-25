"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WindowState, WindowId } from "@/types/desktop";
import { windowVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

interface WindowProps {
  window: WindowState;
  config: {
    id: WindowId;
    title: string;
    icon: string;
    minWidth: number;
    minHeight: number;
    component: string;
  };
  children: React.ReactNode;
  onClose: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onRestore: (id: WindowId) => void;
  onPositionChange: (id: WindowId, x: number, y: number) => void;
  onSizeChange: (id: WindowId, width: number, height: number) => void;
  onBringToFront: (id: WindowId) => void;
  onStartDrag: (id: WindowId, e: React.MouseEvent) => void;
  onStartResize: (id: WindowId, e: React.MouseEvent, direction: string) => void;
}

const windowResizableDirections = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;

export function Window({
  window: win,
  config,
  children,
  onClose,
  onMaximize,
  onRestore,
  onPositionChange,
  onSizeChange,
  onBringToFront,
  onStartDrag,
  onStartResize,
}: WindowProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [borderSize, setBorderSize] = useState(4); // 调整大小边框宽度
  const isMobile = useIsMobile();

  // 计算样式：小屏时窗口占满可视区域，避免固定坐标溢出
  const windowStyle: React.CSSProperties = isMobile
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  const headerHeight = 32;
  const resizeHandleSize = borderSize;

  const isMaximized = win.isMaximized;

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      if (e.target instanceof HTMLElement && (e.target as HTMLElement).closest("[data-resize-handle]")) {
        return;
      }
      onStartDrag(config.id, e as React.MouseEvent);
    },
    [config.id, isMobile, onStartDrag]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      onStartResize(config.id, e as React.MouseEvent, direction);
    },
    [config.id, onStartResize]
  );

  const handleClose = () => onClose(config.id);
  const handleMaximize = () => onMaximize(config.id);
  const handleRestore = () => onRestore(config.id);

  const handleClick = () => {
    onBringToFront(config.id);
  };

  return (
    <>
      {/* 窗口主体 */}
      <motion.div
        ref={windowRef}
        className={cn(
          "fixed flex flex-col z-50 select-none transition-all duration-100 pointer-events-auto",
          win.isMinimized && "hidden",
          win.isMaximized || isMobile
            ? "top-0 left-0 w-full h-full max-w-full max-h-full rounded-none shadow-2xl bg-card border border-border"
            : "rounded-2xl shadow-2xl bg-card border border-border"
        )}
        style={windowStyle}
        onClick={handleClick}
      >
        {/* 标题栏 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-1.5 cursor-default",
            isMaximized ? "bg-card" : "bg-card/80 backdrop-blur-md border-b border-border/50"
          )}
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">{config.icon}</span>
            <span className="text-xs font-medium truncate max-w-[200px]">{config.title}</span>
          </div>
          <div className="flex items-center gap-1">
            {!isMobile && (
              <button
                onClick={isMaximized ? handleRestore : handleMaximize}
                className="p-1 hover:bg-accent rounded-md transition-colors text-xs"
                title={isMaximized ? "还原" : "最大化"}
                aria-label={isMaximized ? "还原" : "最大化"}
              >
                {isMaximized ? "□" : "⧉"}
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-red-500 hover:text-white rounded-md transition-colors text-xs"
              title="关闭"
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden relative">
          {children}

          {/* 调整大小手柄 */}
          {!isMaximized && !isMobile && (
            <>
              {/* 右侧 */}
              <div
                className="absolute top-0 bottom-0 right-0 w-4 cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "e")}
              />
              {/* 底部 */}
              <div
                className="absolute left-0 right-0 bottom-0 h-4 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "s")}
              />
              {/* 右下角 */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
                onMouseDown={(e) => handleResizeMouseDown(e, "se")}
              >
                <div className="absolute right-1 bottom-1 w-2 h-2 border-t border-l border-gray-400/50" />
              </div>
              {/* 左下角 */}
              <div
                className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize bg-transparent"
                onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
              >
                <div className="absolute left-1 bottom-1 w-2 h-2 border-t border-r border-gray-400/50" />
              </div>
              {/* 右上角 */}
              <div
                className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize bg-transparent"
                onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
              >
                <div className="absolute right-1 top-1 w-2 h-2 border-b border-l border-gray-400/50" />
              </div>
              {/* 左上角 */}
              <div
                className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-transparent"
                onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
              >
                <div className="absolute left-1 top-1 w-2 h-2 border-b border-r border-gray-400/50" />
              </div>
              {/* 左侧 */}
              <div
                className="absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "w")}
              />
              {/* 上侧 */}
              <div
                className="absolute left-0 right-0 top-0 h-4 cursor-ns-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, "n")}
              />
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}