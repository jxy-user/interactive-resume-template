import raw from "../../public/resume-config.json";
import type { ResumeConfig } from "@/types/resume";

/**
 * 构建时内联的内容数据 —— 唯一内容源仍是 public/resume-config.json。
 * 用 import 而非运行时 fetch，首屏即拿到真实内容，避免占位文案闪烁。
 * 模板使用者只需修改 public/resume-config.json 后重新构建。
 */
export const resume = raw as ResumeConfig;
