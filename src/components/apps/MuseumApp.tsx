"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// 动态导入 MuseumScene (禁用 SSR)
const MuseumScene = dynamic(
  () => import("@/components/museum/MuseumScene").then((mod) => mod.MuseumScene),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center text-white">加载数字展厅...</div> }
);

export function MuseumApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 防止 Three.js 画布冒泡事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContextMenu = (e: MouseEvent) => e.stopPropagation();
    const handleClick = (e: MouseEvent) => e.stopPropagation();
    const handleWheel = (e: WheelEvent) => e.stopPropagation();

    container.addEventListener("contextmenu", handleContextMenu);
    container.addEventListener("click", handleClick);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("contextmenu", handleContextMenu);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ touchAction: "none" }}
    >
      <MuseumScene />
    </div>
  );
}