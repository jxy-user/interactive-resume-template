"use client";

import { motion } from "framer-motion";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { listItemVariants } from "@/lib/animations";
import type { ProjectItem } from "@/types/resume";

export function ProjectsApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const { projects } = config;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>暂无项目数据</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("projects")}</h2>
        <span className="text-sm text-muted-foreground">{projects.length} 个项目</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={listItemVariants}
              className="group"
            >
              <Card
                className="bg-white/5 backdrop-blur-md border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col"
                onClick={() => setSelectedProject(project)}
              >
                {project.image && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-amber-500/90 text-black text-xs rounded-full font-medium">⭐ 置顶</span>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold mb-2 line-clamp-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 5).map((tech: string, tIndex: number) => (
                        <span key={tIndex} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded border border-primary/20">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded border border-border">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    {project.github && (
                      <Button variant="ghost" size="sm" className="flex-1" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          代码
                        </a>
                      </Button>
                    )}
                    {project.url && (
                      <Button variant="ghost" size="sm" className="flex-1" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          预览
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 项目详情模态框 */}
      <Modal open={!!selectedProject} onClose={() => setSelectedProject(null)}>
        <div className="bg-card w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl">
          {selectedProject && (
            <div className="p-6">
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full aspect-video object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProject.name}</h3>
                  <p className="text-muted-foreground mt-1">{selectedProject.description}</p>
                </div>
              </div>

              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">技术栈</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string, tIndex: number) => (
                      <span key={tIndex} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedProject.github && (
                  <Button variant="default" asChild>
                    <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      查看源码
                    </a>
                  </Button>
                )}
                {selectedProject.url && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      在线预览
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// 临时翻译
function t(key: string): string {
  const dict: Record<string, string> = {
    projects: "项目作品集",
  };
  return dict[key] || key;
}