"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lang } from "@/types/resume";
import { translations, t as translate } from "@/lib/i18n";

interface UseI18nReturn {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  supportedLangs: Lang[];
}

export function useI18n(defaultLang: Lang = "zh", supportedLangs: Lang[] = ["zh", "en"]): UseI18nReturn {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  // 初始化：从 localStorage 读取
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang && supportedLangs.includes(savedLang)) {
      setLangState(savedLang);
    } else {
      setLangState(defaultLang);
    }
  }, [defaultLang, supportedLangs]);

  // 保存语言设置
  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }, []);

  // 翻译函数
  const t = useCallback((key: string) => {
    return translate(key, lang);
  }, [lang]);

  return { lang, setLang, t, supportedLangs };
}