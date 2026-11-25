"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  Globe,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { resume } from "@/lib/resumeData";
import { cn } from "@/lib/utils";
import { Artwork, type ArtworkVariant } from "./Artwork";
import type { ProjectItem, SkillCategory } from "@/types/resume";

const SECTIONS = [
  { id: "entrance", label: "入口" },
  { id: "portrait", label: "自画像" },
  { id: "timeline", label: "年表" },
  { id: "gallery", label: "展厅" },
  { id: "materials", label: "材料" },
  { id: "exit", label: "出口" },
];

const fmt = (d?: string) => (d ? d.replace("-", ".") : "至今");

const VARIANTS: ArtworkVariant[] = ["dawn", "dusk", "city", "sea", "forest", "moon"];
const SAMPLE = ["#e8a87c", "#c99a4e", "#c97b5a", "#d9be98", "#a85c42", "#e5c07b"];

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const MOTES = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${((i * 53) % 90) + 5}%`,
  size: 4 + (i % 3) * 2,
  delay: `${(i % 7) * 1.3}s`,
  duration: `${10 + (i % 5) * 2}s`,
}));

interface Entry {
  period: string;
  org: string;
  role: string;
  points: string[];
  tech?: string[];
  kind: string;
}

function buildChronicle(): Entry[] {
  const { experience = [], education = [] } = resume;
  return [
    ...experience.map((e) => ({
      period: `${fmt(e.startDate)} — ${e.endDate ? fmt(e.endDate) : "至今"}`,
      org: e.company,
      role: e.position,
      points: e.description ?? [],
      tech: e.technologies,
      kind: "工作",
    })),
    ...education.map((e) => ({
      period: `${fmt(e.startDate)} — ${e.endDate === "至今" ? "至今" : fmt(e.endDate)}`,
      org: e.school,
      role: `${e.degree} · ${e.major}`,
      points: [e.description, e.gpa ? `GPA ${e.gpa}` : undefined, ...(e.honors ?? [])].filter(
        Boolean
      ) as string[],
      kind: "教育",
    })),
  ];
}

export function Exhibition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupOffsets = useRef<Record<string, number>>({});
  const [maxX, setMaxX] = useState(0);
  const [active, setActive] = useState("entrance");

  const chronicle = buildChronicle();
  const projects = resume.projects ?? [];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
    const offs: Record<string, number> = {};
    track.querySelectorAll<HTMLElement>("[data-group]").forEach((el) => {
      const g = el.dataset.group;
      if (g && !(g in offs)) offs[g] = el.offsetLeft;
    });
    groupOffsets.current = offs;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 400);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [measure]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const offs = groupOffsets.current;
      let cur = "entrance";
      let best = -Infinity;
      for (const k in offs) {
        if (offs[k] <= y + window.innerHeight * 0.35 && offs[k] >= best) {
          best = offs[k];
          cur = k;
        }
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 深链：#wall-N 定位到第 N 面墙（0 起）
  useEffect(() => {
    const m = window.location.hash.match(/^#wall-(\d+)$/);
    if (!m) return;
    const idx = Number(m[1]);
    const t = window.setTimeout(() => {
      const els = trackRef.current?.querySelectorAll<HTMLElement>("[data-group]");
      const el = els?.[idx];
      if (el) window.scrollTo({ top: el.offsetLeft });
    }, 500);
    return () => window.clearTimeout(t);
  }, []);

  const go = (id: string) =>
    window.scrollTo({ top: groupOffsets.current[id] ?? 0, behavior: "smooth" });

  return (
    <div className="relative bg-background text-ink">
      {/* 画廊暖光背景 */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, #fffbf0 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(ellipse at 85% 115%, #f2b98c 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
          style={{ backgroundImage: NOISE, backgroundSize: "160px 160px" }}
        />
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ochre/60 animate-drift"
            style={{
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              animationDelay: m.delay,
              animationDuration: m.duration,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* 固定品牌与提示 */}
      <div className="fixed top-6 left-8 z-40 font-plaque text-xs text-primary">《此人在展》</div>
      <div className="fixed top-6 right-8 z-40 hidden md:block font-plaque text-[11px] text-ink/45">
        滚动 · 沿墙游览
      </div>

      {/* 长廊：滚动驱动横向平移 */}
      <div ref={containerRef} style={{ height: `calc(100vh + ${maxX}px)` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative flex h-full w-max items-stretch will-change-transform"
          >
            <EntranceWall onEnter={() => go("portrait")} />
            <PortraitWall />
            {chronicle.map((e, i) => (
              <TimelineWall key={i} entry={e} index={i} />
            ))}
            {projects.map((p, i) => (
              <GalleryWall key={i} project={p} index={i} />
            ))}
            <MaterialsWall skills={resume.about.skills ?? []} />
            <ExitWall />
          </motion.div>
        </div>
      </div>

      {/* 底部导览 */}
      <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-cream/85 px-2 py-1.5 shadow-sm backdrop-blur">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={cn(
              "rounded-full px-2.5 py-1 font-plaque text-[11px] transition-colors",
              active === s.id ? "bg-primary text-primary-foreground" : "text-ink/50 hover:text-ink"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- 通用墙 ---------- */

function Wall({
  group,
  label,
  wide,
  children,
  className,
}: {
  group: string;
  label?: string;
  wide?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-group={group}
      className={cn(
        "relative h-screen shrink-0 flex flex-col justify-center overflow-hidden border-r border-border/40 px-10 lg:px-16",
        wide ? "w-[min(94vw,1200px)]" : "w-[min(92vw,820px)]",
        className
      )}
    >
      {label && (
        <div className="absolute left-10 lg:left-16 top-10 font-plaque text-[11px] text-primary/80">
          {label}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------- 入口墙 ---------- */

function EntranceWall({ onEnter }: { onEnter: () => void }) {
  const { meta } = resume;
  return (
    <Wall group="entrance" wide label="00 · 入口" className="bg-gradient-to-b from-cream/50 via-transparent to-transparent">
      <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-12 w-full">
        <div>
          <div className="font-plaque text-sm text-primary mb-5">此人在展 2026</div>
          <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] text-ink">
            {meta.name}
          </h1>
          <p className="font-hand text-2xl md:text-3xl text-primary mt-4">{meta.title}</p>
          <div className="mt-6 h-px w-24 bg-clay/60" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">{meta.bio}</p>

          <dl className="mt-8 grid max-w-sm grid-cols-3 gap-x-5 font-plaque text-[11px]">
            <div>
              <dt className="text-primary mb-1">展品</dt>
              <dd className="text-ink/70">{meta.name}</dd>
            </div>
            <div>
              <dt className="text-primary mb-1">媒介</dt>
              <dd className="text-ink/70">代码 设计 空间</dd>
            </div>
            <div>
              <dt className="text-primary mb-1">年份</dt>
              <dd className="text-ink/70">2026</dd>
            </div>
          </dl>

          <button
            onClick={onEnter}
            className="mt-10 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary transition-colors"
          >
            <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
            <span className="font-plaque text-xs">走进画廊</span>
          </button>
        </div>

        {/* 暖光门洞 + 人物剪影 */}
        <div className="relative mx-auto w-full max-w-[300px]">
          <div className="frame relative h-[56vh] max-h-[500px] w-full overflow-hidden rounded-t-full">
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg,#fff9e8 0%,#fbd79e 40%,#f2b98c 72%,#e0a878 100%)" }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 50% 32%, #fffbf0 0%, transparent 52%)" }}
            />
            <svg
              className="absolute inset-x-0 bottom-0 h-1/2 w-full"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 120 Q75 70 150 110 T300 100 V200 H0 Z" fill="#e0a878" opacity="0.9" />
              <path d="M0 150 Q90 115 180 150 T300 145 V200 H0 Z" fill="#d89a72" />
            </svg>
            <svg
              className="absolute bottom-6 left-1/2 h-44 w-20 -translate-x-1/2 text-ink/70"
              viewBox="0 0 60 120"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="30" cy="16" r="9" />
              <path d="M21 28 h18 l4 42 h-7 l-3 -18 l-3 18 h-7 Z" />
              <rect x="24" y="68" width="6" height="36" rx="2" />
              <rect x="32" y="68" width="6" height="36" rx="2" />
            </svg>
          </div>
          <div className="mx-auto mt-3 h-3 w-3/4 rounded-full bg-clay/30 blur-md" aria-hidden="true" />
        </div>
      </div>
    </Wall>
  );
}

/* ---------- 自画像墙 ---------- */

function PortraitWall() {
  const { meta, about } = resume;
  return (
    <Wall group="portrait" wide label="I · 自画像">
      <div className="grid grid-cols-[300px_1fr] items-center gap-14 w-full">
        <figure className="frame rounded-md bg-cream p-3">
          <div className="overflow-hidden rounded-sm">
            <Artwork variant="dawn" className="aspect-[4/5] w-full" />
          </div>
          <figcaption className="mt-3 text-center font-plaque text-[11px] text-muted-foreground">
            画像 · {meta.name} · 2026
          </figcaption>
        </figure>

        <div>
          <p className="text-lg leading-loose text-ink/80 whitespace-pre-wrap">{about.summary}</p>
          {about.highlights && about.highlights.length > 0 && (
            <ul className="mt-7 grid grid-cols-2 gap-x-8 gap-y-2">
              {about.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink/70">
                  <span className="text-primary shrink-0" aria-hidden="true">—</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-border pt-6 text-sm">
            <Info icon={Mail} label="邮箱" href={`mailto:${meta.email}`} value={meta.email} />
            {meta.location && <Info icon={MapPin} label="驻地" value={meta.location} />}
            {meta.website && (
              <Info icon={Globe} label="网站" href={meta.website} value={meta.website.replace(/^https?:\/\//, "")} />
            )}
            {meta.github && (
              <Info icon={Code2} label="代码" href={`https://github.com/${meta.github}`} value={`github.com/${meta.github}`} />
            )}
          </dl>
        </div>
      </div>
    </Wall>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <dt className="font-plaque text-[11px] text-muted-foreground mb-1">{label}</dt>
      <dd className="flex items-center gap-2 text-ink/80 group-hover:text-primary transition-colors">
        <Icon size={14} strokeWidth={1.6} className="text-primary shrink-0" aria-hidden="true" />
        <span className="truncate">{value}</span>
      </dd>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

