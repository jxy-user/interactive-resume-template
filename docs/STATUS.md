# STATUS — 滚动进度（续接点）

最后更新：2026-11-25 夜
当前阶段：主页已推倒重做为「策展式展览」；视觉系统重建完成；待截图验收与部署

## 本次重设计（2026-11-25）

用户判定旧「桌面图标 + 窗口 + 3D 几何体」设计简陋、emoji 廉价，授权**推倒重做**。

设计方向：**一个人的博物馆 · 策展式纵向展览**（纯 2D 编辑排版驱动）

- 摒弃桌面窗口模拟与几何体 3D 作为主体验。
- 六段式展览：入口 → I 陈述 → II 编年 → III 馆藏 → IV 材料 → V 出口。
- 视觉令牌：暖墨 ink / 灰泥 plaster / 铜 bronze / 石青 verdigris / 聚光 spotlight。
- 字体：标题衬线（Georgia + 宋体栈）+ 正文无衬线 + 编号等宽。
- 动效：framer-motion `whileInView`「感应点亮」，尊重 `prefers-reduced-motion`。
- 全站 emoji 归零，统一 Lucide 线条图标。

## 已完成（本次）

- 重写 `src/app/globals.css`：博物馆色板、展柜直角、`font-display` / `font-plaque`。
- 新建 `src/lib/windowIcons.tsx` 统一图标；删除 emoji 映射 `icons.tsx`。
- 新建 `src/components/exhibition/Exhibition.tsx` 策展式主页。
- 重写 `src/app/page.tsx`、`src/app/layout.tsx`（修正 `overflow-hidden` 阻断滚动、更新元信息）。
- 新建 `src/lib/resumeData.ts`（构建时内联，消除首屏占位闪烁）。
- 消除数据双源：删除 `src/lib/config.ts` 的 `defaultConfig`；`useConfig` 改用 `resumeData`。
- 完整虚构人设写入 `public/resume-config.json`（林知远 / 创意技术开发者）。
- 旧 apps 的 emoji 与玻璃卡样式统一清理为展柜卡；`ContactApp` 表单改为 `mailto`（静态站无后端）。
- 3D 展厅配色由荧光蓝紫改为铜/石青；`AboutHall` emoji→Lucide。
- `npm run build` 成功（`/`、`/museum`、`/_not-found` 静态导出）；`npx tsc --noEmit` 零错误。

## 进行中

- Playwright Chromium 安装中，准备 1440 / 375 截图验收。
- 旧桌面 / 窗口 / museum 组件是否保留：`/museum` 仍在，主页已不再引用桌面系统。

## 阻塞

- 无发布阻断。

## 下一步（最多 3 条）

1. 截图验收（1440 桌面 / 375 移动），修正视觉问题。
2. 决定 `/museum` 3D 页去留（保留为附加展厅或移除）。
3. `npm run build` 后交 Qoder 审查并部署 Qoder Sites、公网验证。

## 需要用户提供

- ~~正式作品名~~：已定 **《此人在展》**（英文 On Display；副题「一个人的博物馆式简历」）。
- ~~Qoder 账号名~~：**Jxy**。
- Qoder Sites 站点名偏好（部署前）；建议 `cirenzaizhan` 或 `on-display`。

## 决策记录

- 2026-11-25：赛道 LifeHack；保留 Next.js 16 静态导出。
- 2026-11-25：用户授权推倒重做主页；主体验改为策展式 2D 排版，桌面/3D 降级。
- 2026-11-25：内容唯一源仍为 `public/resume-config.json`，改为构建时 import，删除 `defaultConfig` 双源。
- 2026-11-25：作品名定为 **《此人在展》**（On Display）；用户账号 **Jxy**。
- 2026-11-25：首屏「再加一层」——古典拱门线稿 + 顶部聚光 + 展签信息条（展品/媒介/年份）。

## 最后验证（2026-11-25 夜）

- `npx tsc --noEmit`：零错误。
- `npm test`：6/6 通过。
- `npm run build`：成功；路由仅 `/` 与 `/_not-found`；`out/` 已重建，无 `museum` 残留。
- Playwright 截图：`docs/screenshots/exhibition-1440.png`、`exhibition-375.png`、`exhibition-hero-1440.png`。
- 视觉核对：暖墨展厅背景生效；全站零 emoji；无粉紫渐变；首屏巨大宋体衬线馆名 + 铜色导视编号。
- 关键修复：
  - Tailwind v4 的 `@theme` 颜色必须为完整 `hsl()` 值（HSL 分量会导致 `bg-*`/`text-*` 全部失效、背景变白）。
  - CSS 注释中 `bg-*/` 的 `*/` 会提前闭合注释导致整表解析失败，已规避。

## 交接说明

- 主站为 `src/components/exhibition/Exhibition.tsx` + `src/app/page.tsx`。
- 旧桌面/窗口/3D 组件（`src/components/desktop`、`apps`、`museum`）已不在任何路由中引用，属死代码；保留以维持 `npm test` 与类型稳定，后续可整体移除并同步精简依赖。`/museum` 路由已删除。
