"use client";

import { cn } from "@/lib/utils";

export const PAPER_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** 纸纹颗粒覆盖层 */
export function PaperTexture({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply", className)}
      style={{ backgroundImage: PAPER_NOISE, backgroundSize: "180px 180px" }}
    />
  );
}

/** 手绘云 */
export function Cloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 56"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 44c-11 0-16-6-14-13 1-7 8-10 15-8 1-9 9-15 18-13 7 1 11 6 12 12 8-3 17 1 18 10 1 8-6 13-15 13H22Z" />
      <path d="M32 30c3-3 7-3 10 0" opacity="0.55" />
    </svg>
  );
}

/** 手绘弯曲箭头 */
export function DoodleArrow({
  dir = "right",
  className,
}: {
  dir?: "left" | "right" | "down";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={cn(
        "fill-none stroke-current",
        dir === "left" && "-scale-x-100",
        dir === "down" && "rotate-90",
        className
      )}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 16 Q20 8 40 13 T56 15" />
      <path d="M48 8 l9 7 -11 5" />
    </svg>
  );
}

/** 手绘木牌标牌 */
export function SignBoard({
  label,
  className,
  rotate = 0,
}: {
  label: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <div className={cn("relative inline-block", className)} style={{ transform: `rotate(${rotate}deg)` }}>
      <svg
        viewBox="0 0 180 64"
        className="h-full w-full fill-none stroke-pencil"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="6" y="10" width="168" height="44" rx="3" />
        <rect x="11" y="15" width="158" height="34" rx="2" opacity="0.45" />
        <circle cx="17" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="163" cy="17" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-hand text-lg text-pencil">
        {label}
      </span>
    </div>
  );
}

/** 彩色贴纸（技术栈点缀） */
export function Sticker({
  color,
  text,
  className,
}: {
  color: string;
  text: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white/70",
        className
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

/** 手绘门 —— 可点击进入房间 */
export function SketchDoor({
  label,
  onClick,
  className,
  stickers,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  stickers?: { color: string; text: string; className: string }[];
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`进入 ${label}`}
      className={cn("group relative block cursor-pointer bg-transparent p-0", className)}
    >
      <svg
        viewBox="0 0 120 196"
        className="h-full w-full fill-none stroke-pencil transition-transform duration-300 group-hover:-translate-y-1"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="6" y="6" width="108" height="186" rx="2" />
        <rect x="16" y="16" width="88" height="176" rx="1" />
        <line x1="16" y1="56" x2="104" y2="56" opacity="0.35" />
        <circle cx="90" cy="104" r="3.6" fill="currentColor" stroke="none" />
        <path d="M16 128 q26 8 0 16" opacity="0.25" />
      </svg>
      {stickers?.map((s, i) => (
        <Sticker key={i} color={s.color} text={s.text} className={s.className} />
      ))}
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-sm text-pencil/80">
        {label}
      </span>
    </button>
  );
}
