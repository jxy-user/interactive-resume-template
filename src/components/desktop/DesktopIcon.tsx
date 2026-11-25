"use client";

import { useState, useCallback } from "react";
import type { DesktopIcon, WindowId } from "@/types/desktop";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: DesktopIcon;
  onOpen: (id: WindowId) => void;
  onContextMenu?: (e: React.MouseEvent, icon: DesktopIcon) => void;
  isDragging?: boolean;
}

export function DesktopIcon({ icon, onOpen, onContextMenu, isDragging }: DesktopIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

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
    <div
      className={cn(
        "flex flex-col items-center gap-2 w-[100px] cursor-pointer select-none group relative",
        isSelected && "outline outline-2 outline-primary outline-offset-1",
        isDragging && "opacity-50",
        "transition-all duration-150 hover:scale-105"
      )}
      style={{ left: icon.x, top: icon.y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className={cn("flex flex-col items-center gap-1 p-3 rounded-lg transition-colors group", "bg-white/5")}>
        <div className="text-4xl">{icon.icon}</div>
        <span className={cn("text-xs truncate w-full text-center", isHovered && "font-medium")}>{icon.label}</span>
      </div>
    </div>
  );
}