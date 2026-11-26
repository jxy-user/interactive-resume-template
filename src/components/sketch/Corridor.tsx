"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PaperTexture } from "./primitives";

export type RoomKey =
  | "corridor"
  | "about"
  | "education"
  | "experience"
  | "studio"
  | "gallery"
  | "contact";

type Kind = "door" | "window" | "frame";

interface WallItem {
  room: RoomKey;
  label: string;
  en: string;
  kind: Kind;
  x: number; // left %
  w: number; // width %
}

// 左墙（由近到远）
const LEFT_ITEMS: WallItem[] = [
  { room: "about", label: "关于", en: "ABOUT", kind: "door", x: 4, w: 15 },
  { room: "education", label: "教育", en: "EDUCATION", kind: "window", x: 22, w: 11 },
  { room: "experience", label: "经历", en: "EXPERIENCE", kind: "frame", x: 34, w: 8 },
];
// 右墙（由近到远）
const RIGHT_ITEMS: WallItem[] = [
  { room: "studio", label: "技能", en: "SKILLS", kind: "door", x: 81, w: 15 },
  { room: "gallery", label: "项目", en: "PROJECTS", kind: "frame", x: 67, w: 11 },
  { room: "contact", label: "联系", en: "CONTACT", kind: "window", x: 58, w: 8 },
];

const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

/** 墙上的门 / 窗 / 画框：黑白线稿，悬停上色，点击进入 */
function WallItemView({
  item,
  onEnter,
}: {
  item: WallItem;
  onEnter: (room: RoomKey, x: number, y: number) => void;
}) {
  const aspect = item.kind === "door" ? "aspect-[11/19]" : item.kind === "window" ? "aspect-[3/4]" : "aspect-[4/3]";
  const enter = () => onEnter(item.room, item.x + item.w / 2, 44);
  return (
    <button
      onClick={enter}
      onKeyDown={onKeyActivate(enter)}
      className="group absolute outline-none"
      style={{ left: `${item.x}%`, top: "44%", width: `${item.w}%`, transform: "translateY(-50%)" }}
      aria-label={`进入${item.label}`}
    >
      <div
        className={`relative w-full ${aspect} overflow-hidden border-2 border-pencil bg-card shadow-[4px_4px_0_rgba(43,42,38,0.12)] transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-pencil`}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 160"
          preserveAspectRatio="none"
          fill="none"
          stroke="#2b2a26"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {item.kind === "door" && (
            <>
              <rect x="8" y="6" width="84" height="150" />
              <rect x="15" y="14" width="70" height="142" />
              <line x1="15" y1="46" x2="85" y2="46" opacity="0.4" />
              <line x1="15" y1="62" x2="85" y2="62" opacity="0.25" />
              <circle cx="74" cy="92" r="3" fill="#2b2a26" />
            </>
          )}
          {item.kind === "window" && (
            <>
              <rect x="8" y="8" width="84" height="146" />
              <rect x="15" y="15" width="70" height="132" opacity="0.6" />
              <line x1="50" y1="8" x2="50" y2="154" />
              <line x1="8" y1="81" x2="92" y2="81" />
            </>
          )}
          {item.kind === "frame" && (
            <>
              <rect x="6" y="6" width="88" height="148" />
              <rect x="14" y="14" width="72" height="132" />
              <path d="M14 118 Q50 78 86 118" opacity="0.5" />
              <circle cx="68" cy="48" r="10" opacity="0.5" />
            </>
          )}
        </svg>

        {/* 上色：悬停时黑白线稿被暖色/彩色晕染 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e8a87c] via-[#e6c98f] to-[#8fb9a8] opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-45 group-focus-visible:opacity-45" />
        <div className="pointer-events-none absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#e07a5f] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* 门牌 */}
        <div className="absolute inset-x-0 bottom-1 text-center">
          <div className="font-plaque text-[9px] leading-none text-graphite">{item.en}</div>
          <div className="font-hand text-sm leading-tight text-pencil">{item.label}</div>
        </div>
      </div>
    </button>
  );
}

/** 盆栽 */
function Plant({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 110"
      className={className}
      style={style}
      fill="none"
      stroke="#2b2a26"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M26 72 L54 72 L50 106 L30 106 Z" fill="#efece3" />
      <path d="M24 72 L56 72" />
      <path d="M40 72 C40 52 30 42 18 36" />
      <path d="M40 72 C40 48 52 38 64 32" />
      <path d="M40 72 C40 56 40 42 40 28" />
      <path d="M18 36 q-9 -7 -2 -15 q9 2 9 13" fill="#8fb9a8" stroke="#2b2a26" />
      <path d="M64 32 q9 -7 2 -15 q-9 2 -9 13" fill="#8fb9a8" stroke="#2b2a26" />
      <path d="M40 28 q-7 -9 5 -13 q6 7 -2 14" fill="#8fb9a8" stroke="#2b2a26" />
    </svg>
  );
}

