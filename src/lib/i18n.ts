import type { Lang } from "@/types/resume";

/**
 * 多语言翻译资源
 * 用户可在此扩展更多语言或自定义翻译内容
 */
export const translations: Record<Lang, Record<string, string>> = {
  zh: {
    // 桌面系统
    desktop: "桌面",
    startMenu: "开始菜单",
    shutdown: "关机",
    restart: "重启",
    settings: "设置",
    wallpaper: "壁纸",
    theme: "主题",
    language: "语言",
    time: "时间",
    date: "日期",

    // 窗口标题
    about: "关于我",
    education: "教育经历",
    experience: "工作经历",
    skills: "技能专长",
    projects: "项目作品集",
    writing: "博客文章",
    contact: "联系我",
    terminal: "终端",

    // 通用操作
    close: "关闭",
    minimize: "最小化",
    maximize: "最大化",
    restore: "还原",
    open: "打开",
    copy: "复制",
    delete: "删除",
    rename: "重命名",

    // 简历内容
    summary: "个人简介",
    highlights: "亮点",
    contactMe: "联系我",
    sendEmail: "发送邮件",
    viewGithub: "查看 GitHub",
    viewLinkedin: "查看 LinkedIn",
    viewTwitter: "查看 Twitter",

    // 终端命令提示
    terminalWelcome: "欢迎使用交互式简历终端",
    terminalHelp: "可用命令：ls, cat, whoami, about, education, experience, skills, projects, contact, clear, help",
    terminalNotFound: "命令未找到，输入 help 查看帮助",
    terminalError: "执行出错",

    // 主题
    lightTheme: "浅色模式",
    darkTheme: "深色模式",
    systemTheme: "跟随系统",

    // 语言
    langZh: "中文",
    langEn: "English",

    // 彩蛋
    konamiActivated: "🎉 秘密模式已激活！",
    konamiDeactivated: "🔒 秘密模式已关闭",
  },

  en: {
    // Desktop system
    desktop: "Desktop",
    startMenu: "Start Menu",
    shutdown: "Shutdown",
    restart: "Restart",
    settings: "Settings",
    wallpaper: "Wallpaper",
    theme: "Theme",
    language: "Language",
    time: "Time",
    date: "Date",

    // Window titles
    about: "About Me",
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    writing: "Writing",
    contact: "Contact",
    terminal: "Terminal",

    // Common actions
    close: "Close",
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    open: "Open",
    copy: "Copy",
    delete: "Delete",
    rename: "Rename",

    // Resume content
    summary: "About",
    highlights: "Highlights",
    contactMe: "Contact Me",
    sendEmail: "Send Email",
    viewGithub: "View GitHub",
    viewLinkedin: "View LinkedIn",
    viewTwitter: "View Twitter",

    // Terminal prompts
    terminalWelcome: "Welcome to the Interactive Resume Terminal",
    terminalHelp:
      "Available commands: ls, cat, whoami, about, education, experience, skills, projects, contact, clear, help",
    terminalNotFound: "Command not found, type 'help' for help",
    terminalError: "Execution error",

    // Theme
    lightTheme: "Light Mode",
    darkTheme: "Dark Mode",
    systemTheme: "Follow System",

    // Language
    langZh: "中文",
    langEn: "English",

    // Easter eggs
    konamiActivated: "🎉 Secret mode activated!",
    konamiDeactivated: "🔒 Secret mode disabled",
  },
};

/**
 * 根据键名获取翻译文本
 */
export function t(key: string, lang: Lang = "zh"): string {
  return translations[lang]?.[key] || key;
}
