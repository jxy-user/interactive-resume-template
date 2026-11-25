# REVIEW — Qoder 审查记录

每轮审查追加一节，结论先行：**可继续 / 需修复后复查**。问题标 `文件:行号`，分阻断与建议。

## 审查清单

### 构建与运行

- [ ] `npm install` 无异常
- [ ] `npm run build` 成功
- [ ] `npx tsc --noEmit` 零错误
- [ ] 控制台无报错/警告（含资源 404）
- [ ] 刷新、深链直达、返回不白屏

### 内容与数据

- [ ] 页面正文全部来自 `src/data/resume.ts`
- [ ] 人设虚构，无真实 PII
- [ ] 无外链 CDN、外链字体
- [ ] 素材来源已记录

### 体验底线

- [ ] 首屏 10 秒说清"这是谁的什么"
- [ ] 每个交互有入口与退出，无死胡同
- [ ] 首次引导 ≤ 3 步且可跳过
- [ ] 375px 无横向滚动，主模块可用
- [ ] 键盘可走通主线，焦点可见，Esc 可关浮层
- [ ] `prefers-reduced-motion` 下无非必要动画
- [ ] 无自动播放音频

### 性能与部署

- [ ] 首屏资源 ≤ 2MB，LCP 目标 < 2.5s
- [ ] Qoder Sites 公网链接无痕窗口可访问
- [ ] 移动端真机/模拟器截图与设计一致

## 审查记录

### 2026-11-25 — 规格阶段

- 结论：规格通过，待实现。
- 阻断：无。

### 2026-11-25 — G1 审查

- 结论：**不通过，需修复后复查。**
- 审查对象：`interactive-resume-template/`，commit `5978e59`（G1）及 `3796f0c`（提交 out/）。

客观验证：

| 命令 | 结果 |
| --- | --- |
| `npx tsc --noEmit` | 通过（exit 0） |
| `npm run build` | **失败**：`src/app/globals.css` 解析 `/images/wallpaper.jpg` 时 Module not found |
| `npm run lint` | **27 errors / 50 warnings**（`any`、effect 内 setState、变量先用后声明等） |
| 运行时（静态服务 `out/`） | 首屏同时渲染 8 个窗口；关闭按钮点击后窗口仍存在；控制台 3 条 404（wallpaper.jpg ×1、project-resume.jpg ×2） |

#### 阻断问题（P0）

1. **构建失败，无法部署**：`src/components/desktop/Desktop.tsx:83` 引用 `/images/wallpaper.jpg`，`public/images/` 下只有 `wallpaper.svg`；`src/lib/config.ts:89` 引用 `/images/project-resume.jpg`（JSON 中已改为 svg），`src/app/layout.tsx:35,46` 引用 `/images/og-image.jpg`，`:74` 引用 `/apple-touch-icon.png`，均不存在。
2. **首屏 8 个窗口全部打开**：`src/hooks/useWindow.ts:104-113` 初始状态所有窗口 `isMinimized: false`；`src/components/desktop/Desktop.tsx:101-139` 对所有窗口无条件渲染，没有"是否打开"状态。
3. **关闭按钮无效**：`src/hooks/useWindow.ts:147-150` 只把 `isActive` 置 false，渲染层不读取该字段，窗口不会消失。
4. **桌面图标被窗口层完全遮挡**：图标容器 `Desktop.tsx:87` 为 `z-20`，窗口容器 `Desktop.tsx:99` 为覆盖整屏的 `z-30`，且无 `pointer-events` 放行，图标实际不可点击。
5. **桌面图标键盘不可达**：`src/components/desktop/DesktopIcon.tsx:32-44` 是带 `onClick` 的 `div`，无 `role`、`tabIndex`、`onKeyDown`。
6. **375px 必然溢出**：`Desktop.tsx:12-21` 图标横坐标 40–1020；`useWindow.ts:21-102` 窗口最小宽度 450–950，均大于 375；无任何移动端布局分支。
7. **外链字体服务**：`src/app/layout.tsx:2,5-13` 使用 `next/font/google` 拉取 Geist，`:70-71` 预连接 `fonts.googleapis.com`，违反"不引入外部字体服务"。
8. **联系表单是假提交**：`src/components/apps/ContactApp.tsx:24-37` 延迟 1 秒后直接显示成功并 `console.log`，实际没有发送任何内容，属于误导性交互。
9. **数据契约未落地**：内容源是 `public/resume-config.json`，且 `src/lib/config.ts:6-112` 又复制了一份带占位文案的 `defaultConfig`，形成双源；演示内容是"你的名字 / yoursite.com / your-github-username"，不是完整虚构人设。
10. **规格偏离未报备**：技术栈为 Next.js 16 静态导出（`package.json`），与 `docs/SPEC.md` 的 Vite + React 不一致；代码在子目录、根 `docs/STATUS.md` 未更新、`AGENTS.md` 被 Next 自动文件覆盖，导致交接失效。

