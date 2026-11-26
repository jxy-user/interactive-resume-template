"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Globe, Code2 } from "lucide-react";
import { resume } from "@/lib/resumeData";
import { PaperTexture, DoodleArrow, SignBoard } from "./primitives";
import type { RoomKey } from "./Corridor";
import type { ProjectItem, SkillCategory } from "@/types/resume";

/** 黑白墨稿画作 —— 程序生成的密集线稿，接近版画 / 素描艺术画 */
function InkArt({ seed = 0, className }: { seed?: number; className?: string }) {
  const rand = (i: number) => {
    const x = Math.sin(seed * 97 + i * 13.7) * 10000;
    return x - Math.floor(x);
  };
  const ellipses = Array.from({ length: 11 }).map((_, k) => {
    const cx = 50 + rand(k) * 200;
    const cy = 40 + rand(k + 50) * 140;
    const rx = 14 + rand(k + 100) * 74;
    const ry = 10 + rand(k + 150) * 54;
    const rot = rand(k + 200) * 180;
    return (
      <ellipse
        key={`e${k}`}
        cx={cx.toFixed(1)}
        cy={cy.toFixed(1)}
        rx={rx.toFixed(1)}
        ry={ry.toFixed(1)}
        transform={`rotate(${rot.toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
        opacity={(0.2 + (k % 4) * 0.12).toFixed(2)}
      />
    );
  });
  const curves = Array.from({ length: 14 }).map((_, k) => {
    const x1 = rand(k + 300) * 300;
    const y1 = rand(k + 350) * 220;
    const x2 = rand(k + 400) * 300;
    const y2 = rand(k + 450) * 220;
    const cx = rand(k + 500) * 300;
    const cy = rand(k + 550) * 220;
    return (
      <path
        key={`p${k}`}
        d={`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`}
        opacity={(0.18 + (k % 3) * 0.12).toFixed(2)}
      />
    );
  });
  const dots = Array.from({ length: 46 }).map((_, k) => (
    <circle
      key={`d${k}`}
      cx={(rand(k + 600) * 300).toFixed(1)}
      cy={(rand(k + 650) * 220).toFixed(1)}
      r={(0.7 + rand(k + 700) * 1.7).toFixed(1)}
      fill="#2b2a26"
      stroke="none"
      opacity={(0.25 + rand(k + 750) * 0.45).toFixed(2)}
    />
  ));
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden="true">
      <rect width="300" height="220" fill="#f7f5ef" />
      <g fill="none" stroke="#2b2a26" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {ellipses}
        {curves}
        {dots}
      </g>
    </svg>
  );
}

function RoomShell({
  title,
  en,
  onBack,
  children,
}: {
  title: string;
  en: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
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

/* ---------- Gallery：挂绳悬空画 + 详情卡 ---------- */
export function GalleryRoom({ onBack }: { onBack: () => void }) {
  const projects = resume.projects ?? [];
  const [sel, setSel] = useState<ProjectItem | null>(null);
  return (
    <RoomShell title="展廊" en="THE GALLERY · SELECTED WORKS" onBack={onBack}>
      <div className="relative">
        {/* 天空 + 云 + 城市轮廓 + 纸飞机 */}
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-40">
          <svg viewBox="0 0 900 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#2b2a26" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <g opacity="0.45">
              <path d="M150 54 q-22 0 -20 -15 q2 -13 18 -13 q5 -15 24 -13 q15 2 17 13 q15 -2 17 11 q2 13 -15 17 Z" />
              <path d="M660 44 q-18 0 -16 -13 q2 -11 15 -11 q4 -13 21 -11 q13 2 15 11 q13 -2 15 9 q2 11 -13 15 Z" />
            </g>
            <path d="M0 150 L60 150 L60 118 L96 118 L96 150 L150 150 L150 104 L188 104 L188 150 L250 150 L250 128 L286 128 L286 150 L360 150 L360 112 L398 112 L398 150 L470 150 L470 132 L510 132 L510 150 L580 150 L580 106 L618 106 L618 150 L700 150 L700 124 L738 124 L738 150 L820 150 L820 114 L858 114 L858 150 L900 150" opacity="0.3" />
            <path d="M792 30 L842 14 L822 42 L816 30 Z M816 30 L842 14" opacity="0.5" />
          </svg>
        </div>

        {/* 挂绳 */}
        <div className="pointer-events-none absolute inset-x-10 top-12">
          <svg viewBox="0 0 1000 40" className="w-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 8 Q500 42 1000 8" fill="none" stroke="#2b2a26" strokeWidth="1.6" opacity="0.45" />
          </svg>
        </div>

        {/* 挂画 */}
        <div className="relative grid gap-x-6 gap-y-12 pt-24 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.button
              key={i}
              onClick={() => setSel(p)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative block text-left"
              style={{ marginTop: (i % 2) * 26 }}
            >
              <span className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-pencil/40" aria-hidden="true" />
              <figure className="border-2 border-pencil bg-card p-2 shadow-[6px_6px_0_rgba(43,42,38,0.12)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative overflow-hidden border border-pencil/40">
                  <InkArt seed={i + 1} className="aspect-[4/3] w-full" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#e8a87c]/45 via-[#e6c98f]/30 to-[#c9a0d8]/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <figcaption className="px-1 py-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-hand text-lg text-pencil">{p.name}</h3>
                    <span className="font-plaque text-[11px] text-graphite">VIEW</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 font-plaque text-[10px] text-graphite">
                    {p.technologies?.slice(0, 3).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </figcaption>
              </figure>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 详情卡 */}
      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-pencil/30 p-6 backdrop-blur-sm"
            onClick={() => setSel(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="relative w-full max-w-lg border-2 border-pencil bg-card p-6 shadow-[8px_8px_0_rgba(43,42,38,0.18)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSel(null)}
                aria-label="关闭"
                className="absolute right-3 top-2 font-hand text-2xl text-graphite hover:text-pencil"
              >
                ×
              </button>
              <div className="font-plaque text-[10px] text-graphite">PROJECT</div>
              <h3 className="font-hand text-3xl text-pencil">{sel.name}</h3>
              <p className="mt-3 leading-relaxed text-graphite">{sel.description}</p>
              {sel.technologies && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {sel.technologies.map((t) => (
                    <span key={t} className="border border-pencil/30 px-2 py-0.5 font-plaque text-[11px] text-graphite">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {sel.url && (
                  <a href={sel.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border-2 border-pencil px-4 py-2 font-hand text-pencil transition-colors hover:bg-pencil hover:text-paper">
                    OPEN LINK <ArrowUpRight size={14} />
                  </a>
                )}
                {sel.github && (
                  <a href={sel.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-hand text-graphite underline underline-offset-4 hover:text-pencil">
                    代码 <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RoomShell>
  );
}

/* ---------- Studio：悬浮画布 + 详情卡 ---------- */
export function StudioRoom({ onBack }: { onBack: () => void }) {
  const skills = resume.about.skills ?? [];
  const [sel, setSel] = useState<SkillCategory | null>(null);
  return (
    <RoomShell title="工作室" en="THE STUDIO · TOOLS & CRAFT" onBack={onBack}>
      <div className="relative min-h-[60vh]">
        {/* 柔光 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 38%, #fff8e8 0%, transparent 62%)" }}
          aria-hidden="true"
        />

        {/* 悬浮画布 */}
        <div className="relative flex flex-wrap items-start justify-center gap-12 px-2 py-8">
          {skills.map((cat, i) => (
            <motion.button
              key={cat.category}
              onClick={() => setSel(cat)}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
              className="group relative block"
              style={{ marginTop: (i % 2) * 34 }}
              aria-label={`查看${cat.category}`}
            >
              <div className="border-2 border-pencil bg-card p-3 shadow-[8px_8px_0_rgba(43,42,38,0.12)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative overflow-hidden border border-pencil/40">
                  <InkArt seed={i + 10} className="aspect-[3/4] w-44" />
                </div>
                <div className="mt-2 text-center">
                  <div className="font-plaque text-[10px] text-graphite">COLLECTION</div>
                  <div className="font-hand text-xl text-pencil">{cat.category}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 详情卡 */}
      <AnimatePresence>
        {sel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-pencil/30 p-6 backdrop-blur-sm"
            onClick={() => setSel(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="relative w-full max-w-md border-2 border-pencil bg-card p-6 shadow-[8px_8px_0_rgba(43,42,38,0.18)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSel(null)}
                aria-label="关闭"
                className="absolute right-3 top-2 font-hand text-2xl text-graphite hover:text-pencil"
              >
                ×
              </button>
              <div className="font-plaque text-[10px] text-graphite">COLLECTION</div>
              <h3 className="font-hand text-3xl text-pencil">{sel.category}</h3>
              <ul className="mt-4 space-y-2.5">
                {sel.items.map((s) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-hand text-pencil/85">{s.name}</span>
                      {s.level !== undefined && (
                        <span className="font-plaque text-[11px] text-graphite tabular-nums">{s.level}</span>
                      )}
                    </div>
                    {s.level !== undefined && (
                      <div className="mt-1 h-1.5 w-full border border-pencil/30">
                        <div className="h-full bg-pencil/70" style={{ width: `${s.level}%` }} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  onClick={() => setSel(null)}
                  className="inline-flex items-center gap-1.5 border-2 border-pencil px-4 py-2 font-hand text-pencil transition-colors hover:bg-pencil hover:text-paper"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RoomShell>
  );
}

/* ---------- About：关于 ---------- */
function SketchPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" className={className} fill="none" stroke="#2b2a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M38 44 q-4 -30 22 -32 q26 2 22 32 q-3 -12 -22 -14 q-19 2 -22 14 Z" fill="#2b2a26" stroke="#2b2a26" />
      <circle cx="60" cy="44" r="20" />
      <line x1="52" y1="42" x2="56" y2="42" />
      <line x1="64" y1="42" x2="68" y2="42" />
      <path d="M54 52 q6 5 12 0" />
      <path d="M42 64 q18 12 36 0 l4 10 q-22 12 -44 0 Z" fill="#e07a5f" stroke="#2b2a26" />
      <path d="M80 74 q8 14 4 30 l-8 -4 q2 -14 -2 -22 Z" fill="#e07a5f" stroke="#2b2a26" />
      <line x1="46" y1="70" x2="74" y2="70" stroke="#2b2a26" strokeWidth="1" opacity="0.4" />
      <path d="M32 92 q28 -16 56 0 l10 72 q-38 16 -76 0 Z" fill="#fffdf8" />
      <path d="M44 92 l16 16 l-6 40 M76 92 l-16 16 l6 40" strokeWidth="1.4" opacity="0.75" />
      <circle cx="60" cy="130" r="1.8" fill="#2b2a26" />
      <circle cx="60" cy="150" r="1.8" fill="#2b2a26" />
      <path d="M30 128 q-10 8 -6 20" />
      <path d="M90 128 q10 8 6 20" />
      <path d="M38 176 l-4 48 M82 176 l4 48" />
    </svg>
  );
}

export function AboutRoom({ onBack }: { onBack: () => void }) {
  const { meta, about } = resume;
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
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Mail, label: "邮箱", value: meta.email, href: `mailto:${meta.email}` },
              { icon: Globe, label: "网站", value: meta.website?.replace(/^https?:\/\//, ""), href: meta.website },
              { icon: Code2, label: "代码", value: meta.github ? `github.com/${meta.github}` : undefined, href: meta.github ? `https://github.com/${meta.github}` : undefined },
              { icon: MapPin, label: "驻地", value: meta.location, href: undefined },
            ]
              .filter((x) => x.value)
              .map((x) => {
                const Icon = x.icon;
                const body = (
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={1.6} className="shrink-0 text-pencil" />
                    <div className="min-w-0">
                      <div className="font-plaque text-[10px] text-graphite">{x.label}</div>
                      <div className="font-hand truncate text-pencil">{x.value}</div>
                    </div>
                  </div>
                );
                return x.href ? (
                  <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer" className="border-2 border-pencil bg-card p-3 shadow-[4px_4px_0_rgba(43,42,38,0.12)] transition-transform hover:-translate-y-0.5">
                    {body}
                  </a>
                ) : (
                  <div key={x.label} className="border-2 border-pencil bg-card p-3 shadow-[4px_4px_0_rgba(43,42,38,0.12)]">
                    {body}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </RoomShell>
  );
}

/* ---------- Education：教育 ---------- */
export function EducationRoom({ onBack }: { onBack: () => void }) {
  const education = resume.education ?? [];
  return (
    <RoomShell title="教育" en="EDUCATION · THE YEARS" onBack={onBack}>
      <div className="mx-auto max-w-3xl space-y-5">
        {education.map((e, i) => (
          <div key={i} className="border-2 border-pencil bg-card p-6 shadow-[6px_6px_0_rgba(43,42,38,0.12)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-hand text-2xl text-pencil">{e.school}</h3>
              <span className="font-plaque text-xs text-graphite">{e.startDate} – {e.endDate}</span>
            </div>
            <p className="mt-1 text-graphite">
              {e.degree} · {e.major}
              {e.gpa ? ` · GPA ${e.gpa}` : ""}
            </p>
            {e.description && <p className="mt-3 text-sm leading-relaxed text-graphite">{e.description}</p>}
            {e.honors && e.honors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {e.honors.map((h) => (
                  <span key={h} className="border border-pencil/30 px-2 py-0.5 font-hand text-sm text-graphite">{h}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </RoomShell>
  );
}

/* ---------- Experience：经历 ---------- */
export function ExperienceRoom({ onBack }: { onBack: () => void }) {
  const experience = resume.experience ?? [];
  return (
    <RoomShell title="经历" en="EXPERIENCE · THE ROAD" onBack={onBack}>
      <div className="mx-auto max-w-3xl space-y-6">
        {experience.map((e, i) => (
          <div key={i} className="border-2 border-pencil bg-card p-6 shadow-[6px_6px_0_rgba(43,42,38,0.12)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-hand text-2xl text-pencil">{e.company}</h3>
              <span className="font-plaque text-xs text-graphite">
                {e.startDate} – {e.endDate ?? "至今"}
                {e.location ? ` · ${e.location}` : ""}
              </span>
            </div>
            <p className="mt-1 text-graphite">{e.position}</p>
            {e.description && e.description.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {e.description.map((d, k) => (
                  <li key={k} className="flex gap-2 text-sm leading-relaxed text-graphite">
                    <span className="text-pencil">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            {e.technologies && e.technologies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.technologies.map((t) => (
                  <span key={t} className="border border-pencil/25 px-2 py-0.5 font-plaque text-[11px] text-graphite">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </RoomShell>
  );
}

/* ---------- Contact：海边栈道 + 路牌 ---------- */
export function ContactRoom({ onBack }: { onBack: () => void }) {
  const { meta } = resume;
  const links = [
    meta.email && { label: "MAIL", value: meta.email, href: `mailto:${meta.email}` },
    meta.github && { label: "CODE", value: `github.com/${meta.github}`, href: `https://github.com/${meta.github}` },
    meta.website && { label: "SITE", value: meta.website.replace(/^https?:\/\//, ""), href: meta.website },
    meta.location && { label: "BASE", value: meta.location, href: undefined },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <RoomShell title="联系" en="CONTACT · BY THE SEA" onBack={onBack}>
      <div className="relative mx-auto max-w-4xl">
        <div className="pointer-events-none relative h-52 overflow-hidden">
          <svg viewBox="0 0 800 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#2b2a26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <g opacity="0.45">
              <path d="M140 52 q-22 0 -20 -14 q2 -12 17 -12 q5 -14 23 -12 q14 2 16 12 q14 -2 16 10 q2 12 -14 16 Z" />
              <path d="M600 40 q-16 0 -14 -11 q2 -10 14 -10 q4 -12 19 -10 q11 2 13 10 q11 -2 13 8 q2 10 -12 13 Z" />
            </g>
            <path d="M86 150 l9 -84 l26 0 l9 84 Z" />
            <path d="M92 66 l32 0" />
            <path d="M96 66 l-5 -15 l22 0 l-5 15" />
            <circle cx="105" cy="90" r="4" />
            <path d="M105 90 l22 -8 M105 90 l22 8" opacity="0.4" />
            <path d="M0 150 Q200 143 400 150 T800 147" opacity="0.6" />
            {Array.from({ length: 4 }).map((_, k) => (
              <path
                key={k}
                d={`M0 ${166 + k * 12} Q100 ${160 + k * 12} 200 ${166 + k * 12} T400 ${166 + k * 12} T600 ${166 + k * 12} T800 ${166 + k * 12}`}
                opacity={0.35 - k * 0.05}
              />
            ))}
            <path d="M470 150 q30 12 60 0 l-9 13 l-42 0 Z" />
            <line x1="500" y1="150" x2="500" y2="128" />
            <path d="M500 128 l24 15 l-24 0 Z" />
            <path d="M300 220 L500 220 L430 156 L370 156 Z" fill="#efece3" />
            {Array.from({ length: 6 }).map((_, k) => (
              <line key={k} x1={300 + k * 40} y1={220} x2={372 + k * 11} y2={156} opacity="0.5" />
            ))}
          </svg>
        </div>

        <div className="relative mt-4 flex flex-wrap items-start justify-center gap-x-6 gap-y-8">
          {links.map((l, i) => {
            const rot = [-5, 4, -3, 6][i % 4];
            const inner = (
              <div className="border-2 border-pencil bg-card px-5 py-3 shadow-[5px_5px_0_rgba(43,42,38,0.14)]" style={{ transform: `rotate(${rot}deg)` }}>
                <div className="flex items-center gap-1 font-plaque text-[10px] text-graphite">
                  {l.label} <ArrowUpRight size={11} />
                </div>
                <div className="font-hand text-lg text-pencil">{l.value}</div>
              </div>
            );
            return l.href ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div key={l.label}>{inner}</div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-4">
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
