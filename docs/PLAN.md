# 交互式简历模板站 Implementation Plan

> **For agentic workers:** 本计划由 Claude Code 执行 Task 1–5，Qoder 执行 Task 6–8。每一步用 `- [ ]` 跟踪。每个 Task 完成先更新 `docs/STATUS.md` 再提交。

**Goal:** 交付一个虚构人设的交互式简历模板站，只改一个数据文件即可复用，部署到 Qoder Sites 参加 LifeHack 赛道。

**Architecture:** Next.js 16 App Router 静态导出（`output: "export"`）的纯前端单页应用；内容收敛到 `public/resume-config.json`；`out/` 由 Qoder Sites 托管。视觉与交互形态由 Claude Code 定稿并记录，工程侧只锁定数据契约、体验底线和验收命令。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind CSS 4、Vitest。

**Spec:** `docs/SPEC.md`（执行者必须同时阅读 `AGENTS.md` 与本计划）

> **2026-11-25 执行修订**：实际工程为既存 Next.js 16 静态导出，Task 1 已由该工程替代（Vite 脚手架命令作废）；Task 2 的数据文件改为 `public/resume-config.json` + `src/types/resume.ts`。G1 已由 Qoder 修复并复验，详见 `docs/REVIEW.md`。

## Global Constraints

- 唯一内容源：`public/resume-config.json`（类型 `src/types/resume.ts`）；页面正文文案不得散落在组件里。
- 人设虚构；禁止真实姓名、电话、身份证号；邮箱仅 `example.com`。
- 不接运行时 AI、无后端、无登录、无数据库。
- 不引入外部 CDN、外部字体服务；素材本地化。
- 不自动播放音频；支持 `prefers-reduced-motion`；375px 可用；键盘可走通主线。
- 至少 3 个可交互模块，每个有入口、有退出、无死胡同。
- 首屏资源（JS+CSS+字体+首屏图，未压缩）≤ 2MB。
- 每次收尾更新 `docs/STATUS.md`（已完成/进行中/阻塞/下一步/最后验证时间）。
- 提交截止 2026-11-30 18:00；G1 11/26、G2 11/27、G3 11/28、G4 11/29、G5 11/30 上午。

## File Structure

```
个人简历网站/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  .gitignore
  src/
    main.tsx                 # 入口
    App.tsx                  # 页面装配（薄）
    data/resume.ts           # 唯一内容源 + ResumeData 类型
    data/resume.test.ts      # 数据契约测试
    components/              # 交互模块，按设计拆分
    styles/tokens.css        # 设计令牌（颜色/间距/动效）
    styles/global.css        # 重置与全局样式
  public/                    # 本地素材
  docs/
    SPEC.md  PLAN.md  STATUS.md  REVIEW.md  SUBMISSION.md
```

---

### Task 1: 工程脚手架与构建基线

**Files:**
- Create: `index.html`、`package.json`、`tsconfig.json`、`vite.config.ts`、`src/main.tsx`、`src/App.tsx`、`.gitignore`
- Modify: `docs/STATUS.md`

**Interfaces:**
- Produces: 可运行的 Vite + React + TS 工程；`npm run dev`、`npm run build`、`npx tsc --noEmit` 可用。

- [ ] **Step 1: 初始化工程（保留已有文档）**

```bash
npm create vite@latest .scaffold -- --template react-ts
cp -R .scaffold/. .
rm -rf .scaffold
npm install
```

若 `cp` 覆盖风险文件，先确认只覆盖 Vite 生成的同名文件；`docs/`、`AGENTS.md`、`CLAUDE.md` 必须保留。

- [ ] **Step 2: 初始化 git 与忽略规则**

```bash
git init
printf 'node_modules\ndist\n.DS_Store\n*.local\n' > .gitignore
```

- [ ] **Step 3: 验证基线**

```bash
npm run build
npx tsc --noEmit
```

Expected: 两条命令均成功，无错误。

- [ ] **Step 4: 首次提交**

```bash
git add -A
git commit -m "chore: scaffold vite react ts baseline"
```

- [ ] **Step 5: 更新 STATUS**

在 `docs/STATUS.md` 勾掉脚手架、写入验证命令与日期。

---

### Task 2: 数据契约与人设数据

**Files:**
- Create: `src/data/resume.ts`、`src/data/resume.test.ts`、`vitest.config.ts`
- Modify: `package.json`（新增 `test` 脚本）

**Interfaces:**
- Produces: `export const resume: ResumeData`；类型定义与 `docs/SPEC.md` 第 5 节一致（允许只增不改的扩展字段）。

- [ ] **Step 1: 安装测试依赖并配置**

```bash
npm i -D vitest
```

`package.json` 的 `scripts` 增加：

```json
"test": "vitest run"
```

`vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node' },
});
```

- [ ] **Step 2: 先写失败测试**

