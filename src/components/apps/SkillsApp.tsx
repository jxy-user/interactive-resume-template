"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { progressVariants } from "@/lib/animations";

export function SkillsApp() {
  const { config } = useConfig();
  const { t } = useI18n();
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
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-xl">{t("skills")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {about.skills.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.08, duration: 0.4 }}
          >
            <Card className="bg-card/50 border-border shadow-none rounded-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{skill.name}</span>
                        {skill.level !== undefined && (
                          <span className="font-plaque text-xs text-muted-foreground">{skill.level}</span>
                        )}
                      </div>
                      <div className="h-1.5 bg-secondary rounded-sm overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-sm"
                          variants={progressVariants}
                          custom={skill.level || 0}
                          initial="hidden"
                          animate="visible"
                        />
                      </div>
                    </div>
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
