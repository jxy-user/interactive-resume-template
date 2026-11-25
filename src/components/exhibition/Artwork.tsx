"use client";

import { useId } from "react";

export type ArtworkVariant = "dawn" | "dusk" | "city" | "sea" | "forest" | "moon";

const PALETTES: Record<ArtworkVariant, { a: string; b: string; c: string }> = {
  dawn: { a: "#fff3d4", b: "#fbd79e", c: "#ebae7c" },
  dusk: { a: "#fde7c8", b: "#f2c39a", c: "#d89a72" },
  city: { a: "#ffefd0", b: "#f8d3a6", c: "#c89a6e" },
  sea: { a: "#fff0d6", b: "#fbdaac", c: "#e0a878" },
  forest: { a: "#fcebc8", b: "#f2ce96", c: "#c99a63" },
  moon: { a: "#fbf0d8", b: "#e8cba0", c: "#c89a72" },
};

/**
 * 程序生成的暖色风景插画 —— 动漫黄昏感的渐变天空、暖阳、层叠山野。
 * 纯 SVG，无外部素材，随画框尺寸自适应。
 */
export function Artwork({
  variant = "dawn",
  className,
}: {
  variant?: ArtworkVariant;
  className?: string;
}) {
  const raw = useId();
  const id = raw.replace(/[:]/g, "");
  const p = PALETTES[variant];
  const sky = `sky-${id}`;
  const ground = `ground-${id}`;
  const sun = `sun-${id}`;

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="暖色风景插画"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.a} />
          <stop offset="58%" stopColor={p.b} />
          <stop offset="100%" stopColor={p.c} />
        </linearGradient>
        <linearGradient id={ground} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.c} />
          <stop offset="100%" stopColor="#c89464" />
        </linearGradient>
        <radialGradient id={sun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6e0" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff6e0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${sky})`} />

      {/* 暖阳 / 月 */}
      {(variant === "dawn" || variant === "sea" || variant === "city" || variant === "forest") && (
        <>
          <circle cx={variant === "sea" ? 300 : 118} cy={92} r={72} fill={`url(#${sun})`} />
          <circle cx={variant === "sea" ? 300 : 118} cy={92} r={26} fill="#fff3d6" />
        </>
      )}
      {variant === "moon" && <circle cx="118" cy="92" r="30" fill="#fff6e0" opacity="0.95" />}

      {/* 云 */}
      <g opacity="0.7" fill="#fffdf5">
        <ellipse cx="92" cy="72" rx="46" ry="15" />
        <ellipse cx="130" cy="64" rx="28" ry="11" />
        <ellipse cx="304" cy="124" rx="52" ry="14" />
        <ellipse cx="270" cy="118" rx="26" ry="10" />
      </g>

      {/* 地形 */}
      {variant === "city" ? (
        <g fill="#c89a6e">
          <rect x="28" y="172" width="38" height="128" />
          <rect x="74" y="150" width="30" height="150" />
          <rect x="114" y="186" width="44" height="114" />
          <rect x="176" y="140" width="34" height="160" />
          <rect x="222" y="176" width="40" height="124" />
          <rect x="274" y="158" width="34" height="142" />
          <rect x="318" y="192" width="48" height="108" />
          <g fill="#fff0d0" opacity="0.9">
            <rect x="84" y="166" width="6" height="8" />
            <rect x="94" y="182" width="6" height="8" />
            <rect x="186" y="158" width="6" height="8" />
            <rect x="198" y="176" width="6" height="8" />
            <rect x="232" y="192" width="6" height="8" />
            <rect x="284" y="176" width="6" height="8" />
            <rect x="330" y="208" width="6" height="8" />
            <rect x="342" y="226" width="6" height="8" />
          </g>
        </g>
      ) : (
        <g fill={`url(#${ground})`}>
          <path d="M0 208 Q100 158 200 204 T400 194 V300 H0 Z" />
          <path d="M0 250 Q120 214 240 250 T400 240 V300 H0 Z" opacity="0.82" />
        </g>
      )}

      {/* 海面反光 */}
      {variant === "sea" && (
        <g stroke="#fff3d6" strokeWidth="3" opacity="0.5" strokeLinecap="round">
          <line x1="270" y1="150" x2="330" y2="150" />
          <line x1="282" y1="166" x2="318" y2="166" />
          <line x1="262" y1="182" x2="338" y2="182" />
          <line x1="276" y1="198" x2="324" y2="198" />
        </g>
      )}

      {/* 远处树影 */}
      {(variant === "forest" || variant === "dusk") && (
        <g fill="#c88c5a">
          <path d="M58 232 l18 -62 l18 62 z" />
          <path d="M108 242 l16 -50 l16 50 z" />
          <path d="M300 236 l20 -66 l20 66 z" />
          <rect x="74" y="230" width="4" height="30" />
          <rect x="318" y="234" width="4" height="30" />
        </g>
      )}
    </svg>
  );
}
