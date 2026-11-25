"use client";

import { useState, useCallback } from "react";
import type { DesktopIcon as DesktopIconType, WindowId } from "@/types/desktop";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: DesktopIconType;
  onOpen: (id: WindowId) => void;
  onContextMenu?: (e: React.MouseEvent, icon: DesktopIconType) => void;
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
    <button
      type="button"
      aria-label={`打开${icon.label}`}
      className={cn(
        "flex flex-col items-center gap-2 w-full max-w-[100px] cursor-pointer select-none group rounded-lg bg-transparent border-0 p-0 text-inherit",
        isSelected && "outline outline-2 outline-primary outline-offset-1",
        isDragging && "opacity-50",
        "transition-all duration-150 hover:scale-105"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <span className={cn("flex flex-col items-center gap-1 p-3 rounded-lg transition-colors group", "bg-white/5")}>
        <span className="text-4xl" aria-hidden="true">{icon.icon}</span>
        <span className={cn("text-xs truncate w-full text-center", isHovered && "font-medium")}>{icon.label}</span>
      </span>
    </button>
  );
}
