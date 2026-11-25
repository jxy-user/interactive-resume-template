"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { listItemVariants } from "@/lib/animations";

export function ExperienceApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const { experience } = config;

  if (!experience || experience.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>暂无工作经历数据</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-xl">{t("experience")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {experience.map((exp, index) => (
          <motion.div key={index} variants={listItemVariants} initial="hidden" animate="visible" className="relative">
            <Card className="bg-card/50 border border-border rounded-sm shadow-none relative overflow-hidden">
              {/* 时间轴 */}
              <div className="absolute left-6 top-7 bottom-7 w-px bg-primary/40" />
              <div className="absolute left-6 top-7 h-2.5 w-2.5 rounded-full bg-primary -translate-x-1/2 border-2 border-card" />

              <CardContent className="p-6 pl-16">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg">{exp.company}</h3>
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`访问 ${exp.company} 网站`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowUpRight size={15} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
                <p className="text-primary text-sm mt-0.5">{exp.position}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
                    {formatDate(exp.startDate, lang)} – {!exp.endDate || exp.endDate === "至今" ? "至今" : formatDate(exp.endDate, lang)}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
                      {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && exp.description.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {exp.description.map((desc, dIndex) => (
                      <motion.li
                        key={dIndex}
                        variants={listItemVariants}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5 select-none" aria-hidden="true">▸</span>
                        <span>{desc}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech, tIndex) => (
                      <motion.span
                        key={tIndex}
                        variants={listItemVariants}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-sm border border-primary/25 font-plaque"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
