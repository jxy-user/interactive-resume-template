"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { listItemVariants, staggerContainer } from "@/lib/animations";

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
      <div className="p-4 border-b border-border/50">
        <h2 className="text-xl font-semibold">{t("experience")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {experience.map((exp, index) => (
          <motion.div key={index} variants={listItemVariants} className="relative">
            <Card className="bg-white/5 backdrop-blur-md border-border/50 relative overflow-hidden">
              {/* 时间轴左侧 */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/30" />
              <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-primary border-4 border-card -translate-x-1/2" />

              <CardContent className="p-6 pl-20">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{exp.company}</h3>
                      {exp.url && (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <p className="text-primary font-medium">{exp.position}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📅 {formatDate(exp.startDate, lang)} - {exp.endDate ? (exp.endDate === "至今" ? "至今" : formatDate(exp.endDate, lang)) : "至今"}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">📍 {exp.location}</span>
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
                            <span className="text-primary mt-0.5">▸</span>
                            <span>{desc}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.technologies.map((tech, tIndex) => (
                          <motion.span
                            key={tIndex}
                            variants={listItemVariants}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 临时翻译
function t(key: string): string {
  const dict: Record<string, string> = {
    experience: "工作经历",
    present: "至今",
  };
  return dict[key] || key;
}