`src/data/resume.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { resume } from './resume';

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((v) => collectStrings(v, out));
  }
  return out;
}

describe('resume data', () => {
  it('人设与各模块齐全', () => {
    expect(resume.persona.name.trim()).not.toBe('');
    expect(resume.persona.headline.trim()).not.toBe('');
    expect(resume.sections.about.paragraphs.length).toBeGreaterThan(0);
    expect(resume.sections.experience.length).toBeGreaterThan(0);
    expect(resume.sections.projects.length).toBeGreaterThan(0);
    expect(resume.sections.skills.length).toBeGreaterThan(0);
    expect(resume.sections.education.length).toBeGreaterThan(0);
  });

  it('不包含真实个人信息', () => {
    const strings = collectStrings(resume);
    expect(strings.some((s) => /1[3-9]\d{9}/.test(s))).toBe(false);
    expect(strings.some((s) => /\b\d{17}[\dXx]\b/.test(s))).toBe(false);
    const emails = strings.filter((s) => s.includes('@'));
    for (const email of emails) {
      expect(email).toMatch(/@example\.com$/);
    }
  });

  it('头像与封面为本地资源', () => {
    expect(resume.persona.avatar.startsWith('http')).toBe(false);
    resume.sections.projects.forEach((project) => {
      if (project.cover) expect(project.cover.startsWith('http')).toBe(false);
    });
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

```bash
npm test
```

Expected: FAIL，提示 `resume` 模块或导出不存在。

- [ ] **Step 4: 写最小实现**

`src/data/resume.ts`：按 `docs/SPEC.md` 第 5 节定义 `ResumeData` 类型，并导出一个**完整虚构人设**的 `resume` 对象。人设身份、文案与模块内容由 Claude 设计，但必须覆盖 about / experience / projects / skills / education 五个区块。

- [ ] **Step 5: 运行测试确认通过**

```bash
npm test
npx tsc --noEmit
```

Expected: 全部 PASS，类型零错误。

- [ ] **Step 6: 提交**

```bash
git add src/data vitest.config.ts package.json package-lock.json
git commit -m "feat: add typed resume data contract"
```

---

### Task 3: 设计系统与首屏（G1 交付）

**Files:**
- Create: `src/styles/tokens.css`、`src/styles/global.css`、`src/components/` 下首屏与至少一个交互模块
- Modify: `src/App.tsx`、`src/main.tsx`、`docs/STATUS.md`

**Interfaces:**
- Consumes: `resume`（Task 2）。
- Produces: G1 可演示版本——首屏 + 至少 1 个完整交互模块；设计令牌变量名在 `tokens.css` 中定义，后续模块只引用令牌。

- [ ] **Step 1: 定稿设计方向**

Claude 决定视觉与交互形态（例如桌面/叙事/其他），并在 `docs/STATUS.md` 记 3–5 行：形态、主色、字体策略、3 个核心模块的入口与退出方式。**这一条必须在写组件前完成。**

- [ ] **Step 2: 写令牌与全局样式**

`tokens.css` 至少包含颜色、间距、圆角、字号、动效时长变量；`global.css` 负责 reset、焦点可见样式与 `prefers-reduced-motion` 基础降级。

- [ ] **Step 3: 首屏**

用 `resume.persona` 渲染：姓名/呼号、headline、status、tags、头像或主视觉。要求 10 秒内说清"这是谁的什么"。

- [ ] **Step 4: 第一个完整交互模块**

自主选取一个内容区块实现完整交互，必须具备可见入口与可见退出，Esc 可关闭浮层（若有），键盘可触发。

- [ ] **Step 5: 验证 G1**

```bash
npm run build
npx tsc --noEmit
npm test
npm run dev
```

浏览器检查：首屏无报错、首屏文案正确、交互可进可出、375px 无横向滚动。

- [ ] **Step 6: 提交并请求审查**

```bash
git add -A
git commit -m "feat: design system and first playable screen"
```

在 `docs/STATUS.md` 写"审查请求（G1）"，列出变更、验证结果、已知问题。

---

### Task 4: 全部模块与内容整合（G2 交付）

**Files:**
- Create: `src/components/` 下其余模块
- Modify: `src/App.tsx`、`docs/STATUS.md`

**Interfaces:**
- Consumes: `resume`、`tokens.css`。
- Produces: 至少 3 个可交互模块 + 全部内容区块可访问；每个模块有入口与退出。

- [ ] **Step 1: 列出模块清单**

在 `docs/STATUS.md` 写清最终模块列表（模块名 / 对应数据区块 / 入口 / 退出）。不得少于 3 个交互模块。

- [ ] **Step 2: 逐模块实现**

每个模块一个提交；每个模块必须满足 Global Constraints 的入口/退出/键盘要求。组件只读 `resume`，不内联正文。

- [ ] **Step 3: 首次访问引导**

不超过 3 步，可跳过；不阻塞主线。

- [ ] **Step 4: 验证 G2**

```bash
npm run build
npx tsc --noEmit
npm test
```

浏览器逐模块检查：入口可见、可退出、无死胡同、控制台无报错。

- [ ] **Step 5: 提交并请求审查**

```bash
git add -A
git commit -m "feat: complete interactive modules"
```

`docs/STATUS.md` 写"审查请求（G2）"。

---

### Task 5: 移动端、键盘与动效降级

**Files:**
- Modify: `src/styles/global.css`、`src/styles/tokens.css`、相关组件、`docs/STATUS.md`

**Interfaces:**
- Produces: 375px 可用、键盘走通主线、减弱动效生效。

- [ ] **Step 1: 375px 检查**

DevTools 设 375×812，逐模块检查：无横向滚动、按钮可点、浮层不超出视口。

- [ ] **Step 2: 键盘检查**

只用 Tab / Shift+Tab / Enter / Space / Esc 走完主线；焦点环必须可见；Esc 关闭浮层。

- [ ] **Step 3: 减弱动效**

在 DevTools 开启 `prefers-reduced-motion: reduce`，确认无非必要动画、无因动画缺失导致的内容不可见。

- [ ] **Step 4: 性能核对**

```bash
npm run build
du -sh dist/assets
```

首屏资源合计 ≤ 2MB；超出则压缩图片或延后加载非首屏模块。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "fix: mobile keyboard and reduced motion"
```