#### 建议问题（P1）

- `src/app/globals.css:106-112` 的 `:focus-visible` 使用了 `ring`、`ring-color` 等非 CSS 属性，焦点样式实际不生效。
- `src/app/page.tsx:17-27` 在渲染体内直接改 `document`；`:45-66` 启动遮罩永不卸载。
- `src/hooks/useTheme.ts:56-62` `parseInt(result[n], 10)` 解析十六进制错误；`--primary` 与 Tailwind 的 `--color-primary` 变量不一致，`primaryColor` 实际不生效。
- 每个 App 各自 `useConfig()`（`AboutApp.tsx:12` 等），首屏重复请求配置并先闪现占位文案。
- `next.config.ts:52-80` 的 headers/redirects 在 `output: export` 下无效，构建有警告。
- 无任何自动化测试（计划 Task 2 未执行）。
- `public/resume-config.example.json` 使用真实公司/品牌链接作为示例，建议改为纯虚构。

#### 复验要求

- `npm run build`、`npx tsc --noEmit`、`npm run lint` 全绿或 lint 有明确豁免。
- 首屏只显示桌面图标，0 个窗口；点图标开窗、关闭后消失、可再次打开。
- 375px 下图标与窗口均可用。
- 构建产物无 404，无外部字体/资源请求。
- 更新 `docs/STATUS.md` 后重新提交审查。

### 2026-11-25 — G1 修复复验（Qoder）

- 结论：**P0 通过，可进入 G2。**
- 修复内容：
  - 壁纸改用 `next/image` 加载本地 svg，并让 Tailwind 排除 `out/`（`src/app/globals.css:2`），构建恢复。
  - 窗口增加 `isOpen` 生命周期：新增 `src/lib/windowState.ts`、`src/lib/windowConfigs.ts`，`useWindow.ts` 接入；关闭改为同步移除，去掉依赖 rAF 的退出动画。
  - 图标改为 `<button>`、网格布局（`DesktopIcon.tsx`、`Desktop.tsx:87`），窗口层 `pointer-events-none` + 窗口 `pointer-events-auto`。
  - 新增 `useIsMobile`，小屏窗口占满视口并禁用拖拽/缩放。
  - 移除启动遮罩与渲染期 DOM 副作用（`src/app/page.tsx`）；移除 Google 字体（`src/app/layout.tsx`、`globals.css` 系统字体栈）。
  - 修复 `:focus-visible` 无效属性；补 Vitest 与 4 条窗口生命周期测试。
- 复验证据（2026-11-25）：
  - `npx tsc --noEmit` 通过；`npm test` 4/4 通过；`npm run build` 成功；`out/` 1.2MB。
  - 静态产物无 404、无 `fonts.googleapis` 外链、无外部脚本；控制台无消息。
  - 1440×900 与 375×812 截图：首屏仅图标，无溢出。
  - CDP 实测 375px：初始 0 窗口 → 点击图标 1 窗口（375×812）→ 关闭 0 窗口；Tab 焦点落在图标按钮，`outline: solid 2px`。
- 遗留（转 G2，不阻断）：
  - `npm run lint` 仍有 26 errors / 48 warnings（`any`、effect 内 setState 等），G2 内清理。
  - 演示数据仍是"你的名字"等占位，且 `src/lib/config.ts` 与 JSON 双源；G2 必须换成完整虚构人设并消除双源。
  - 联系表单为模拟提交（`ContactApp.tsx:24-37`），G2 改为 mailto 或明确示例。
  - 主题色变量 `--primary` 与 Tailwind `--color-primary` 不一致；最小化按钮已移除，任务栏/恢复能力留待 G2。

### 2026-11-25 — G2 提交审查

