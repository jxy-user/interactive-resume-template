"use client";

import { useEffect, useState } from "react";
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

interface Item {
  room: RoomKey;
  label: string;
  en: string;
  kind: Kind;
  depth: number;
  side: "left" | "right";
}

const W = 1000; // 走廊宽
const H = 620; // 走廊高
const D = 2600; // 走廊深
const BASE_Z = -200; // 相机后退量（把整个世界推到相机前方）

const ITEMS: Item[] = [
  { room: "about", label: "关于", en: "ABOUT", kind: "door", depth: 500, side: "left" },
  { room: "education", label: "教育", en: "EDUCATION", kind: "window", depth: 1000, side: "left" },
  { room: "experience", label: "经历", en: "EXPERIENCE", kind: "frame", depth: 1500, side: "left" },
  { room: "studio", label: "技能", en: "SKILLS", kind: "door", depth: 500, side: "right" },
  { room: "gallery", label: "项目", en: "PROJECTS", kind: "frame", depth: 1000, side: "right" },
  { room: "contact", label: "联系", en: "CONTACT", kind: "window", depth: 1500, side: "right" },
];

const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

/** 墙上的门 / 窗 / 画框（独立 3D 平面，朝走廊内侧） */
function WallPanel({ item, onEnter }: { item: Item; onEnter: (room: RoomKey) => void }) {
  const pw = item.kind === "door" ? 210 : item.kind === "window" ? 180 : 220;
  const ph = item.kind === "door" ? 360 : item.kind === "window" ? 220 : 176;
  const x = item.side === "left" ? -(W / 2 - 90) : W / 2 - 90;
  const enter = () => onEnter(item.room);
  return (
    <button
      onClick={enter}
      onKeyDown={onKeyActivate(enter)}
      aria-label={`进入${item.label}`}
      className="group absolute left-1/2 top-1/2 outline-none"
      style={{
        width: pw,
        height: ph,
        transform: `translate(-50%,-50%) translate3d(${x}px, 0px, ${-item.depth}px) rotateY(${item.side === "left" ? 24 : -24}deg)`,
      }}
    >
      <div className="relative h-full w-full overflow-hidden border-2 border-pencil bg-card shadow-[0_30px_50px_-20px_rgba(43,42,38,0.55),0_0_0_5px_rgba(255,253,248,0.55)] transition-transform duration-300 group-hover:scale-[1.05]">
        <svg viewBox="0 0 100 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none" stroke="#2b2a26" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e8a87c] via-[#e6c98f] to-[#8fb9a8] opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-50 group-focus-visible:opacity-50" />
        <div className="absolute inset-x-0 bottom-1 text-center">
          <div className="font-plaque text-[9px] leading-none text-graphite">{item.en}</div>
          <div className="font-hand text-sm leading-tight text-pencil">{item.label}</div>
        </div>
      </div>
    </button>
  );
}

