# STATUS — 滚动进度（续接点）

最后更新：2026-11-25 晚
当前阶段：G1 已修复并通过复验；等待 Claude Code 进入 G2

## 已完成

- 赛事规则梳理：LifeHack 赛道，截止 2026-11-30 18:00；需 Qoder Sites 公网链接 + 天池论坛作品帖。
- 设计确认：虚构人设 + 单一数据文件 + 纯前端，不接运行时 AI。
- 文档与实现计划落盘。
- Claude Code 提交 G1；Qoder 审查不通过（清单见 `docs/REVIEW.md`）。
- Qoder 修复 G1 P0 并通过复验：
  - 构建恢复（壁纸 `next/image` + Tailwind 排除 `out/`）。
  - 窗口生命周期（`isOpen`），首屏 0 窗口，关闭同步生效。
  - 图标按钮化 + 网格布局 + 窗口层指针放行。
  - 375px 全屏窗口、键盘焦点可见。
  - 移除启动遮罩、Google 字体；新增 Vitest 与 4 条窗口测试。
- G1 已部署到 Qoder Sites：https://interactive-resume-ne4ii85id3h.qoder.website
  - 当前访问级别：公开（2026-11-25 已切换，评委可直接访问）。
  - 站点标识：`交互式简历模板`，本地描述文件 `.交互式简历模板.qoder.site`。

## 进行中

- 无。等待 G2。

## 阻塞

- 无技术阻断。
- 流程前提：仓库内 `interactive-resume-template/docs/` 为唯一事实源；父目录 `docs/` 仅为快照。

## 下一步（最多 3 条）

1. Claude Code 执行 G2：替换完整虚构人设、消除 `defaultConfig`/JSON 双源、补齐引导与剩余模块。
2. G2 内清理 lint 26 errors、联系表单假提交、主题色变量不一致；完成后更新本文件请求审查。
3. Qoder 复验后部署 Qoder Sites（`out/`），做公网与无痕验证。

## 需要用户提供

- 作品正式名称（最晚 11/26）。
- Qoder 账号名（作品帖需要）。
- Qoder Sites 站点名偏好（部署前）。
- 把 Qoder 本次修复在本地提交并推送（未代为提交）。

## 决策记录

- 2026-11-25：赛道定为 LifeHack。
- 2026-11-25：模板形态为演示人设 + 单一数据文件，不做站内编辑器。
- 2026-11-25：不接运行时 AI。
- 2026-11-25：保留 Next.js 16 静态导出，SPEC 已同步（原 Vite 方案作废）。
- 2026-11-25：G1 P0 由 Qoder 直接修复；后续功能仍由 Claude Code 实现。
- 2026-11-25：交接文档迁入 `interactive-resume-template/`，跟随 git。

## 最后验证（2026-11-25）

- `npx tsc --noEmit`：通过。
- `npm test`：4/4 通过（`src/lib/windowState.test.ts`）。
- `npm run build`：成功，`out/` 1.2MB。
- 控制台：无报错、无 404；无 `fonts.googleapis`、无外部脚本。
- CDP 375×812：0 窗口 → 打开 1 个 375×812 窗口 → 关闭 0；Tab 聚焦图标按钮，outline 2px 实线；无横向溢出。
- 截图：`docs/screenshots/g1-desktop-1440.png`、`g1-mobile-375.png`、`g1-mobile-window-375.png`。
- Qoder Sites：发布成功（published=true，operation succeeded）；访问级别已改为 public。
- 公开访问验证：`curl` 返回 HTTP 200，标题正确；无登录态浏览器可渲染 8 个桌面图标按钮，控制台无消息。
