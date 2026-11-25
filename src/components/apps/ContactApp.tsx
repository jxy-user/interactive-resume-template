"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ContactApp() {
  const { config } = useConfig();
  const { t } = useI18n();
  const { meta } = config;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  // 静态站无后端：拼装 mailto，直接唤起邮件客户端
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `姓名：${formData.name}\n邮箱：${formData.email}\n\n${formData.message}`
    );
    const subject = encodeURIComponent(formData.subject);
    window.location.href = `mailto:${meta.email}?subject=${subject}&body=${body}`;
    setStatus("success");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-xl">{t("contact")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* 联系信息 */}
        <Card className="bg-card/50 border-border shadow-none rounded-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">{t("contactMe")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {meta.email && (
              <div className="flex items-center gap-3 p-3 bg-secondary/60 rounded-sm">
                <Mail size={18} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{meta.email}</p>
                  <p className="text-xs text-muted-foreground">主要联系方式</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="ml-auto shrink-0">
                  <a href={`mailto:${meta.email}`}>{t("sendEmail")}</a>
                </Button>
              </div>
            )}
            {meta.phone && (
              <div className="flex items-center gap-3 p-3 bg-secondary/60 rounded-sm">
                <Phone size={18} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{meta.phone}</p>
                  <p className="text-xs text-muted-foreground">电话联系</p>
                </div>
              </div>
            )}
            {meta.location && (
              <div className="flex items-center gap-3 p-3 bg-secondary/60 rounded-sm">
                <MapPin size={18} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{meta.location}</p>
                  <p className="text-xs text-muted-foreground">所在地</p>
                </div>
              </div>
            )}
            {meta.website && (
              <div className="flex items-center gap-3 p-3 bg-secondary/60 rounded-sm">
                <Globe size={18} strokeWidth={1.5} className="text-primary shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{meta.website}</p>
                  <p className="text-xs text-muted-foreground">个人网站</p>
                </div>
                <Button variant="ghost" size="sm" asChild className="ml-auto shrink-0">
                  <a href={meta.website} target="_blank" rel="noopener noreferrer">
                    访问
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 社交链接 */}
        <Card className="bg-card/50 border-border shadow-none rounded-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">社交媒体</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {meta.github && (
                <Button variant="outline" asChild className="gap-2">
                  <a href={`https://github.com/${meta.github}`} target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    GitHub
                  </a>
                </Button>
              )}
              {meta.linkedin && (
                <Button variant="outline" asChild className="gap-2">
                  <a href={`https://linkedin.com/in/${meta.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    LinkedIn
                  </a>
                </Button>
              )}
              {meta.twitter && (
                <Button variant="outline" asChild className="gap-2">
                  <a href={`https://twitter.com/${meta.twitter}`} target="_blank" rel="noopener noreferrer">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 联系表单 */}
        <Card className="bg-card/50 border-border shadow-none rounded-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">发送消息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">姓名</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">邮箱</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">主题</label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">内容</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 bg-background border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">发送消息</Button>
                {status === "success" && (
                  <span className="text-xs text-accent">已打开邮件客户端，请检查草稿</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
