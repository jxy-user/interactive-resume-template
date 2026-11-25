/**
 * 桌面图标映射表
 * 用于统一管理桌面图标的 emoji 显示
 */

export const IconMap: Record<string, string> = {
  about: "👤",
  education: "📚",
  experience: "💼",
  skills: "🛠️",
  projects: "📦",
  writing: "📝",
  contact: "📱",
  terminal: "💻",
};

/**
 * 获取图标 emoji
 */
export function getIcon(id: string): string {
  return IconMap[id] || "📄";
}