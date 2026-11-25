"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { listItemVariants, staggerContainer } from "@/lib/animations";

export function AboutApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();

  const { meta, about } = config;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 头部信息卡片 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 个人信息卡片 */}
        <Card className="bg-white/5 backdrop-blur-md border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-shrink-0">
                <img
                  src={meta.avatar}
                  alt={meta.name}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-primary/50"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{meta.name}</h1>
                <p className="text-primary mt-1 text-lg">{meta.title}</p>
                <p className="text-muted-foreground mt-2 text-sm">{meta.bio}</p>

                {/* 联系方式 */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                  {meta.email && (
                    <span className="flex items-center gap-1">📧 {meta.email}</span>
                  )}
                  {meta.location && (
                    <span className="flex items-center gap-1">📍 {meta.location}</span>
                  )}
                  {meta.phone && (
                    <span className="flex items-center gap-1">📞 {meta.phone}</span>
                  )}
                </div>

                {/* 社交链接 */}
                <div className="flex justify-center md:justify-start gap-3 mt-4">
                  {meta.github && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`https://github.com/${meta.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    </Button>
                  )}
                  {meta.linkedin && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`https://linkedin.com/in/${meta.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </Button>
                  )}
                  {meta.twitter && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`https://twitter.com/${meta.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 个人简介 */}
        <Card className="bg-white/5 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{t("summary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.summary}</p>
          </CardContent>
        </Card>

        {/* 亮点 */}
        {about.highlights && about.highlights.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{t("highlights")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {about.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary">▸</span>
                    {highlight}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 技能标签云 */}
        {about.skills && about.skills.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">技能专长</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {about.skills.map((category, catIndex) => (
                  <motion.div key={catIndex} variants={listItemVariants}>
                    <h4 className="font-medium mb-2 text-sm">{category.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          variants={listItemVariants}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                          style={{ transitionDelay: `${catIndex * 0.1 + skillIndex * 0.05}s` }}
                        >
                          {skill.name}
                          {skill.level !== undefined && (
                            <span className="ml-1 opacity-60">{skill.level}%</span>
                          )}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="p-4 border-t border-border/50 flex gap-3 justify-end">
        <Button variant="outline" asChild>
          <a href={`mailto:${meta.email}`} target="_blank" rel="noopener noreferrer">
            {t("sendEmail")}
          </a>
        </Button>
        {meta.github && (
          <Button variant="outline" asChild>
            <a href={`https://github.com/${meta.github}`} target="_blank" rel="noopener noreferrer">
              {t("viewGithub")}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}