export function Corridor({ onEnter }: { onEnter: (room: RoomKey) => void }) {
  const [zoom, setZoom] = useState<{ room: RoomKey; x: number; y: number } | null>(null);

  const enter = (room: RoomKey, x: number, y: number) => {
    if (zoom) return;
    setZoom({ room, x, y });
  };

  useEffect(() => {
    if (!zoom) return;
    const t = window.setTimeout(() => onEnter(zoom.room), 720);
    return () => window.clearTimeout(t);
  }, [zoom, onEnter]);

  const svgAnim = zoom
    ? { scale: 6, opacity: 0, transition: { duration: 0.72, ease: "easeIn" as const } }
    : { scale: 1, opacity: 1, transition: { duration: 0.4 } };
  const svgOrigin = zoom ? `${zoom.x}% ${zoom.y}%` : "center center";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <motion.div className="absolute inset-0" style={{ transformOrigin: svgOrigin }} animate={svgAnim}>
        <div className="absolute inset-0 animate-breathe">
        <PaperTexture />

        {/* 无尽走廊背景 */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-label="无尽走廊"
          role="img"
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fff8e8" />
              <stop offset="100%" stopColor="#f3eede" />
            </radialGradient>
          </defs>

          {/* 天花板 + 墙 */}
          <path d="M0 0 L1440 0 L820 320 L620 320 Z" fill="#faf9f4" stroke="#2b2a26" strokeWidth="2" />
          <path d="M0 0 L620 320 L620 580 L0 900 Z" fill="#f4f2ea" stroke="#2b2a26" strokeWidth="2" />
          <path d="M1440 0 L820 320 L820 580 L1440 900 Z" fill="#f4f2ea" stroke="#2b2a26" strokeWidth="2" />
          <line x1="0" y1="884" x2="620" y2="572" stroke="#2b2a26" strokeWidth="1.4" opacity="0.4" />
          <line x1="1440" y1="884" x2="820" y2="572" stroke="#2b2a26" strokeWidth="1.4" opacity="0.4" />

          {/* 地板 */}
          <path d="M0 900 L1440 900 L820 580 L620 580 Z" fill="#efede6" stroke="#2b2a26" strokeWidth="2" />
          <g stroke="#2b2a26" strokeWidth="1.2" opacity="0.5">
            {Array.from({ length: 12 }).map((_, i) => {
              const bx = i * 130 + 10;
              const tx = 640 + (bx / 1440) * 160;
              return <line key={i} x1={bx} y1={900} x2={tx} y2={580} />;
            })}
            <line x1="40" y1="786" x2="1400" y2="786" opacity="0.55" />
            <line x1="160" y1="700" x2="1280" y2="700" opacity="0.55" />
            <line x1="300" y1="640" x2="1140" y2="640" opacity="0.55" />
          </g>

          {/* 天花板灯 */}
          <g stroke="#2b2a26" strokeWidth="1.6" opacity="0.7" strokeLinejoin="round">
            <line x1="540" y1="52" x2="706" y2="168" />
            <line x1="900" y1="52" x2="734" y2="168" />
            <rect x="704" y="168" width="32" height="8" fill="#fffdf8" />
          </g>

          {/* 尽头的光 —— 走不到头，只有光 */}
          <rect x="656" y="360" width="128" height="170" fill="url(#glow)" stroke="#2b2a26" strokeWidth="1.4" />
        </svg>

        {/* 墙上的门 / 窗 / 画框 */}
        {LEFT_ITEMS.map((it) => (
          <WallItemView key={it.room} item={it} onEnter={enter} />
        ))}
        {RIGHT_ITEMS.map((it) => (
          <WallItemView key={it.room} item={it} onEnter={enter} />
        ))}

        {/* 盆栽 */}
        <Plant className="pointer-events-none absolute bottom-[6%] left-[2%] h-[26%] animate-sway" />
        <Plant className="pointer-events-none absolute bottom-[8%] right-[2%] h-[22%] animate-sway" style={{ animationDelay: "1.6s" }} />
        <Plant className="pointer-events-none absolute bottom-[24%] left-[40%] h-[14%] opacity-80" />
        </div>
      </motion.div>

      {/* 覆盖文字 */}
      <motion.div animate={{ opacity: zoom ? 0 : 1 }} transition={{ duration: 0.3 }} className="pointer-events-none">
        <div className="absolute left-8 top-7 font-hand text-xl text-pencil/80 bg-background/75 px-2 py-0.5">此人在展</div>
        <div className="absolute left-8 bottom-7 font-plaque text-[11px] text-graphite">走近门 · 窗 · 画框，推开是另一个世界</div>
        <div className="absolute right-6 top-16 flex flex-col gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-pencil bg-card font-hand text-base text-pencil">≡</span>
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-pencil bg-card font-hand text-base text-pencil">?</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
