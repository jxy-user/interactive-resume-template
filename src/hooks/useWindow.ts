"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { WindowId } from "@/types/desktop";
import { defaultWindowConfigs } from "@/lib/windowConfigs";
import {
  closeWindowState,
  createInitialWindowStates,
  openWindowState,
  type WindowStates,
} from "@/lib/windowState";

interface UseWindowReturn {
  windows: WindowStates;
  activeWindow: WindowId | null;
  openWindow: (id: WindowId) => void;
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

let zIndexCounter = 100;

export function useWindow(): UseWindowReturn {
  const [windows, setWindows] = useState<WindowStates>(() =>
    createInitialWindowStates(defaultWindowConfigs)
  );
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const dragRef = useRef<{
    id: WindowId;
    startX: number;
    startY: number;
    startWindowX: number;
    startWindowY: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: WindowId;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: string;
  } | null>(null);

  const getNextZIndex = useCallback(() => ++zIndexCounter, []);

  const openWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => openWindowState(prev, id, getNextZIndex()));
      setActiveWindow(id);
    },
    [getNextZIndex]
  );

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => closeWindowState(prev, id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true, isActive: false },
    }));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const maximizeWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => {
        const win = prev[id];
        if (win.isMaximized) {
          return {
            ...prev,
            [id]: { ...win, isMaximized: false, isActive: true, zIndex: getNextZIndex() },
          };
        }
        return {
          ...prev,
          [id]: { ...win, isMaximized: true, isActive: true, zIndex: getNextZIndex() },
        };
      });
      setActiveWindow(id);
    },
    [getNextZIndex]
  );

  const restoreWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: false,
          isMaximized: false,
          isActive: true,
          zIndex: getNextZIndex(),
        },
      }));
      setActiveWindow(id);
    },
    [getNextZIndex]
  );

  const setWindowPosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }));
  }, []);

  const setWindowSize = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], width, height } }));
  }, []);

  const bringToFront = useCallback(
    (id: WindowId) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], zIndex: getNextZIndex(), isActive: true },
      }));
      setActiveWindow(id);
    },
    [getNextZIndex]
  );

  const startDrag = useCallback(
    (id: WindowId, e: React.MouseEvent) => {
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
    },
    [windows, bringToFront]
  );

  const startResize = useCallback(
    (id: WindowId, e: React.MouseEvent, direction: string) => {
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
    },
    [windows, bringToFront]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const { id, startX, startY, startWindowX, startWindowY } = dragRef.current;
        setWindowPosition(id, startWindowX + (e.clientX - startX), startWindowY + (e.clientY - startY));
      }

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

        const win = windows[id];
        if (direction.includes("w")) {
          setWindowPosition(id, win.x + (startWidth - newWidth), win.y);
        }
        if (direction.includes("n")) {
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