/* ---------- 年表墙 ---------- */

function TimelineWall({ entry, index }: { entry: Entry; index: number }) {
  return (
    <Wall group="timeline" label={`II · 年表 ${String(index + 1).padStart(2, "0")}`}>
      <figure className="frame w-full rounded-md bg-cream p-3">
        <div className="overflow-hidden rounded-sm">
          <Artwork variant={VARIANTS[index % VARIANTS.length]} className="aspect-[16/9] w-full" />
        </div>
      </figure>
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-plaque text-xs text-primary">{entry.period}</span>
          <span className="font-plaque text-[11px] text-muted-foreground">{entry.kind}</span>
        </div>
        <h3 className="font-display text-2xl text-ink mt-1.5">{entry.org}</h3>
        <p className="text-ink/65 mt-0.5">{entry.role}</p>
        {entry.points.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {entry.points.map((p, pi) => (
              <li key={pi} className="flex gap-2.5 text-sm text-ink/65 leading-relaxed">
                <span className="text-primary/70 shrink-0" aria-hidden="true">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {entry.tech && entry.tech.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tech.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-secondary text-ink/70 font-plaque text-[11px] rounded-sm">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Wall>
  );
}

/* ---------- 展厅墙（每个项目一面） ---------- */

function GalleryWall({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <Wall group="gallery" label={`III · 展品 ${String(index + 1).padStart(2, "0")}`}>
      <figure className="frame w-full rounded-md bg-cream p-3">
        <div className="overflow-hidden rounded-sm">
          <Artwork variant={VARIANTS[index % VARIANTS.length]} className="aspect-[16/10] w-full" />
        </div>
      </figure>
      <figcaption className="mt-6 px-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-ink">{project.name}</h3>
          <span className="font-plaque text-xs text-muted-foreground shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="mt-2 text-ink/65 leading-relaxed">{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-plaque text-[11px] text-muted-foreground">
            {project.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-5 text-sm">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-ink transition-colors"
            >
              代码
              <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-ink transition-colors"
            >
              预览
              <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
            </a>
          )}
        </div>
      </figcaption>
    </Wall>
  );
}

/* ---------- 材料墙 ---------- */

function MaterialsWall({ skills }: { skills: SkillCategory[] }) {
  return (
    <Wall group="materials" wide label="IV · 材料与工艺">
      <div className="grid grid-cols-3 gap-10 w-full">
        {skills.map((cat, ci) => (
          <div key={cat.category}>
            <h3 className="font-display text-xl mb-4 text-ink">{cat.category}</h3>
            <ul className="border-t border-border">
              {cat.items.map((s, si) => (
                <li key={s.name} className="flex items-center gap-3 py-2.5 border-b border-border/60">
                  <span
                    className="frame h-5 w-5 shrink-0 rounded-sm"
                    style={{ backgroundColor: SAMPLE[(ci + si) % SAMPLE.length] }}
                    aria-hidden="true"
                  />
                  <span className="text-ink/85">{s.name}</span>
                  {s.level !== undefined && (
                    <span className="ml-auto font-plaque text-xs text-muted-foreground tabular-nums">
                      {s.level}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Wall>
  );
}

/* ---------- 出口墙 ---------- */

function ExitWall() {
  const { meta } = resume;
  return (
    <Wall group="exit" wide label="V · 出口" className="text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 0%, #fffbf0 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="relative">
        <h2 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-tight text-ink">感谢参观</h2>
        <p className="mt-5 text-ink/65 max-w-md mx-auto leading-relaxed">
          愿你在光里多留一会儿。若愿意继续交流，欢迎写信。
        </p>
        <a
          href={`mailto:${meta.email}`}
          className="inline-block mt-9 font-display text-2xl md:text-3xl text-primary hover:text-ink transition-colors underline-offset-8 hover:underline decoration-primary/40"
        >
          {meta.email}
        </a>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {meta.github && <SocialLink href={`https://github.com/${meta.github}`} label="GitHub" />}
          {meta.linkedin && <SocialLink href={`https://linkedin.com/in/${meta.linkedin}`} label="LinkedIn" />}
          {meta.twitter && <SocialLink href={`https://twitter.com/${meta.twitter}`} label="Twitter" />}
          {meta.website && <SocialLink href={meta.website} label="个人网站" />}
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-12 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary transition-colors"
        >
          <ArrowUp size={15} strokeWidth={1.6} aria-hidden="true" />
          走回入口
        </button>
      </div>
    </Wall>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-ink/60 hover:text-primary transition-colors"
    >
      {label}
      <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden="true" />
    </a>
  );
}
