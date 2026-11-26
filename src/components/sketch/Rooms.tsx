"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Globe, Code2 } from "lucide-react";
import { resume } from "@/lib/resumeData";
import { PaperTexture, Cloud, DoodleArrow, SignBoard } from "./primitives";
import type { RoomKey } from "./Corridor";
import type { ProjectItem } from "@/types/resume";

/** 黑白墨稿画作（程序生成、确定性、6 种图案变体） */
function InkArt({ seed = 0, className }: { seed?: number; className?: string }) {
  const type = seed % 6;
  const stroke = { fill: "none", stroke: "#2b2a26", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden="true">
      <rect width="300" height="220" fill="#f7f5ef" />
      <g {...stroke}>
        {type === 0 &&
          Array.from({ length: 7 }).map((_, k) => (
            <circle key={k} cx={150} cy={110} r={18 + k * 15} opacity={0.5 - k * 0.05} />
          ))}
        {type === 0 &&
          Array.from({ length: 14 }).map((_, k) => {
            const a = (k / 14) * Math.PI * 2;
            return <line key={k} x1={150} y1={110} x2={150 + Math.cos(a) * 118} y2={110 + Math.sin(a) * 118} opacity={0.12} />;
          })}

        {type === 1 &&
          Array.from({ length: 5 }).map((_, k) => (
            <path key={k} d={`M0 ${150 + k * 10} Q75 ${108 + k * 8 + (seed % 3) * 4} 150 ${150 + k * 10} T300 ${150 + k * 10}`} opacity={0.55 - k * 0.08} />
          ))}
        {type === 1 && <circle cx="222" cy="58" r="22" opacity="0.5" />}

        {type === 2 && (
          <g opacity="0.42">
            {Array.from({ length: 8 }).map((_, k) => {
              const h = 70 + ((k * 7 + seed) % 5) * 22;
              return <rect key={k} x={16 + k * 34} y={190 - h} width="22" height={h} />;
            })}
          </g>
        )}
        {type === 2 && <line x1="0" y1="192" x2="300" y2="192" opacity="0.35" />}

        {type === 3 &&
          Array.from({ length: 9 }).map((_, k) => (
            <ellipse key={k} cx={150} cy={110} rx={18 + k * 12} ry={13 + k * 8} transform={`rotate(${k * 20} 150 110)`} opacity={0.4 - k * 0.03} />
          ))}

        {type === 4 &&
          Array.from({ length: 12 }).map((_, k) => {
            const a = (k / 12) * Math.PI * 2;
            const cx = 150 + Math.cos(a) * 42;
            const cy = 110 + Math.sin(a) * 42;
            return <ellipse key={k} cx={cx} cy={cy} rx="26" ry="12" transform={`rotate(${k * 30} ${cx} ${cy})`} opacity={0.3} />;
          })}
        {type === 4 && <circle cx="150" cy="110" r="18" opacity="0.55" />}

        {type === 5 && (
          <g fill="#2b2a26" stroke="none">
            {Array.from({ length: 64 }).map((_, k) => {
              const x = (k * 53 + seed * 17) % 300;
              const y = (k * 97 + seed * 29) % 220;
              const r = 1 + ((k * 7) % 3);
              return <circle key={k} cx={x} cy={y} r={r} opacity={0.18 + (k % 4) * 0.1} />;
            })}
          </g>
        )}
        {type === 5 &&
          Array.from({ length: 6 }).map((_, k) => (
            <line key={k} x1={(k * 61) % 300} y1={(k * 43) % 220} x2={((k * 61) % 300) + 34} y2={(k * 43) % 220} opacity={0.16} />
          ))}
      </g>
    </svg>
  );
}

function RoomShell({ title, en, onBack, children }: { title: string; en: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative min-h-screen overflow-y-auto bg-background px-6 py-16 md:px-16"
    >
      <PaperTexture />
      <button
        onClick={onBack}
        className="fixed left-6 top-6 z-20 inline-flex items-center gap-2 font-hand text-pencil/70 transition-colors hover:text-pencil"
      >
        <ArrowLeft size={16} strokeWidth={1.8} /> 返回走廊
      </button>

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <div className="font-plaque text-xs text-graphite">{en}</div>
          <h1 className="font-hand mt-2 text-5xl text-pencil">{title}</h1>
          <div className="mx-auto mt-4 h-px w-16 bg-pencil/30" />
        </header>
        {children}
      </div>
    </motion.div>
  );
}

