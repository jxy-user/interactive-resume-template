"use client";

import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { listItemVariants } from "@/lib/animations";

export function WritingApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const { writing } = config;

  if (!writing || writing.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>暂无文章数据</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-baseline justify-between">
        <h2 className="font-display text-xl">{t("writing")}</h2>
        <span className="font-plaque text-xs text-muted-foreground">{writing.length} 篇</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {writing.map((article, index) => (
          <motion.div key={index} variants={listItemVariants} initial="hidden" animate="visible">
            <Card className="bg-card/50 border border-border hover:border-primary/60 transition-colors rounded-sm shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg mb-1 line-clamp-1">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    {article.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} strokeWidth={1.5} aria-hidden="true" />
                        {formatDate(article.date, lang)}
                      </span>
                      {article.tags && article.tags.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Tag size={13} strokeWidth={1.5} aria-hidden="true" />
                          {article.tags.join(" / ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      阅读全文
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
