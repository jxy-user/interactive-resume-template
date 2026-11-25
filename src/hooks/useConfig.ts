"use client";

import { useCallback } from "react";
import type { ResumeConfig } from "@/types/resume";
import { resume } from "@/lib/resumeData";

interface UseConfigReturn {
  config: ResumeConfig;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * 配置读取 —— 内容在构建时由 public/resume-config.json 内联，
 * 无需运行时 fetch，也没有第二份正文兜底（消除数据双源）。
 */
export function useConfig(): UseConfigReturn {
  const reload = useCallback(async () => {
    // 静态导出：内容随构建更新，运行时无需重新加载
  }, []);

  return { config: resume, loading: false, error: null, reload };
}