function Plant({ side, depth, delay = "0s" }: { side: "left" | "right"; depth: number; delay?: string }) {
  const x = side === "left" ? -(W / 2 - 70) : W / 2 - 70;
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 animate-sway"
      style={{
        width: 130,
        height: 200,
        transform: `translate(-50%,-50%) translate3d(${x}px, ${H / 2 - 100}px, ${-depth}px)`,
        animationDelay: delay,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 110" className="h-full w-full" fill="none" stroke="#2b2a26" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 72 L54 72 L50 106 L30 106 Z" fill="#efece3" />
        <path d="M24 72 L56 72" />
        <path d="M40 72 C40 52 30 42 18 36" />
        <path d="M40 72 C40 48 52 38 64 32" />
        <path d="M40 72 C40 56 40 42 40 28" />
        <path d="M18 36 q-9 -7 -2 -15 q9 2 9 13" fill="#8fb9a8" />
        <path d="M64 32 q9 -7 2 -15 q-9 2 -9 13" fill="#8fb9a8" />
        <path d="M40 28 q-7 -9 5 -13 q6 7 -2 14" fill="#8fb9a8" />
      </svg>
    </div>
  );
}

export function Corridor({ onEnter }: { onEnter: (room: RoomKey) => void }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [worldZ, setWorldZ] = useState(BASE_Z);
  const [pending, setPending] = useState<RoomKey | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const go = (room: RoomKey) => {
    if (pending) return;
    setPending(room);
    setWorldZ(BASE_Z + 2350);
    window.setTimeout(() => onEnter(room), 720);
  };

  const rotX = (-mouse.y * 3).toFixed(2);
  const rotY = (mouse.x * 5).toFixed(2);

  const plane = (w: number, h: number, t: string, bg: string): React.CSSProperties => ({
    width: w,
    height: h,
    left: "50%",
    top: "50%",
    transform: `translate(-50%,-50%) ${t}`,
    background: bg,
    border: "2px solid #2b2a26",
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background" style={{ perspective: 900 }}>
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${worldZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* 地板 */}
        <div
          className="absolute"
          style={plane(
            W,
            D,
            `translateY(${H / 2}px) rotateX(90deg)`,
            "repeating-linear-gradient(90deg,#efece3 0px,#efece3 78px,#e2ddd0 78px,#e2ddd0 80px), linear-gradient(180deg, rgba(43,42,38,0.12) 0%, rgba(43,42,38,0.02) 40%, rgba(43,42,38,0) 70%)"
          )}
        />
        {/* 天花板 */}
        <div className="absolute" style={plane(W, D, `translateY(${-H / 2}px) rotateX(-90deg)`, "#faf9f4")} />
        {/* 左墙 */}
        <div
          className="absolute"
          style={plane(D, H, `translateX(${-W / 2}px) rotateY(90deg)`, "linear-gradient(180deg,#fdfcf7 0%,#f3f0e7 55%,#ded9cc 100%)")}
        />
        {/* 右墙 */}
        <div
          className="absolute"
          style={plane(D, H, `translateX(${W / 2}px) rotateY(-90deg)`, "linear-gradient(180deg,#fdfcf7 0%,#f3f0e7 55%,#ded9cc 100%)")}
        />
        {/* 后墙 + 尽头光 */}
        <div className="absolute" style={plane(W, H, `translateZ(${-D}px)`, "radial-gradient(circle at 50% 48%,#fffaf0 0%,#fdf3d9 16%,#f4edda 50%,#e2dccb 100%)")}>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 150,
              height: 210,
              background: "radial-gradient(circle,#ffffff 0%,#fff3d6 62%,#f3eede 100%)",
              border: "2px solid #2b2a26",
            }}
            aria-hidden="true"
          />
        </div>

        {/* 独立门 / 窗 / 画框 */}
        {ITEMS.map((it) => (
          <WallPanel key={it.room} item={it} onEnter={go} />
        ))}

        {/* 盆栽 */}
        <Plant side="left" depth={300} delay="0s" />
        <Plant side="right" depth={700} delay="1.4s" />
        <Plant side="left" depth={1200} delay="2.6s" />
      </div>

      <PaperTexture />
      <div className="pointer-events-none absolute inset-0" style={{ opacity: pending ? 0 : 1, transition: "opacity 0.3s" }}>
        <div className="absolute left-8 top-7 font-hand text-xl text-pencil/80 bg-background/75 px-2 py-0.5">此人在展</div>
        <div className="absolute left-8 bottom-7 font-plaque text-[11px] text-graphite">移动鼠标环顾 · 走近门 / 窗 / 画框，推开是另一个世界</div>
        <div className="absolute right-6 top-16 flex flex-col gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-pencil bg-card font-hand text-base text-pencil">≡</span>
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-pencil bg-card font-hand text-base text-pencil">?</span>
        </div>
      </div>
    </div>
  );
}
