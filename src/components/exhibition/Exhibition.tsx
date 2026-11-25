"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
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
import type { ProjectItem, SkillCategory } from "@/types/resume";

const SECTIONS = [
  { id: "masthead", numeral: "00", label: "入口" },
  { id: "statement", numeral: "I", label: "陈述" },
  { id: "chronicle", numeral: "II", label: "编年" },
  { id: "collection", numeral: "III", label: "馆藏" },
  { id: "materials", numeral: "IV", label: "材料" },
  { id: "exit", numeral: "V", label: "出口" },
];

const fmt = (d?: string) => (d ? d.replace("-", ".") : "至今");

// 极淡的胶片颗粒，增加展厅质感的层次，避免纯色平面的廉价感
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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
  const [active, setActive] = useState("masthead");
  const chronicle = buildChronicle();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative bg-ink text-plaster">
      {/* 展厅聚光背景 */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(41 100% 93% / 0.10), transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 130%, hsl(34 41% 51% / 0.08), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
          style={{ backgroundImage: NOISE, backgroundSize: "140px 140px" }}
        />
      </div>

      {/* 侧边导视 */}
      <nav
        aria-label="展厅导航"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-5"
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              "group flex items-center justify-end gap-3 font-plaque text-xs transition-colors",
              active === s.id ? "text-primary" : "text-muted-foreground hover:text-plaster"
            )}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">{s.label}</span>
            <span className="tabular-nums">{s.numeral}</span>
          </button>
        ))}
      </nav>

      <main className="relative">
        <Masthead />
        <Statement />
        <Chronicle entries={chronicle} />
        <Collection projects={resume.projects ?? []} />
        <Materials skills={resume.about.skills ?? []} />
        <Exit />
      </main>

      <footer className="px-6 md:px-16 lg:px-24 py-10 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 font-plaque text-xs text-muted-foreground">
          <span>{resume.meta.name}</span>
          <span>以博物馆的方式，呈现一份简历</span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- 通用元件 ---------- */

/**
 * 静态容器 —— 内容始终可见。
 * 刻意不做「每段淡入上滑」的滚动动画（生成页面的常见模板感）；
 * 唯一的编排式入场留给首屏 Masthead。
 */
function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function SectionHeading({
  numeral,
  title,
  lede,
}: {
  numeral: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-14">
      <div className="flex items-baseline gap-4">
        <span className="font-plaque text-sm text-primary tabular-nums">{numeral}</span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">{title}</h2>
      </div>
      {lede && <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{lede}</p>}
      <div className="mt-8 h-px bg-border" />
    </div>
  );
}

/* ---------- 展厅 ---------- */

function Masthead() {
  const { meta } = resume;
  const reduce = useReducedMotion();
  return (
    <section
      id="masthead"
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* 博物馆拱门线稿 —— 展厅入口的建筑感 */}
      <svg
        className="pointer-events-none absolute right-[-4%] top-1/2 hidden -translate-y-1/2 h-[86vh] w-auto text-primary opacity-[0.07] md:block"
        viewBox="0 0 400 620"
        fill="none"
        aria-hidden="true"
      >
        <path d="M40 600V240A160 160 0 0 1 360 240V600" stroke="currentColor" strokeWidth="1.2" />
        <path d="M78 600V250A122 122 0 0 1 322 250V600" stroke="currentColor" strokeWidth="0.9" />
        <path d="M120 600V270A80 80 0 0 1 280 270V600" stroke="currentColor" strokeWidth="0.7" />
        <path d="M0 600h400" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      {/* 顶部聚光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 32% -8%, hsl(41 100% 93% / 0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl w-full mx-auto">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="font-plaque text-sm text-primary mb-8">此人在展 2026</div>
          <h1 className="font-display text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.88] tracking-tight">
            {meta.name}
          </h1>
          <p className="font-display text-2xl md:text-3xl text-primary mt-7">{meta.title}</p>
          <div className="mt-10 h-px w-28 bg-primary/60" />
          <p className="mt-9 max-w-xl text-lg leading-relaxed text-muted-foreground">{meta.bio}</p>

          {/* 展签信息条 */}
          <dl className="mt-11 grid max-w-md grid-cols-3 gap-x-6 font-plaque text-[11px]">
            <div>
              <dt className="text-primary mb-1">展品</dt>
              <dd className="text-plaster/75">{meta.name}</dd>
            </div>
            <div>
              <dt className="text-primary mb-1">媒介</dt>
              <dd className="text-plaster/75">代码 设计 空间</dd>
            </div>
            <div>
              <dt className="text-primary mb-1">年份</dt>
              <dd className="text-plaster/75">2026</dd>
            </div>
          </dl>
        </motion.div>

        <motion.button
          onClick={() => document.getElementById("statement")?.scrollIntoView({ behavior: "smooth" })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1, duration: 0.8 }}
          className="mt-14 inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-plaster transition-colors"
        >
          <ArrowDown size={16} strokeWidth={1.5} className="animate-bounce" aria-hidden="true" />
          <span className="font-plaque text-xs">向下探索</span>
        </motion.button>
      </div>
    </section>
  );
}

