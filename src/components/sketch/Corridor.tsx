"use client";

import { motion } from "framer-motion";
import { SignBoard, PaperTexture } from "./primitives";

export type RoomKey = "corridor" | "gallery" | "studio" | "about" | "contact";

const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

export function Corridor({ onEnter }: { onEnter: (room: RoomKey) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <PaperTexture />
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-label="手绘走廊"
        role="img"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#fff8e8" />
            <stop offset="100%" stopColor="#f3eede" />
          </radialGradient>
        </defs>

        {/* 天花板 */}
        <path d="M0 0 L1440 0 L880 300 L560 300 Z" fill="#faf9f4" stroke="#2b2a26" strokeWidth="2" />
        {/* 左墙 / 右墙 */}
        <path d="M0 0 L560 300 L560 600 L0 900 Z" fill="#f4f2ea" stroke="#2b2a26" strokeWidth="2" />
        <path d="M1440 0 L880 300 L880 600 L1440 900 Z" fill="#f4f2ea" stroke="#2b2a26" strokeWidth="2" />
        {/* 踢脚线 */}
        <line x1="0" y1="884" x2="560" y2="592" stroke="#2b2a26" strokeWidth="1.4" opacity="0.4" />
        <line x1="1440" y1="884" x2="880" y2="592" stroke="#2b2a26" strokeWidth="1.4" opacity="0.4" />

        {/* 地板 */}
        <path d="M0 900 L1440 900 L880 600 L560 600 Z" fill="#efede6" stroke="#2b2a26" strokeWidth="2" />
        <g stroke="#2b2a26" strokeWidth="1.2" opacity="0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const bx = i * 130 + 10;
            const tx = 580 + (bx / 1440) * 280;
            return <line key={i} x1={bx} y1={900} x2={tx} y2={600} />;
          })}
          <line x1="30" y1="772" x2="1410" y2="772" opacity="0.6" />
          <line x1="140" y1="690" x2="1300" y2="690" opacity="0.6" />
          <line x1="280" y1="642" x2="1160" y2="642" opacity="0.6" />
        </g>

        {/* 天花板灯 */}
        <g stroke="#2b2a26" strokeWidth="1.6" opacity="0.7" strokeLinejoin="round">
          <line x1="500" y1="46" x2="700" y2="150" />
          <line x1="940" y1="46" x2="740" y2="150" />
          <rect x="698" y="150" width="44" height="9" fill="#fffdf8" />
        </g>

        {/* 远处墙面 + 光洞（ABOUT） */}
        <path d="M560 300 L880 300 L880 600 L560 600 Z" fill="#fffdf8" stroke="#2b2a26" strokeWidth="2" />
        <g
          className="cursor-pointer"
          onClick={() => onEnter("about")}
          role="button"
          tabIndex={0}
          aria-label="进入关于我"
          onKeyDown={onKeyActivate(() => onEnter("about"))}
        >
          <rect x="596" y="308" width="248" height="284" fill="url(#glow)" stroke="none" opacity="0.6" />
          <rect x="622" y="330" width="196" height="240" fill="url(#glow)" stroke="#2b2a26" strokeWidth="2" />
          <text x="720" y="462" textAnchor="middle" className="font-hand" fontSize="20" fill="#2b2a26">走进</text>
          <text x="720" y="490" textAnchor="middle" className="font-plaque" fontSize="13" fill="#6f6b62">ABOUT</text>
        </g>

        {/* 左门 GALLERY */}
        <g
          className="cursor-pointer"
          onClick={() => onEnter("gallery")}
          role="button"
          tabIndex={0}
          aria-label="进入展廊"
          onKeyDown={onKeyActivate(() => onEnter("gallery"))}
        >
          <path d="M120 242 L308 296 L308 600 L120 668 Z" fill="none" stroke="#2b2a26" strokeWidth="1.3" opacity="0.4" />
          <path d="M128 248 L300 300 L300 596 L128 660 Z" fill="#fbfaf5" stroke="#2b2a26" strokeWidth="2.4" />
          <path d="M146 262 L286 306 L286 584 L146 646 Z" fill="none" stroke="#2b2a26" strokeWidth="1.2" opacity="0.85" />
          <g stroke="#2b2a26" strokeWidth="0.9" opacity="0.28">
            <line x1="150" y1="352" x2="285" y2="362" />
            <line x1="148" y1="424" x2="286" y2="428" />
            <line x1="148" y1="502" x2="286" y2="500" />
            <line x1="148" y1="576" x2="286" y2="566" />
          </g>
          {/* 门缝透光 */}
          <path d="M296 306 L296 590 L289 588 L289 308 Z" fill="#fff6e0" />
          <line x1="292" y1="308" x2="292" y2="588" stroke="#e6cfa2" strokeWidth="1" />
          {/* 把手 */}
          <line x1="278" y1="466" x2="290" y2="470" stroke="#2b2a26" strokeWidth="2.2" />
          <circle cx="278" cy="466" r="3.4" fill="#2b2a26" />
          {/* 贴纸 */}
          <circle cx="206" cy="392" r="13" fill="#61DAFB" />
          <text x="206" y="397" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">R</text>
          <circle cx="240" cy="430" r="13" fill="#339933" />
          <text x="240" y="435" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">N</text>
          <circle cx="196" cy="452" r="13" fill="#3178C6" />
          <text x="196" y="457" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">TS</text>
          <text x="214" y="224" textAnchor="middle" className="font-hand" fontSize="23" fill="#2b2a26">THE GALLERY</text>
        </g>

        {/* 右门 STUDIO */}
        <g
          className="cursor-pointer"
          onClick={() => onEnter("studio")}
          role="button"
          tabIndex={0}
          aria-label="进入工作室"
          onKeyDown={onKeyActivate(() => onEnter("studio"))}
        >
          <path d="M1320 242 L1132 296 L1132 600 L1320 668 Z" fill="none" stroke="#2b2a26" strokeWidth="1.3" opacity="0.4" />
          <path d="M1312 248 L1140 300 L1140 596 L1312 660 Z" fill="#fbfaf5" stroke="#2b2a26" strokeWidth="2.4" />
          <path d="M1294 262 L1154 306 L1154 584 L1294 646 Z" fill="none" stroke="#2b2a26" strokeWidth="1.2" opacity="0.85" />
          <g stroke="#2b2a26" strokeWidth="0.9" opacity="0.28">
            <line x1="1290" y1="352" x2="1155" y2="362" />
            <line x1="1292" y1="424" x2="1154" y2="428" />
            <line x1="1292" y1="502" x2="1154" y2="500" />
            <line x1="1292" y1="576" x2="1154" y2="566" />
          </g>
          {/* 门缝透光（内侧左） */}
          <path d="M1144 306 L1144 590 L1151 588 L1151 308 Z" fill="#fff6e0" />
          <line x1="1148" y1="308" x2="1148" y2="588" stroke="#e6cfa2" strokeWidth="1" />
          {/* 把手 */}
          <line x1="1162" y1="466" x2="1150" y2="470" stroke="#2b2a26" strokeWidth="2.2" />
          <circle cx="1162" cy="466" r="3.4" fill="#2b2a26" />
          {/* 贴纸 */}
          <circle cx="1230" cy="392" r="13" fill="#F7DF1E" />
          <text x="1230" y="397" textAnchor="middle" fontSize="12" fill="#2b2a26" fontWeight="bold">JS</text>
          <circle cx="1254" cy="440" r="13" fill="#264DE4" />
          <text x="1254" y="445" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">CSS</text>
          <text x="1226" y="224" textAnchor="middle" className="font-hand" fontSize="23" fill="#2b2a26">THE STUDIO</text>
        </g>
      </svg>

      {/* 底部 CONTACT 牌 */}
      <button
        onClick={() => onEnter("contact")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-transform hover:-translate-y-0.5 focus-visible:outline-none"
        aria-label="联系我"
      >
        <SignBoard label="CONTACT" className="h-12 w-44" rotate={-2} />
      </button>

      {/* 左上角馆名 */}
      <div className="absolute left-8 top-7 font-hand text-xl text-pencil/80">此人在展</div>
      <div className="absolute right-8 top-7 font-plaque text-[11px] text-graphite">点击门 · 走进展厅</div>

      {/* 移动提示 */}
      <div className="absolute inset-x-0 bottom-24 text-center font-hand text-sm text-graphite md:hidden">
        （建议横屏或电脑浏览，效果更佳）
      </div>
    </motion.div>
  );
}
