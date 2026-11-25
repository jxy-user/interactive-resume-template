# 交互式个人简历网站模板

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink?logo=framer&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**🎨 基于桌面场景的交互式个人简历网站模板，参加 Qoder 高校创造力大赛 LifeHack 赛道作品**

[在线演示](https://jxy-user.github.io/interactive-resume-template/) · [配置指南](#配置指南) · [自定义开发](#自定义开发) · [部署指南](#部署指南)

</div>

---

## ✨ 特色功能

| 功能 | 描述 |
|------|------|
| 🖥️ **桌面场景交互** | 模拟真实桌面环境，可拖拽图标、打开/关闭/最小化/最大化窗口、右键菜单 |
| 🌓 **主题系统** | 深色/浅色/跟随系统三种模式，支持自定义主色调，实时预览 |
| 🌍 **多语言支持** | 内置中英文，易于扩展更多语言 |
| 💻 **终端模拟器** | 内置命令行工具，支持 `ls`、`cat`、`whoami`、`neofetch` 等命令查看简历 |
| 🎮 **彩蛋系统** | Konami 代码、矩阵数字雨、sudo 彩蛋等隐藏功能 |
| 📱 **响应式设计** | 桌面端完整体验，移动端自动切换为列表视图 |
| 🎨 **玻璃拟态 UI** | 现代化毛玻璃效果，粒子背景、网格动画、光标跟随发光 |
| 📄 **配置驱动** | 仅修改 `public/resume-config.json` 即可完全定制简历内容，无需写代码 |
| ♿ **无障碍访问** | 语义化 HTML、键盘导航、ARIA 标签、减少动画偏好支持 |
| 🚀 **性能优化** | 静态导出、代码分割、懒加载、Lighthouse 90+ |

---

## 🖼️ 预览截图

> 请在 `public/images/` 目录下放入以下截图文件：
> - `og-image.jpg` (1200×630) - 社交媒体分享图
> - `screenshot-desktop.png` - 桌面场景截图
> - `screenshot-terminal.png` - 终端界面截图
> - `screenshot-mobile.png` - 移动端视图截图

---

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 9+ / pnpm 8+ / yarn 4+

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/jxy-user/interactive-resume-template.git
cd interactive-resume-template

# 安装依赖
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 打开 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
# 产物输出到 ./out 目录
```

### 本地预览构建产物

```bash
npx serve out
```

---

## ⚙️ 配置指南

所有简历内容通过 **单个 JSON 文件** 配置，无需修改代码：

### 核心配置文件

编辑 `public/resume-config.json`：

```json
{
  "meta": {
    "name": "你的名字",
    "title": "全栈开发工程师",
    "avatar": "/images/avatar.jpg",
    "email": "you@example.com",
    "phone": "+86 1xx-xxxx-xxxx",
    "location": "北京, 中国",
    "website": "https://yoursite.com",
    "github": "your-github",
    "linkedin": "your-linkedin",
    "twitter": "your-twitter",
    "bio": "一句话简介"
  },
  "about": {
    "summary": "详细个人简介...",
    "highlights": ["亮点1", "亮点2"],
    "skills": [
      { "category": "前端", "items": [{ "name": "React", "level": 90 }] }
    ]
  },
  "education": [...],
  "experience": [...],
  "projects": [...],
  "writing": [...],
  "theme": { "mode": "dark", "primaryColor": "#3b82f6" },
  "i18n": { "defaultLang": "zh", "supportedLangs": ["zh", "en"] }
}
```

### 配置字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `meta.name` | ✅ | 姓名 |
| `meta.title` | ✅ | 职位/标题 |
| `meta.avatar` | ✅ | 头像路径 (建议 1:1, 400×400px) |
| `meta.email` | ✅ | 邮箱 |
| `about.summary` | ✅ | 个人简介 |
| `education` | ❌ | 教育经历数组 |
| `experience` | ❌ | 工作/项目经历数组 |
| `projects` | ❌ | 作品集项目数组 |
| `writing` | ❌ | 博客文章数组 |
| `theme.mode` | ❌ | `light` / `dark` / `system` |
| `theme.primaryColor` | ❌ | 主色调 Hex 值 |
| `i18n.defaultLang` | ❌ | 默认语言 `zh` / `en` |

### 示例配置

参考 `public/resume-config.example.json` 查看完整示例配置。

---

## 🛠️ 自定义开发

### 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局、SEO、字体
│   ├── page.tsx           # 主页面 - 桌面场景
│   └── globals.css        # 全局样式、CSS 变量
├── components/
│   ├── desktop/           # 桌面系统核心组件
│   │   ├── Desktop.tsx    # 桌面主组件
│   │   ├── Window.tsx     # 窗口组件
│   │   └── DesktopIcon.tsx # 桌面图标
│   ├── apps/              # 简历板块应用 (每个窗口一个)
│   │   ├── AboutApp.tsx
│   │   ├── EducationApp.tsx
│   │   ├── ExperienceApp.tsx
│   │   ├── SkillsApp.tsx
│   │   ├── ProjectsApp.tsx
│   │   ├── WritingApp.tsx
│   │   ├── ContactApp.tsx
│   │   └── TerminalApp.tsx # 终端模拟器 ⭐
│   ├── ui/                # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── effects/           # 视觉特效
│       ├── ParticleBackground.tsx
│       ├── GridPattern.tsx
│       ├── CursorGlow.tsx
│       └── GlassCard.tsx
├── hooks/                 # 自定义 Hooks
│   ├── useTheme.ts        # 主题管理
│   ├── useConfig.ts       # 配置加载
│   ├── useI18n.ts         # 国际化
│   └── useWindow.ts       # 窗口状态管理
├── lib/                   # 工具库
│   ├── config.ts          # 默认配置、验证
│   ├── i18n.ts            # 翻译资源
│   ├── utils.ts           # 工具函数
│   └── animations.ts      # Framer Motion 预设
└── types/                 # TypeScript 类型
    ├── resume.ts          # 简历数据类型
    └── desktop.ts         # 桌面系统类型
```

### 添加新的简历板块

1. 在 `src/types/resume.ts` 添加类型定义
2. 在 `src/components/apps/` 创建新组件 `NewSectionApp.tsx`
3. 在 `src/hooks/useWindow.ts` 的 `defaultWindowConfigs` 添加窗口配置
4. 在 `src/components/desktop/Desktop.tsx` 的 `desktopIcons` 添加桌面图标
5. 在 `public/resume-config.json` 添加对应数据字段

### 添加终端命令

在 `src/components/apps/TerminalApp.tsx` 的 `COMMANDS` 对象中添加：

```typescript
mycommand: {
  name: "mycommand",
  description: "命令描述",
  usage: "<参数>",
  handler: (args, ctx) => {
    // args: 参数数组
    // ctx: { config, t, lang }
    return "命令输出内容";
  },
},
```

### 自定义主题色

修改 `public/resume-config.json` 中的 `theme.primaryColor`，或在设置面板中实时调整。

---

## 🌐 部署指南

### GitHub Pages (推荐)

1. 仓库 Settings → Pages → Source 选择 "GitHub Actions"
2. 推送到 `main` 分支自动触发部署
3. 访问 `https://username.github.io/interactive-resume-template/`

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Qoder Sites (比赛要求)

1. 在 Qoder 中打开项目
2. 点击部署到 Qoder Sites
3. 确保公开访问权限

### Netlify

```bash
# 构建命令: npm run build
# 发布目录: out
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 测试与代码质量

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format

# 运行测试 (如有)
npm test
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feat/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feat/amazing-feature`
5. 提交 Pull Request

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能
- 📝 文档改进
- 🎨 样式优化
- ♻️ 重构
- ⚡ 性能优化
- 🧪 测试

---

## 📄 许可证

MIT License © 2026 交互式简历模板团队

详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide React](https://lucide.dev/) - 图标库
- [yschen25/Interactive_Resume](https://github.com/yschen25/Interactive_Resume) - 灵感来源
- [ze3zo00/interactive-resume](https://github.com/ze3zo00/interactive-resume) - 视觉设计参考
- Qoder 高校创造力大赛 - 提供展示平台

---

## 📞 联系我们

- GitHub Issues: [提交问题](https://github.com/jxy-user/interactive-resume-template/issues)
- 邮箱: hello@example.com

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ for Qoder 高校创造力大赛

</div>