function Statement() {
  const { meta, about } = resume;
  return (
    <section id="statement" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading numeral="I" title="策展人陈述" />
        </Reveal>
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-10 md:gap-16">
          <Reveal>
            <p className="text-lg leading-loose text-plaster/85 whitespace-pre-wrap">{about.summary}</p>
            {about.highlights && about.highlights.length > 0 && (
              <ul className="mt-10 space-y-3">
                {about.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary shrink-0" aria-hidden="true">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="md:border-l md:border-border md:pl-10">
              <h3 className="font-plaque text-xs text-muted-foreground mb-5">档案</h3>
              <dl className="space-y-4 text-sm">
                <Info icon={Mail} label="邮箱" href={`mailto:${meta.email}`} value={meta.email} />
                {meta.location && <Info icon={MapPin} label="驻地" value={meta.location} />}
                {meta.website && (
                  <Info
                    icon={Globe}
                    label="网站"
                    href={meta.website}
                    value={meta.website.replace(/^https?:\/\//, "")}
                  />
                )}
                {meta.github && (
                  <Info
                    icon={Code2}
                    label="代码"
                    href={`https://github.com/${meta.github}`}
                    value={`github.com/${meta.github}`}
                  />
                )}
              </dl>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
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
      <dd className="flex items-center gap-2 text-plaster/85 group-hover:text-primary transition-colors">
        <Icon size={14} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden="true" />
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

function Chronicle({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return null;
  return (
    <section id="chronicle" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            numeral="II"
            title="编年"
            lede="按时间展开的工作与教育轨迹，如同展览墙上的一条年表。"
          />
        </Reveal>
        <ol className="relative ml-3 border-l border-border">
          {entries.map((e, i) => (
            <li key={i} className="relative pl-8 md:pl-12 pb-12 last:pb-0">
              <span
                className="absolute -left-[3.5px] top-2 h-1.5 w-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              <Reveal delay={i * 0.05}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-plaque text-xs text-primary">{e.period}</span>
                  <span className="font-plaque text-[11px] text-muted-foreground">{e.kind}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl mt-1.5">{e.org}</h3>
                <p className="text-plaster/70 mt-0.5">{e.role}</p>
                {e.points.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {e.points.map((p, pi) => (
                      <li key={pi} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                        <span className="text-primary/70 shrink-0" aria-hidden="true">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {e.tech && e.tech.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-plaque text-[11px] text-muted-foreground">
                    {e.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Collection({ projects }: { projects: ProjectItem[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="collection" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading numeral="III" title="馆藏" lede="每一件作品都是一次尝试，按编号陈列。" />
        </Reveal>
        <div className="border-t border-border">
          {projects.map((p, i) => (
            <Reveal key={i}>
              <article className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr] gap-4 md:gap-8 py-9 border-b border-border">
                <span className="font-plaque text-sm text-primary tabular-nums pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                          代码
                          <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                          预览
                          <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-2.5 text-muted-foreground leading-relaxed max-w-2xl">{p.description}</p>
                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-x-3 gap-y-1 font-plaque text-[11px] text-muted-foreground">
                      {p.technologies.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Materials({ skills }: { skills: SkillCategory[] }) {
  if (skills.length === 0) return null;
  return (
    <section id="materials" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading numeral="IV" title="材料与工艺" lede="按类陈列的技术与工具，数字为自评熟练度。" />
        </Reveal>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.05}>
              <div>
                <h3 className="font-display text-xl mb-4">{cat.category}</h3>
                <ul className="border-t border-border">
                  {cat.items.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-baseline justify-between gap-4 py-2.5 border-b border-border/60"
                    >
                      <span className="text-plaster/85">{s.name}</span>
                      {s.level !== undefined && (
                        <span className="font-plaque text-xs text-muted-foreground tabular-nums">
                          {s.level}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Exit() {
  const { meta } = resume;
  return (
    <section id="exit" className="py-28 md:py-40 px-6 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <div className="font-plaque text-sm text-primary mb-6">V 出口</div>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-tight">感谢参观</h2>
          <p className="mt-6 text-muted-foreground max-w-md mx-auto leading-relaxed">
            如果你愿意继续交流，欢迎写信。展览到此结束，故事仍在前方。
          </p>
          <a
            href={`mailto:${meta.email}`}
            className="inline-block mt-10 font-display text-2xl md:text-3xl text-primary hover:underline underline-offset-8 decoration-primary/50"
          >
            {meta.email}
          </a>
          <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {meta.github && <SocialLink href={`https://github.com/${meta.github}`} label="GitHub" />}
            {meta.linkedin && (
              <SocialLink href={`https://linkedin.com/in/${meta.linkedin}`} label="LinkedIn" />
            )}
            {meta.twitter && (
              <SocialLink href={`https://twitter.com/${meta.twitter}`} label="Twitter" />
            )}
            {meta.website && <SocialLink href={meta.website} label="个人网站" />}
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-16 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-plaster transition-colors"
          >
            <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
            回到入口
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
    >
      {label}
      <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}
