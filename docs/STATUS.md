# STATUS — 滚动进度（续接点）

最后更新：2026-11-25 夜
当前阶段：G3 横向长廊视觉精修已审查并发布；旧 `/museum` 路由回退到首页

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
- `npm run build` 成功（`/`、`/_not-found` 静态导出）；`npx tsc --noEmit` 零错误。
- Qoder 完成 1440/375 截图与运行时验收，并发布到现有站点（public）。
- 验证证据：无控制台错误/4xx/外部资源；375 无横向溢出；减弱动效下 6 段可见；线上标题与首页内容正确。
- G3（`60804c7`）：新增 Artwork SVG 插画、纵向滚动驱动横向长廊、底部六段导览；Qoder 审查通过并发布，线上已生效。

## 进行中

- 无，发布完成。等待用户决定旧 `/museum` 与 GitHub 链接处理。

## 阻塞

- 无发布阻断。
- **合规待决**：虚构人设 GitHub 链接 `https://github.com/linzhiyuan` 实际存在（HTTP 200），指向真实账号；最终提交前建议改为示例账号或移除。

## 下一步（最多 3 条）

1. 用户确认后，把 JSON 中 GitHub 链接改为不存在的示例账号或移除。
2. 移动端入口排版收口：标题「林知远」在 375px 断成两行，底部导览标签竖排；建议进入 G4 前优化。
3. 清理 lint 38 errors；决定是否删除旧 museum 组件与 three/R3F 依赖（当前未打包）。

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

## 二次调整：暖光画廊（2026-11-25 深夜）

用户要求：做成「游历画廊」、暖色调、可用动漫风格。已将暗色策展版改为**暖光画廊漫游**：

- 色板：奶油墙 `#f4e7cf`、暖沙 `#e8d3b0`、陶土 `#c97b5a`、赭金 `#c99a4e`、暮橙 `#e8a87c`、深棕墨 `#4a342a`（不用纯黑）。
- 入口：暖光拱形门洞 + 黄昏山野 + 站在光里的简笔人物剪影。
- I 自画像（画框 + 陈述 + 档案）、II 年表（挂画长廊）、III 展厅（错落大画框）、IV 材料样品墙、V 出口暖光。
- 新建 `src/components/exhibition/Artwork.tsx`：程序生成的暖色风景插画（黎明/暮色/城市/海/林/月 6 种变体），纯 SVG 无外部素材。
- 氛围：漂浮光点、纸纹颗粒、暖光渐变。
- 移动端门洞高度收小（`h-[44vh] md:h-[58vh]`）。
- 验收：`npx tsc --noEmit` 零错误；`npm run build` 成功；截图 `gallery-hero-1440.png`、`gallery-hero-375.png`、`gallery-1440.png`。

## 三次调整：横向画廊长廊（2026-11-25 深夜）

用户要求：更「游历」——横向画廊长廊，滚轮推着沿墙走；移动端暂不做。已实现：

- 滚动驱动横向平移：`framer-motion` 的 `useScroll` + `useTransform`，外层高容器 `height: 100vh + 横向总宽`，`sticky` 视口内 `track` 随 `scrollYProgress` 横向位移。原生滚动、无 scroll-jacking，键盘/触控板均可。
- 12 面展墙横向排列：入口 → 自画像 → 年表 ×3（每段经历/教育一墙）→ 展厅 ×5（每个项目一墙）→ 材料 → 出口。
- 底部导览：6 个分区按钮，点击 `scrollTo` 精确对齐该区首墙（`scrollY == wall.offsetLeft` 推导）。
- 深链：`#wall-N` 直达第 N 面墙。
- 移动端暂不专门适配（横向仍可用，未做精细优化）。
- 验收：`tsc` 零错误、`build` 成功；截图 `lane-0-entrance.png`、`lane-1-portrait.png`、`lane-5-gallery.png`、`lane-10-materials.png`（横向平移与墙对齐正确）。

## 四次调整：亮色调（2026-11-25 深夜）

用户要求：整体亮色调，不用暗色调。已调亮：

- 背景 `#f4e7cf → #fbf3e4`；文字 `#4a342a → #5a4436`（中深棕，保证可读）；边框/边线改浅（`#e8d3b0`）。
- 画作全部调亮：山体/城市/树由深棕改为浅赭浅棕（`#c89464/#c89a6e/#c88c5a`），天空更亮，云更白。
- 入口门洞渐变调亮；背景暖光、纸纹减弱。
- 验收：`build` 成功；截图 `bright-0-entrance.png`、`bright-5-gallery.png`。

## 五次调整：手绘素描 3D 走廊（CSS 3D + SVG，2026-11-26）

用户提供 ITOM 项目视频，确认要「白色手绘素描 3D 走廊」风格。按用户选择走 CSS 3D + SVG 手绘（非 WebGL）。已实现 MVP：

- 新建 `src/components/sketch/`：
  - `primitives.tsx`：纸纹、手绘云、弯曲箭头、木牌、门、彩色贴纸。
  - `Corridor.tsx`：SVG 一点透视走廊（天花板/左右墙/木地板/远处光洞），左门 `THE GALLERY`、右门 `THE STUDIO`、尽头 `ABOUT` 光洞、底部 `CONTACT` 木牌，均可点击进入。
  - `Rooms.tsx`：Gallery（黑白墨稿画框 + 展签）、Studio（技能）、About（手绘围巾少年 + 简介 + 时间轴）、Contact（手绘卡片 + 木牌）。
  - `SketchWorld.tsx`：场景状态 + `AnimatePresence` 过渡；`?room=gallery` 深链。
- 色板改为纸白 `#f7f5ef` + 铅笔黑 `#2b2a26`，黑白 + 彩色贴纸焦点，手写楷体（`font-hand`）。
- 主页 `page.tsx` → `SketchWorld`。
- 验收：`tsc` 零错误、`build` 成功；截图 `sketch-corridor.png`、`sketch-gallery.png`、`sketch-about.png`、`sketch-contact.png`。

## 打磨完成（2026-11-26）

- 走廊门：加木纹横线、门框双线、门缝透光竖条、踢脚线、更精致把手。
- 展廊墨稿：6 种图案变体（同心圆/波浪山/柱状/螺旋/花瓣/星点），避免雷同；画框 hover 有「上色」渐变（呼应 ITOM 招牌）。
- 关于页人物：细化头发、笑脸（眼/嘴）、围巾（含飘带）、大衣翻领与扣子、手、腿。
- 键盘可达：三扇门与光洞均 `role=button/tabIndex/onKeyDown`（Enter/Space）；返回、联系均 button/a。
- 移动端：竖屏加「建议横屏/电脑浏览」提示；房间为响应式网格。
- 验收：`tsc` 零错误、`build` 成功；截图 `sketch2-corridor.png`、`sketch2-gallery.png`、`sketch2-about.png`。

## 剩余可选项

1. 走廊竖屏专门适配（当前仅提示）。
2. 门后转场动画（镜头推进）可加强「走进去」感。
3. 可选音效开关（ITOM 有 audio toggle）。