---

### Task 6: Qoder 审查与修复（G3）

**Files:**
- Modify: `docs/REVIEW.md`、`docs/STATUS.md`、按问题清单修改源码

**Interfaces:**
- Consumes: G2 版本；`docs/REVIEW.md` 清单。
- Produces: 审查结论"可继续"或分级问题清单，阻断项清零。

- [ ] **Step 1: 静态核对**

```bash
npm run build
npx tsc --noEmit
npm test
grep -RInE 'https?://(fonts|cdn|unpkg|jsdelivr)' src public index.html
```

Expected: 构建/类型/测试全绿；grep 无外部 CDN 命中。

- [ ] **Step 2: 浏览器实测**

启动 `npm run dev` 与 `npm run preview`，按 `docs/REVIEW.md` 清单逐项检查并截图；截图存 `docs/screenshots/`。

- [ ] **Step 3: 写审查结论**

`docs/REVIEW.md` 追加本轮记录：结论、阻断项（`文件:行号`）、建议项、证据。

- [ ] **Step 4: 修复与复查**

阻断项修复后重跑 Step 1–2；全部清零才进入 G4。

---

### Task 7: 部署与公网验证（G4）

**Files:**
- Modify: `docs/STATUS.md`、`docs/SUBMISSION.md`

**Interfaces:**
- Consumes: G3 通过的 `dist`。
- Produces: Qoder Sites 公网链接；无痕窗口可访问；移动端截图。

- [ ] **Step 1: 构建产物**

```bash
npm run build
```

- [ ] **Step 2: Qoder 执行 Sites 部署**

由 Qoder 在本机会话调用 Qoder Sites 工具完成 prepare/publish；站点名与作品名一致；把 siteId、链接、时间写入 `docs/STATUS.md` 与 `docs/SUBMISSION.md`。

- [ ] **Step 3: 公网验证**

无痕窗口打开链接：首屏、3 个交互、刷新、移动端视口、控制台逐项检查；若使用非 Hash 路由，额外直达深层链接验证。

- [ ] **Step 4: 截图归档**

桌面与移动端各至少 2 张，存 `docs/screenshots/`，确认无真实个人信息。

---

### Task 8: 最终回归与提交材料（G5）

**Files:**
- Modify: `docs/SUBMISSION.md`、`docs/STATUS.md`

**Interfaces:**
- Consumes: G4 公网链接。
- Produces: 可发布的作品帖全文；提交 checklist 全部勾选。

- [ ] **Step 1: 最终回归**

公网链接重新走一遍主路径；`npm run build`、`npx tsc --noEmit`、`npm test` 再跑一次并记录。

- [ ] **Step 2: 补全作品帖**

填齐 `docs/SUBMISSION.md`：正式名、Qoder 账号、公网链接、自我介绍、为什么做、怎么用（≤5 步）、怎么用 Qoder 做出来（如实写分工）、素材来源。

- [ ] **Step 3: 用户发布与提交**

用户在天池论坛发布，标题含【LifeHack】，并完成报名/认证/提交；发布后把链接回填 `docs/SUBMISSION.md`。

- [ ] **Step 4: 收尾**

`docs/STATUS.md` 标记完成；记录发布日期与最终链接。

---

## Self-Review

- 规格覆盖：范围/数据契约/体验底线/隐私/性能/部署/提交均有对应 Task；设计留白是用户明确授权的决策，已在 Task 3 Step 1 要求记录。
- 占位符：仅 `docs/SUBMISSION.md` 保留"待填"，属于提交阶段由用户提供的信息，非计划缺口。
- 一致性：`ResumeData` 字段、命令、脚本名在各 Task 中一致；部署与审查的负责人明确。
