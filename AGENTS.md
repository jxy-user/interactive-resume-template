<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — 跨模型协作契约（本项目）

本项目可能在 Claude Code 与本机 Qoder 之间反复交接。**先读本文件，再读 `docs/SPEC.md`，最后读 `docs/STATUS.md`。**

## 项目一句话

虚构人设的交互式简历模板站，参加 2026 Qoder 高校创造力大赛 LifeHack 赛道；Next.js 16 静态导出，部署到 Qoder Sites；任何人只改 `public/resume-config.json` 即可复用。

## 角色

- **Claude Code**：视觉与交互设计、代码实现、自测。完成一个里程碑后更新 `docs/STATUS.md` 并标记“待审查”。
- **Qoder（本机）**：规格守护、代码审查、修复、Qoder Sites 部署、公网验证、提交材料起草。
- **用户**：平台账号与认证、天池论坛发布、范围与风险的最终拍板。

## 硬约束（任何模型都不得违反）

1. `public/resume-config.json` 是唯一内容源；页面正文文案不得散落在组件里，也不得在 `src/lib/config.ts` 复制一份。
2. 人设与内容全部虚构；不得出现真实姓名、电话、邮箱（仅 `example.com`）、学校、公司。
3. 不运行时调用 AI API；不引入后端、数据库、登录。
4. 不引入外部 CDN、外部字体服务；素材本地化并记录来源。
5. 不自动播放音频；支持 `prefers-reduced-motion`；375px 可用；键盘可走通主线。
6. 未经用户确认，不删除/重命名数据契约字段，不升级依赖大版本，不扩大范围。
7. Next.js 使用 `output: "export"`；不新增依赖服务端能力的路由/headers/redirects。
8. 改动范围以 `docs/SPEC.md` 为准；有冲突时先问用户，不自行扩权。

## 每次收尾必须做的事

更新 `docs/STATUS.md` 的这一段（这是下一个模型唯一的续接点）：

- 已完成（含验证命令与结果）
- 进行中
- 阻塞（含 `文件:行号` 与原因）
- 下一步（最多 3 条）
- 最后验证时间

## 审查请求格式（Claude → Qoder）

在 `docs/STATUS.md` 写清：

```
## 审查请求
- 里程碑：G1/G2/G3
- 变更摘要：
- 验证：npm run build / npx tsc --noEmit / npm test / 手工路径
- 已知问题：
```

Qoder 的结论写入 `docs/REVIEW.md`，问题用 `文件:行号` 列出，按阻断/建议分级。

## 常用命令

```
npm install
npm run dev
npm run build      # 静态导出到 out/
npm run preview    # 如无 preview，用静态服务器托管 out/
npm test
npx tsc --noEmit
npm run lint
```

## 已知构建注意

- Tailwind 自动扫描会扫到已提交的 `out/`，`globals.css` 已用 `@source not "../../out"` 排除，不要删除。
- 构建产物 `out/` 提交在仓库内用于 GitHub Pages；Qoder Sites 部署同样使用 `out/`。

## 沟通

- 语言：中文。
- 汇报要短：先给“能不能继续/能不能部署、需要用户决定什么”，细节放文档。
- 发现规格矛盾或风险，先记录到 `STATUS.md`，再向用户汇报。
