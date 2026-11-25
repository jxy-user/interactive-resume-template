"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("writing")}</h2>
        <span className="text-sm text-muted-foreground">{writing.length} 篇文章</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {writing.map((article, index) => (
          <motion.div key={index} variants={listItemVariants}>
            <Card className="bg-white/5 backdrop-blur-md border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    </h3>
                    {article.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{article.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">📅 {formatDate(article.date, lang)}</span>
                      {article.tags && article.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          🏷️ {article.tags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      阅读全文 →
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

// 临时翻译
function t(key: string): string {
  const dict: Record<string, string> = {
    writing: "博客文章",
  };
  return dict[key] || key;
}