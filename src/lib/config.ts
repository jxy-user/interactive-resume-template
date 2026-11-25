import type { ResumeConfig } from "@/types/resume";

/**
 * 默认配置 - 用于兜底和示例
 */
export const defaultConfig: ResumeConfig = {
  meta: {
    name: "你的名字",
    title: "全栈开发工程师 (Full-Stack Developer)",
    avatar: "/images/avatar.jpg",
    email: "hello@example.com",
    phone: "+86 1xx-xxxx-xxxx",
    location: "北京, 中国",
    website: "https://yoursite.com",
    github: "your-github-username",
    linkedin: "your-linkedin-username",
    twitter: "your-twitter-handle",
    bio: "热爱技术的全栈开发者，致力于构建优秀的数字化产品",
  },
  about: {
    summary:
      "我是一名全栈开发工程师，专注于构建用户友好的 Web 应用程序。擅长现代前端技术栈和后端架构设计，追求代码质量与用户体验的平衡。",
    highlights: ["5+ 年开发经验", "主导过 20+ 个项目", "开源贡献者"],
    skills: [
      {
        category: "前端 (Frontend)",
        items: [
          { name: "React", level: 90 },
          { name: "TypeScript", level: 85 },
          { name: "Next.js", level: 85 },
          { name: "Tailwind CSS", level: 80 },
          { name: "Vue.js", level: 75 },
        ],
      },
      {
        category: "后端 (Backend)",
        items: [
          { name: "Node.js", level: 80 },
          { name: "Go", level: 75 },
          { name: "Python", level: 70 },
          { name: "PostgreSQL", level: 75 },
          { name: "Redis", level: 65 },
        ],
      },
      {
        category: "工具 (Tools)",
        items: [
          { name: "Git", level: 85 },
          { name: "Docker", level: 70 },
          { name: "AWS", level: 60 },
          { name: "GitHub Actions", level: 75 },
        ],
      },
    ],
  },
  education: [
    {
      school: "某某大学",
      degree: "本科",
      major: "计算机科学与技术",
      startDate: "2018-09",
      endDate: "2022-06",
      gpa: "3.8/4.0",
      honors: ["优秀毕业生", "国家奖学金"],
      description: "专注于计算机科学与技术，主修软件工程方向",
    },
  ],
  experience: [
    {
      company: "某互联网公司",
      position: "高级前端开发工程师",
      startDate: "2022-07",
      endDate: "至今",
      location: "北京",
      description: [
        "主导公司核心产品的前端架构设计与开发",
        "优化首屏加载性能，提升 40%",
        "带领 3 人前端小组，制定代码规范",
      ],
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      url: "https://example.com",
    },
  ],
  projects: [
    {
      name: "交互式简历模板",
      description: "基于桌面场景的交互式个人简历网站，参加 Qoder 高校创造力大赛",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      image: "/images/project-resume.jpg",
      url: "https://yoursite.com",
      github: "https://github.com/your-username/interactive-resume-template",
      featured: true,
    },
  ],
  writing: [
    {
      title: "如何构建交互式简历网站",
      description: "分享构建这款交互式简历模板的设计思路与技术实现",
      date: "2026-11-01",
      tags: ["前端", "项目经验", "设计"],
      url: "https://yoursite.com/blog/interactive-resume",
    },
  ],
  theme: {
    mode: "dark",
    primaryColor: "#3b82f6",
  },
  i18n: {
    defaultLang: "zh",
    supportedLangs: ["zh", "en"],
  },
};

/**
 * 加载配置 - 优先从 public/resume-config.json 读取，失败则使用默认配置
 */
export async function loadConfig(): Promise<ResumeConfig> {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  try {
    const res = await fetch("/resume-config.json", { cache: "no-store" });
    if (!res.ok) {
      console.warn("[ResumeConfig] resume-config.json 不存在，使用默认配置");
      return defaultConfig;
    }
    const data = (await res.json()) as Partial<ResumeConfig>;
    return { ...defaultConfig, ...data };
  } catch (err) {
    console.error("[ResumeConfig] 加载配置失败:", err);
    return defaultConfig;
  }
}

/**
 * 验证配置完整性，返回缺失的关键字段
 */
export function validateConfig(config: ResumeConfig): string[] {
  const missing: string[] = [];
  if (!config.meta || !config.meta.name) missing.push("meta.name");
  if (!config.meta.title) missing.push("meta.title");
  if (!config.meta.email) missing.push("meta.email");
  if (!config.about || !config.about.summary) missing.push("about.summary");
  return missing;
}
