"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { progressVariants } from "@/lib/animations";

export function SkillsApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const { about } = config;

  if (!about?.skills || about.skills.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>暂无技能数据</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-xl font-semibold">{t("skills")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {about.skills.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1, duration: 0.5 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.1 + skillIndex * 0.05, duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        {skill.level !== undefined && (
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        )}
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          variants={progressVariants}
                          custom={skill.level || 0}
                          initial="hidden"
                          animate="visible"
                        />
                      </div>
                    </motion.div>
                  ))}
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
    skills: "技能专长",
  };
  return dict[key] || key;
}