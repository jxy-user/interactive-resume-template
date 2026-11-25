import {
  Landmark,
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Layers,
  PenTool,
  Mail,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { WindowId } from "@/types/desktop";

/**
 * 窗口 / 桌面图标映射 —— 统一的线条图标系统，替代 emoji。
 * 图标语义取自博物馆导览牌：建筑、人物、学位帽、公文包、工具、
 * 叠层展品、书写、信笺、终端。
 */
export const windowIcons: Record<WindowId, LucideIcon> = {
  museum: Landmark,
  about: User,
  education: GraduationCap,
  experience: Briefcase,
  skills: Wrench,
  projects: Layers,
  writing: PenTool,
  contact: Mail,
  terminal: Terminal,
};