- 结论：**不通过，不发布。该提交不含 G2 内容。**
- 证据：
  - `git diff 310fd34 0c9f958 -- src public` 仅包含 G1 修复（窗口/图标/移动端/构建/字体）与新增文档，无内容、引导或模块改动。
  - `public/resume-config.json` 仍是「你的名字 / yoursite.com / your-github-username」占位。
  - `src/lib/config.ts` 仍复制整份 `defaultConfig`，双源未消除。
  - `src/components/apps/ContactApp.tsx:24-37` 仍为 1 秒后直接显示成功的模拟提交。
  - 线上 `/_next/static/*` 与本地 `out/` 哈希完全一致，说明线上已是当前构建，重复发布会是空发布。
- G2 必须补齐：完整虚构人设、单源数据、首次引导（≤3 步可跳过）、各模块入口/退出、lint 26 errors、表单与主题色问题；完成后更新 `STATUS.md` 请求审查。

### 2026-11-25 — 3D 数字展厅审查与发布

- 结论：**修复两个阻断项后通过，已发布到现有站点（public）。**
- 发现：
  - 技能星座把配置里的 `{name, level}` 对象直接当 React 子节点渲染，进入展厅后连续抛 React #31（根因 `SkillsConstellation.tsx:55-59`，渲染点 `:306`）。
  - 桌面内嵌展厅的根容器为 `fixed inset-0`，canvas 覆盖窗口标题栏，关闭按钮不可点（`MuseumScene.tsx:30`）。
- 修复（Qoder）：
  - 新增 `src/lib/museumSkills.ts` 归一化技能名，`SkillsConstellation` 改用 `getSkillName()`；新增 2 条单测。
  - `MuseumScene` 改为 `absolute inset-0`，加载层与底部导航同步改 absolute，展厅被约束在窗口内容区。
- 验证：
  - `npm test` 6/6；`npx tsc --noEmit` 通过；`npm run build` 成功，`out/` 2.3MB（首屏 811KB，3D 包按需加载）。
  - 本地 1440/375：桌面内嵌展厅关闭按钮可点、关闭归零；`/museum` 可进入，canvas 全屏；React 异常 0；375px 无横向溢出，底部 4 个展厅按钮可用。
  - 线上：首页与 `/museum/` 均 HTTP 200；museum 资源哈希已更新；无登录态访问正常，React 异常 0。
- 遗留（不阻断发布）：
  - lint 39 errors。
  - 展厅内仍有硬编码展示文案，未完全走 `public/resume-config.json` 单源。
  - 3D 动画尚未处理 `prefers-reduced-motion`。
  - G2 内容占位仍未替换。

### 2026-11-25 — 「3D效果2」提交审查

- 结论：**不含新的 3D 效果，不发布。**
- 证据：`git diff bce82cd c462406 -- src` 仅 4 个文件，均为 Qoder 上一轮修复（技能名归一化 + 展厅 absolute 定位），其余为 `out/` 重建；线上 `/museum` 已是同功能版本。
- 验证：`npx tsc --noEmit` 通过；`npm test` 6/6 通过。
- 要求：Claude 明确「3D效果2」的具体目标并实际实现；完成后更新 `STATUS.md` 请求审查。

### 2026-11-25 — 「版本大改」审查与发布

- 结论：**通过并已发布。**
- 范围：主页推倒重做为六段式策展展览；虚构人设写入 JSON；删除 `defaultConfig` 双源；联系表单改 mailto；全站去 emoji、去外部字体；旧桌面/窗口不作为主体验。
- 验证：
  - `npx tsc --noEmit` 通过；`npm test` 6/6；`npm run build` 成功，`out/` 1.1MB。
  - 1440 / 375：六段展陈完整，人设「林知远」正确，无占位文案；无控制台错误、无 4xx、无外部资源；375px 无横向溢出；`prefers-reduced-motion` 生效且内容可见。
  - 线上：HTTP 200，标题「此人在展 · 一个人的博物馆式简历」；旧 `/museum` 返回首页（SPA 回退）。
- 遗留：
  - `https://github.com/linzhiyuan` 实际存在（HTTP 200），虚构人设链接到真实账号，建议最终提交前替换。
  - lint 38 errors；旧 museum 组件与 three/R3F 依赖仍在仓库但未打包。
  - 项目「代码/预览」链接多为 `example.com` 占位。
