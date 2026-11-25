# 贡献指南

感谢你考虑为交互式个人简历模板做贡献！🎉

## 🚀 快速开始

1. **Fork** 本仓库
2. **克隆** 你的 Fork: `git clone https://github.com/你的用户名/interactive-resume-template.git`
3. **创建分支**: `git checkout -b feat/你的功能名` 或 `fix/修复的问题`
4. **安装依赖**: `npm install`
5. **开始开发**: `npm run dev`

## 📋 贡献类型

| 类型 | 前缀 | 示例 |
|------|------|------|
| 新功能 | `feat:` | `feat: 添加技能雷达图组件` |
| Bug 修复 | `fix:` | `fix: 修复终端命令补全失效` |
| 文档更新 | `docs:` | `docs: 更新部署指南` |
| 样式调整 | `style:` | `style: 优化深色模式对比度` |
| 重构 | `refactor:` | `refactor: 重构窗口状态管理` |
| 性能优化 | `perf:` | `perf: 懒加载简历板块组件` |
| 测试 | `test:` | `test: 添加终端命令单元测试` |
| 构建/CI | `chore:` | `chore: 更新 GitHub Actions 配置` |

## 📝 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

示例：
```
feat(terminal): 添加 matrix 彩蛋命令

- 实现矩阵数字雨动画效果
- 支持在终端中触发

Closes #123
```

## 🔧 开发规范

### 代码风格

- 使用 **TypeScript** 严格模式
- 遵循 **ESLint** + **Prettier** 配置
- 组件使用 **函数式组件** + **Hooks**
- 使用 **Tailwind CSS** 原子化类名
- 动画使用 **Framer Motion**

### 组件设计原则

1. **单一职责**: 每个组件只做一件事
2. **可复用**: 通过 props 配置而非硬编码
3. **类型安全**: 完整的 TypeScript 类型定义
4. **无障碍**: 语义化 HTML、ARIA 属性、键盘导航
5. **性能**: 合理使用 `React.memo`、`useMemo`、`useCallback`

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `DesktopIcon.tsx` |
| Hook 文件 | camelCase + use 前缀 | `useWindow.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 类型定义 | PascalCase | `ResumeConfig` |
| CSS 类名 | kebab-case (Tailwind) | `bg-primary` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_CONFIG` |

## 🧪 测试

```bash
# 运行类型检查
npm run type-check

# 运行 ESLint
npm run lint

# 运行测试 (如有)
npm test

# 构建验证
npm run build
```

**提交 PR 前请确保以上命令全部通过！**

## 📦 Pull Request 流程

1. 确保分支基于最新的 `main` 分支
2. 填写 PR 模板（会自动弹出）
3. 关联相关 Issue: `Closes #123` 或 `Relates to #123`
4. 等待 Code Review
5. 根据反馈修改
6. 通过所有检查后合并

### PR 检查清单

- [ ] 代码通过类型检查和 ESLint
- [ ] 新功能有完整的类型定义
- [ ] 组件支持深色/浅色模式
- [ ] 响应式设计正常
- [ ] 无障碍访问基本支持
- [ ] 更新了相关文档 (README/注释)
- [ ] 添加了必要的测试

## 🐛 报告 Bug

使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md) 提交 Issue，包含：

- 复现步骤
- 期望行为 vs 实际行为
- 环境信息 (OS, 浏览器, Node 版本)
- 截图/录屏 (如适用)

## 💡 功能建议

使用 [Feature Request 模板](.github/ISSUE_TEMPLATE/feature_request.md) 提交 Issue，包含：

- 问题背景
- 解决方案描述
- 替代方案
- 优先级

## 🏷️ 版本发布

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- `major`: 破坏性变更
- `minor`: 向后兼容的新功能
- `patch`: 向后兼容的 Bug 修复

发布流程由维护者执行。

## 📞 获取帮助

- 查看 [文档](README.md)
- 搜索现有 [Issues](https://github.com/jxy-user/interactive-resume-template/issues)
- 在 [Discussions](https://github.com/jxy-user/interactive-resume-template/discussions) 提问

---

再次感谢你的贡献！❤️