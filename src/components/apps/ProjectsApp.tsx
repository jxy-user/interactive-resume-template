"use client";

import { motion } from "framer-motion";
import { Star, Code2, ExternalLink } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { listItemVariants } from "@/lib/animations";
import type { ProjectItem } from "@/types/resume";

export function ProjectsApp() {
  const { config } = useConfig();
  const { t } = useI18n();
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
      <div className="px-6 py-4 border-b border-border flex items-baseline justify-between">
        <h2 className="font-display text-xl">{t("projects")}</h2>
        <span className="font-plaque text-xs text-muted-foreground">{projects.length} 件展品</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              className="group"
            >
              <Card
                className="bg-card/50 border-border shadow-none overflow-hidden hover:border-primary/60 transition-colors h-full flex flex-col rounded-sm cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {project.image && (
                  <div className="aspect-video relative overflow-hidden border-b border-border">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-[11px] rounded-sm font-medium">
                          <Star size={10} strokeWidth={2} fill="currentColor" aria-hidden="true" />
                          置顶
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display text-lg mb-1.5 line-clamp-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 5).map((tech, tIndex) => (
                        <span key={tIndex} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[11px] rounded-sm border border-primary/25 font-plaque">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-[11px] rounded-sm border border-border font-plaque">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-border/60">
                    {project.github && (
                      <Button variant="ghost" size="sm" className="flex-1" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                          <Code2 size={13} strokeWidth={1.5} /> 代码
                        </a>
                      </Button>
                    )}
                    {project.url && (
                      <Button variant="ghost" size="sm" className="flex-1" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                          <ExternalLink size={13} strokeWidth={1.5} /> 预览
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
        <div className="bg-card w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-sm border border-border">
          {selectedProject && (
            <div className="p-6">
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full aspect-video object-cover rounded-sm border border-border mb-4"
                />
              )}
              <div className="mb-4">
                <h3 className="font-display text-2xl">{selectedProject.name}</h3>
                <p className="text-muted-foreground mt-1">{selectedProject.description}</p>
              </div>

              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-plaque text-xs text-muted-foreground mb-2">技术栈</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech, tIndex) => (
                      <span key={tIndex} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-sm border border-primary/25 font-plaque">
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
                      <Code2 size={15} strokeWidth={1.5} /> 查看源码
                    </a>
                  </Button>
                )}
                {selectedProject.url && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink size={15} strokeWidth={1.5} /> 在线预览
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
