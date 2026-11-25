"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { listItemVariants, staggerContainer } from "@/lib/animations";

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
      <div className="p-4 border-b border-border/50">
        <h2 className="text-xl font-semibold">{t("education")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {education.map((edu, index) => (
          <motion.div key={index} variants={listItemVariants} className="relative">
            <Card className="bg-white/5 backdrop-blur-md border-border/50 relative overflow-hidden">
              {/* 时间轴左侧 */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/30" />
              <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-primary border-4 border-card -translate-x-1/2" />

              <CardContent className="p-6 pl-20">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{edu.school}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        🎓 {edu.degree}
                      </span>
                      <span className="flex items-center gap-1">
                        📚 {edu.major}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {formatDate(edu.startDate, lang)} - {edu.endDate === "至今" ? t("present") : formatDate(edu.endDate, lang)}
                      </span>
                    </div>
                    {edu.gpa && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        GPA: <span className="font-medium">{edu.gpa}</span>
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
                            className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30"
                          >
                            🏆 {honor}
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
    education: "教育经历",
    present: "至今",
  };
  return dict[key] || key;
}