/* ---------- Gallery：项目馆 ---------- */
export function GalleryRoom({ onBack }: { onBack: () => void }) {
  const projects = resume.projects ?? [];
  return (
    <RoomShell title="展廊" en="THE GALLERY · SELECTED WORKS" onBack={onBack}>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p: ProjectItem, i) => (
          <figure
            key={i}
            className="group border-2 border-pencil bg-card p-2 shadow-[6px_6px_0_rgba(43,42,38,0.12)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative overflow-hidden border border-pencil/40">
              <InkArt seed={i + 1} className="aspect-[4/3] w-full" />
              {/* 悬停上色 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#e8a87c]/45 via-[#e6c98f]/30 to-[#c9a0d8]/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <figcaption className="px-1 py-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-hand text-xl text-pencil">{p.name}</h3>
                <span className="font-plaque text-[11px] text-graphite">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-graphite">{p.description}</p>
              {p.technologies && (
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-plaque text-[10px] text-graphite">
                  {p.technologies.map((t) => (
                    <span key={t} className="rounded-sm border border-pencil/25 px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-4 text-sm">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pencil underline-offset-4 hover:underline">
                    代码 <ArrowUpRight size={13} />
                  </a>
                )}
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pencil underline-offset-4 hover:underline">
                    预览 <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </RoomShell>
  );
}

/* ---------- Studio：技能工作室 ---------- */
export function StudioRoom({ onBack }: { onBack: () => void }) {
  const skills = resume.about.skills ?? [];
  return (
    <RoomShell title="工作室" en="THE STUDIO · TOOLS & CRAFT" onBack={onBack}>
      <div className="grid gap-8 md:grid-cols-3">
        {skills.map((cat) => (
          <div key={cat.category} className="border-2 border-pencil bg-card p-5 shadow-[6px_6px_0_rgba(43,42,38,0.12)]">
            <h3 className="font-hand text-2xl text-pencil">{cat.category}</h3>
            <ul className="mt-3 border-t border-pencil/25">
              {cat.items.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3 border-b border-pencil/15 py-2">
                  <span className="font-hand text-pencil/85">{s.name}</span>
                  {s.level !== undefined && (
                    <span className="font-plaque text-[11px] text-graphite tabular-nums">{s.level}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </RoomShell>
  );
}

/* ---------- About：关于 ---------- */
function SketchPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" className={className} fill="none" stroke="#2b2a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* 头发 */}
      <path d="M38 44 q-4 -30 22 -32 q26 2 22 32 q-3 -12 -22 -14 q-19 2 -22 14 Z" fill="#2b2a26" stroke="#2b2a26" />
      {/* 脸 */}
      <circle cx="60" cy="44" r="20" />
      {/* 眼 */}
      <line x1="52" y1="42" x2="56" y2="42" />
      <line x1="64" y1="42" x2="68" y2="42" />
      {/* 嘴 */}
      <path d="M54 52 q6 5 12 0" />
      {/* 围巾 */}
      <path d="M42 64 q18 12 36 0 l4 10 q-22 12 -44 0 Z" fill="#e07a5f" stroke="#2b2a26" />
      <path d="M80 74 q8 14 4 30 l-8 -4 q2 -14 -2 -22 Z" fill="#e07a5f" stroke="#2b2a26" />
      <line x1="46" y1="70" x2="74" y2="70" stroke="#2b2a26" strokeWidth="1" opacity="0.4" />
      {/* 大衣 */}
      <path d="M32 92 q28 -16 56 0 l10 72 q-38 16 -76 0 Z" fill="#fffdf8" />
      <path d="M44 92 l16 16 l-6 40 M76 92 l-16 16 l6 40" strokeWidth="1.4" opacity="0.75" />
      <circle cx="60" cy="130" r="1.8" fill="#2b2a26" />
      <circle cx="60" cy="150" r="1.8" fill="#2b2a26" />
      {/* 手 */}
      <path d="M30 128 q-10 8 -6 20" />
      <path d="M90 128 q10 8 6 20" />
      {/* 腿 */}
      <path d="M38 176 l-4 48 M82 176 l4 48" />
    </svg>
  );
}

export function AboutRoom({ onBack }: { onBack: () => void }) {
  const { meta, about, experience = [], education = [] } = resume;
  return (
    <RoomShell title="关于我" en="ABOUT · THE PERSON" onBack={onBack}>
      <div className="grid gap-10 md:grid-cols-[220px_1fr] md:items-start">
        <div className="mx-auto w-[180px] border-2 border-pencil bg-card p-3 shadow-[6px_6px_0_rgba(43,42,38,0.12)]">
          <SketchPerson className="aspect-[120/240] w-full" />
          <p className="font-hand mt-2 text-center text-sm text-graphite">{meta.name}</p>
        </div>
        <div>
          <p className="font-hand text-xl leading-relaxed text-pencil/85">{about.summary}</p>
          {about.highlights && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {about.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-graphite">
                  <span className="text-pencil">—</span>
                  <span className="font-hand">{h}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-hand mb-3 text-2xl text-pencil">经历</h3>
              <ul className="space-y-3">
                {experience.map((e, i) => (
                  <li key={i} className="border-l-2 border-pencil/30 pl-3">
                    <div className="font-plaque text-[11px] text-graphite">{e.startDate} – {e.endDate ?? "至今"}</div>
                    <div className="font-hand text-pencil">{e.company}</div>
                    <div className="text-sm text-graphite">{e.position}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-hand mb-3 text-2xl text-pencil">教育</h3>
              <ul className="space-y-3">
                {education.map((e, i) => (
                  <li key={i} className="border-l-2 border-pencil/30 pl-3">
                    <div className="font-plaque text-[11px] text-graphite">{e.startDate} – {e.endDate}</div>
                    <div className="font-hand text-pencil">{e.school}</div>
                    <div className="text-sm text-graphite">{e.degree} · {e.major}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}

/* ---------- Contact：海边栈道 ---------- */
export function ContactRoom({ onBack }: { onBack: () => void }) {
  const { meta } = resume;
  const links = [
    meta.email && { label: "MAIL", value: meta.email, href: `mailto:${meta.email}`, icon: Mail },
    meta.github && { label: "CODE", value: `github.com/${meta.github}`, href: `https://github.com/${meta.github}`, icon: Code2 },
    meta.website && { label: "SITE", value: meta.website.replace(/^https?:\/\//, ""), href: meta.website, icon: Globe },
    meta.location && { label: "BASE", value: meta.location, href: undefined, icon: MapPin },
  ].filter(Boolean) as { label: string; value: string; href?: string; icon: typeof Mail }[];

  return (
    <RoomShell title="联系" en="CONTACT · BY THE SEA" onBack={onBack}>
      <div className="relative mx-auto max-w-3xl">
        <div className="pointer-events-none absolute inset-0 -top-10 overflow-hidden">
          <Cloud className="absolute right-6 top-0 h-12 w-24 text-pencil/30" />
          <Cloud className="absolute left-10 top-8 h-10 w-20 text-pencil/25" />
        </div>
        <div className="relative grid gap-4 sm:grid-cols-2">
          {links.map((l) => {
            const Icon = l.icon;
            const inner = (
              <div className="flex items-center gap-3">
                <Icon size={20} strokeWidth={1.6} className="shrink-0 text-pencil" />
                <div className="min-w-0">
                  <div className="font-plaque text-[10px] text-graphite">{l.label}</div>
                  <div className="font-hand truncate text-lg text-pencil">{l.value}</div>
                </div>
              </div>
            );
            return l.href ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="border-2 border-pencil bg-card p-4 shadow-[6px_6px_0_rgba(43,42,38,0.12)] transition-transform hover:-translate-y-0.5">
                {inner}
              </a>
            ) : (
              <div key={l.label} className="border-2 border-pencil bg-card p-4 shadow-[6px_6px_0_rgba(43,42,38,0.12)]">{inner}</div>
            );
          })}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <DoodleArrow dir="left" className="h-6 w-12 text-pencil/40" />
          <a href={`mailto:${meta.email}`} aria-label="写封信给我">
            <SignBoard label="写封信给我" className="h-12 w-44" rotate={-1} />
          </a>
          <DoodleArrow dir="right" className="h-6 w-12 text-pencil/40" />
        </div>
      </div>
    </RoomShell>
  );
}
