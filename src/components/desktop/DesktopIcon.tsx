"use client";

import { useState, useCallback } from "react";
import { windowIcons } from "@/lib/windowIcons";
import type { DesktopIcon as DesktopIconType, WindowId } from "@/types/desktop";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: DesktopIconType;
  onOpen: (id: WindowId) => void;
  onContextMenu?: (e: React.MouseEvent, icon: DesktopIconType) => void;
  isDragging?: boolean;
}

/**
 * 桌面图标 —— 博物馆入口的展签牌。
 * 细铜边玻璃方格 + 衬线展名，非 emoji。
 */
export function DesktopIcon({ icon, onOpen, onContextMenu, isDragging }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);
  const Icon = windowIcons[icon.windowId];

  const handleClick = useCallback(() => {
    onOpen(icon.windowId);
  }, [icon.windowId, onOpen]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsSelected(true);
      onContextMenu?.(e, icon);
    },
    [onContextMenu, icon]
  );

  return (
    <button
      type="button"
      aria-label={`打开${icon.label}`}
      className={cn(
        "group flex flex-col items-center gap-2 w-full max-w-[104px] cursor-pointer select-none rounded-sm bg-transparent border-0 p-0 text-inherit",
        isSelected && "outline outline-2 outline-primary outline-offset-2",
        isDragging && "opacity-50"
      )}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <span className="plaque-edge relative flex h-16 w-16 items-center justify-center bg-card/40 backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-card/75">
        <Icon
          size={26}
          strokeWidth={1.25}
          className="text-foreground/70 transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </span>
      <span className="font-display text-[13px] leading-tight text-foreground/80 transition-colors group-hover:text-foreground">
        {icon.label}
      </span>
    </button>
  );
}
