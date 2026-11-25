"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResumeConfig } from "@/types/resume";
import { defaultConfig } from "@/lib/config";

interface UseConfigReturn {
  config: ResumeConfig;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<ResumeConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/resume-config.json", { cache: "no-store" });
      if (!res.ok) {
        console.warn("[useConfig] resume-config.json 不存在，使用默认配置");
        setConfig(defaultConfig);
        return;
      }
      const data = (await res.json()) as Partial<ResumeConfig>;
      setConfig({ ...defaultConfig, ...data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载配置失败";
      console.error("[useConfig] 加载配置失败:", err);
      setError(message);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return { config, loading, error, reload: loadConfig };
}