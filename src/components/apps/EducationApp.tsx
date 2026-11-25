"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { listItemVariants } from "@/lib/animations";

export function EducationApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const { education } = config;

  if (!education || education.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>暂无教育经历数据</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-xl">{t("education")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {education.map((edu, index) => (
          <motion.div key={index} variants={listItemVariants} initial="hidden" animate="visible" className="relative">
            <Card className="bg-card/50 border border-border relative overflow-hidden rounded-sm">
              {/* 时间轴左线 */}
              <div className="absolute left-6 top-7 bottom-7 w-px bg-primary/40" />
              <div className="absolute left-6 top-7 h-2.5 w-2.5 rounded-full bg-primary -translate-x-1/2 border-2 border-card" />

              <CardContent className="p-6 pl-16">
                <h3 className="font-display text-lg">{edu.school}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={14} strokeWidth={1.5} className="text-primary" aria-hidden="true" />
                    {edu.degree}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} strokeWidth={1.5} className="text-primary" aria-hidden="true" />
                    {edu.major}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} strokeWidth={1.5} className="text-primary" aria-hidden="true" />
                    {formatDate(edu.startDate, lang)} – {edu.endDate === "至今" ? "至今" : formatDate(edu.endDate, lang)}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    GPA <span className="font-plaque text-foreground/80">{edu.gpa}</span>
                  </p>
                )}
                {edu.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{edu.description}</p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {edu.honors.map((honor, hIndex) => (
                      <motion.span
                        key={hIndex}
                        variants={listItemVariants}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm border border-primary/25"
                      >
                        <Award size={12} strokeWidth={1.5} aria-hidden="true" />
                        {honor}
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
