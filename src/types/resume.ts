export type Lang = "zh" | "en";

export interface ResumeMeta {
  name: string; // 姓名
  title: string; // 职位 / 职称
  avatar: string; // 头像图片 URL
  email: string; // 邮箱
  phone?: string; // 电话
  location?: string; // 所在地
  website?: string; // 个人网站
  github?: string; // GitHub 用户名
  linkedin?: string; // LinkedIn 用户名
  twitter?: string; // Twitter / X 用户名
  bio?: string; // 一句话简介
}

export interface SkillItem {
  name: string; // 技能名称
  level?: number; // 熟练度 0-100
}

export interface SkillCategory {
  category: string; // 类别，如 "前端"、"后端"
  items: SkillItem[];
}

export interface AboutData {
  summary: string; // 个人简介
  highlights?: string[]; // 亮点列表
  skills?: SkillCategory[];
}

export interface EducationItem {
  school: string; // 学校
  degree: string; // 学位
  major: string; // 专业
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  gpa?: string; // GPA
  honors?: string[]; // 荣誉
  description?: string; // 描述
}

export interface ExperienceItem {
  company: string; // 公司
  position: string; // 职位
  startDate: string; // 开始日期
  endDate?: string; // 结束日期，"至今" 时留空
  location?: string; // 地点
  description?: string[]; // 职责描述
  technologies?: string[]; // 技术栈
  url?: string; // 项目/公司链接
}

export interface ProjectItem {
  name: string; // 项目名称
  description: string; // 项目描述
  technologies?: string[]; // 技术栈
  image?: string; // 项目截图
  url?: string; // 项目链接
  github?: string; // GitHub 链接
  featured?: boolean; // 是否置顶
}

export interface WritingItem {
  title: string; // 文章标题
  description?: string; // 摘要
  date: string; // 发布日期
  tags?: string[]; // 标签
  url: string; // 文章链接
}

export interface CustomSection {
  id: string; // 唯一标识
  title: string; // 标题
  items: Array<Record<string, string | number | boolean>>; // 自定义内容
}

export interface ResumeConfig {
  meta: ResumeMeta;
  about: AboutData;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  writing?: WritingItem[];
  customSections?: CustomSection[];
  theme?: {
    mode: "light" | "dark" | "system";
    primaryColor?: string; // 主色调 hex
  };
  i18n?: {
    defaultLang: Lang;
    supportedLangs: Lang[];
  };
}
