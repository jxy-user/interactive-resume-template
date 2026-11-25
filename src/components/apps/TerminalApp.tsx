"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useConfig } from "@/hooks/useConfig";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Command {
  name: string;
  description: string;
  usage?: string;
  handler: (args: string[], ctx: TerminalContext) => string | Promise<string>;
}

interface TerminalContext {
  config: any;
  t: (key: string) => string;
  lang: "zh" | "en";
}

interface TerminalLine {
  type: "input" | "output" | "error" | "welcome" | "help";
  content: string;
  prompt?: string;
}

const COMMANDS: Record<string, Command> = {
  help: {
    name: "help",
    description: "显示可用命令列表",
    handler: (_, ctx) => {
      const lines = [
        "可用命令:",
        "",
        ...Object.values(COMMANDS).map((cmd) => {
          const usage = cmd.usage ? ` ${cmd.usage}` : "";
          return `  ${cmd.name.padEnd(12)} ${cmd.description}${usage}`;
        }),
        "",
        "提示: 使用 Tab 键自动补全，上/下箭头查看历史记录",
      ];
      return lines.join("\n");
    },
  },
  ls: {
    name: "ls",
    description: "列出简历板块",
    usage: "[section]",
    handler: (args, ctx) => {
      const sections = [
        { name: "about", title: "关于我", desc: "个人简介、技能标签云" },
        { name: "education", title: "教育经历", desc: "时间轴式教育经历" },
        { name: "experience", title: "工作经历", desc: "项目卡片、技术栈" },
        { name: "skills", title: "技能专长", desc: "技能雷达图、熟练度" },
        { name: "projects", title: "项目作品集", desc: "图片网格、模态框预览" },
        { name: "writing", title: "博客文章", desc: "文章列表、标签筛选" },
        { name: "contact", title: "联系我", desc: "表单、社交链接" },
      ];

      if (args.length > 0) {
        const section = sections.find((s) => s.name === args[0]);
        if (section) {
          return `${section.name}  -  ${section.title}\n${section.desc}`;
        }
        return `未找到板块: ${args[0]}\n使用 'ls' 查看所有板块`;
      }

      const lines = ["简历板块:", ""];
      sections.forEach((s) => {
        lines.push(`  ${s.name.padEnd(14)} ${s.title.padEnd(10)} ${s.desc}`);
      });
      return lines.join("\n");
    },
  },
  cat: {
    name: "cat",
    description: "查看板块内容",
    usage: "<section>",
    handler: (args, ctx) => {
      if (args.length === 0) return "用法: cat <section>";

      const section = args[0];
      const { config } = ctx;

      switch (section) {
        case "about":
          return [
            `姓名: ${config.meta.name}`,
            `职位: ${config.meta.title}`,
            `邮箱: ${config.meta.email}`,
            `地点: ${config.meta.location || "未设置"}`,
            `网站: ${config.meta.website || "未设置"}`,
            `GitHub: ${config.meta.github ? `https://github.com/${config.meta.github}` : "未设置"}`,
            "",
            "个人简介:",
            config.about?.summary || "未填写",
            "",
            "亮点:",
            ...(config.about?.highlights?.map((h: string) => `  • ${h}`) || ["  (无)"]),
          ].join("\n");

        case "education":
          if (!config.education?.length) return "暂无教育经历";
          return config.education
            .map(
              (edu: any, i: number) =>
                `${i + 1}. ${edu.school} - ${edu.degree} ${edu.major}\n   ${edu.startDate} - ${edu.endDate}\n   ${edu.description || ""}`
            )
            .join("\n\n");

        case "experience":
          if (!config.experience?.length) return "暂无工作经历";
          return config.experience
            .map(
              (exp: any, i: number) =>
                `${i + 1}. ${exp.company} - ${exp.position}\n   ${exp.startDate} - ${exp.endDate || "至今"}\n   ${exp.description?.join("\n   ") || ""}\n   技术栈: ${exp.technologies?.join(", ") || "无"}`
            )
            .join("\n\n");

        case "skills":
          if (!config.about?.skills?.length) return "暂无技能数据";
          return config.about.skills
            .map(
              (cat: any) =>
                `${cat.category}:\n  ${cat.items.map((s: any) => `${s.name}${s.level ? ` (${s.level}%)` : ""}`).join(", ")}`
            )
            .join("\n\n");

        case "projects":
          if (!config.projects?.length) return "暂无项目数据";
          return config.projects
            .map(
              (proj: any, i: number) =>
                `${i + 1}. ${proj.name}${proj.featured ? " [置顶]" : ""}\n   ${proj.description}\n   技术: ${proj.technologies?.join(", ") || "无"}\n   GitHub: ${proj.github || "无"}\n   预览: ${proj.url || "无"}`
            )
            .join("\n\n");

        case "writing":
          if (!config.writing?.length) return "暂无文章数据";
          return config.writing
            .map(
              (art: any, i: number) =>
                `${i + 1}. ${art.title}\n   ${art.date} | ${art.tags?.join(", ") || "无标签"}\n   ${art.description || ""}\n   链接: ${art.url}`
            )
            .join("\n\n");

        case "contact":
          return [
            `邮箱: ${config.meta.email}`,
            `电话: ${config.meta.phone || "未设置"}`,
            `地点: ${config.meta.location || "未设置"}`,
            `网站: ${config.meta.website || "未设置"}`,
            `GitHub: ${config.meta.github ? `https://github.com/${config.meta.github}` : "未设置"}`,
            `LinkedIn: ${config.meta.linkedin ? `https://linkedin.com/in/${config.meta.linkedin}` : "未设置"}`,
            `Twitter: ${config.meta.twitter ? `https://twitter.com/${config.meta.twitter}` : "未设置"}`,
          ].join("\n");

        default:
          return `未知板块: ${section}\n使用 'ls' 查看可用板块`;
      }
    },
  },
  whoami: {
    name: "whoami",
    description: "显示当前用户信息",
    handler: (_, ctx) => {
      const { config } = ctx;
      return [
        `用户: ${config.meta.name}`,
        `角色: ${config.meta.title}`,
        `主机: interactive-resume`,
        `系统: Next.js 14 + TypeScript + Tailwind CSS`,
        `终端: Web Terminal v1.0`,
      ].join("\n");
    },
  },
  about: {
    name: "about",
    description: "打开关于我窗口",
    handler: () => "正在打开关于我窗口... (GUI模式请双击桌面图标)",
  },
  education: {
    name: "education",
    description: "打开教育经历窗口",
    handler: () => "正在打开教育经历窗口... (GUI模式请双击桌面图标)",
  },
  experience: {
    name: "experience",
    description: "打开工作经历窗口",
    handler: () => "正在打开工作经历窗口... (GUI模式请双击桌面图标)",
  },
  skills: {
    name: "skills",
    description: "打开技能专长窗口",
    handler: () => "正在打开技能专长窗口... (GUI模式请双击桌面图标)",
  },
  projects: {
    name: "projects",
    description: "打开项目作品集窗口",
    handler: () => "正在打开项目作品集窗口... (GUI模式请双击桌面图标)",
  },
  contact: {
    name: "contact",
    description: "打开联系我窗口",
    handler: () => "正在打开联系我窗口... (GUI模式请双击桌面图标)",
  },
  clear: {
    name: "clear",
    description: "清屏",
    handler: () => "__CLEAR__",
  },
  date: {
    name: "date",
    description: "显示当前日期时间",
    handler: () => new Date().toLocaleString(),
  },
  echo: {
    name: "echo",
    description: "输出文本",
    usage: "<text>",
    handler: (args) => args.join(" "),
  },
  theme: {
    name: "theme",
    description: "切换主题",
    usage: "[light|dark|system]",
    handler: (args) => {
      if (args.length === 0) return "当前主题: dark (在设置中修改)";
      const theme = args[0];
      if (["light", "dark", "system"].includes(theme)) {
        return `主题已设置为: ${theme} (需在设置中应用)`;
      }
      return "用法: theme [light|dark|system]";
    },
  },
  neofetch: {
    name: "neofetch",
    description: "显示系统信息 (彩蛋)",
    handler: (_, ctx) => {
      const { config } = ctx;
      return `
      ${config.meta.name}@interactive-resume
      ----------------
      OS: Next.js 14 (App Router)
      Host: Qoder 高校创造力大赛
      Kernel: React 18 + TypeScript
      Shell: Web Terminal
      Terminal: Browser Console
      CPU: Your Brain
      Memory: ${config.projects?.length || 0} Projects, ${config.experience?.length || 0} Jobs
      Packages: ${Object.keys(config.about?.skills?.flatMap((s: any) => s.items) || {}).length || 0} Skills
      Theme: Dark (Glassmorphism)
      Colors: Primary #3b82f6
      `.trim();
    },
  },
  matrix: {
    name: "matrix",
    description: "矩阵数字雨效果 (彩蛋)",
    handler: () => "启动矩阵数字雨... (在控制台查看效果)",
  },
  sudo: {
    name: "sudo",
    description: "尝试提权 (彩蛋)",
    usage: "<command>",
    handler: (args) => {
      if (args.length === 0) return "用法: sudo <command>";
      if (args[0] === "rm -rf /") return "拒绝执行：这会删除你的简历数据。";
      if (args[0] === "make me a sandwich") return "好吧，三明治在路上了。";
      return `权限不足: 无法执行 '${args.join(" ")}' (需要管理员权限)`;
    },
  },
};

export function TerminalApp() {
  const { config } = useConfig();
  const { t, lang } = useI18n();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 初始化欢迎信息
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      { type: "welcome", content: "欢迎使用交互式简历终端 v1.0" },
      { type: "welcome", content: "输入 'help' 查看可用命令，输入 'neofetch' 查看系统信息" },
      { type: "welcome", content: "提示: 这是一个模拟终端，GUI 窗口请双击桌面图标打开" },
      { type: "input", content: "", prompt: "visitor@resume:~$ " },
    ];
    setLines(welcomeLines);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  // 解析命令
  const parseCommand = (cmdLine: string) => {
    const parts = cmdLine.trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    return { name, args };
  };

  // 执行命令
  const executeCommand = async (cmdLine: string): Promise<TerminalLine> => {
    const { name, args } = parseCommand(cmdLine);
    const command = COMMANDS[name];

    if (!command) {
      return { type: "error", content: `命令未找到: ${name}\n输入 'help' 查看可用命令` };
    }

    try {
      const ctx: TerminalContext = { config, t, lang };
      const result = await command.handler(args, ctx);

      if (result === "__CLEAR__") {
        return { type: "output", content: "__CLEAR__" };
      }

      return { type: "output", content: result };
    } catch (err) {
      return { type: "error", content: `执行出错: ${err instanceof Error ? err.message : "未知错误"}` };
    }
  };

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmdLine = input.trim();
    setIsProcessing(true);

    // 添加到历史记录
    setHistory((prev) => [...prev, cmdLine]);
    setHistoryIndex(-1);

    // 显示输入行
    setLines((prev) => [...prev, { type: "input", content: cmdLine, prompt: "visitor@resume:~$ " }]);
    setInput("");

    // 执行命令
    const result = await executeCommand(cmdLine);

    if (result.content === "__CLEAR__") {
      setLines([{ type: "input", content: "", prompt: "visitor@resume:~$ " }]);
    } else {
      setLines((prev) => [...prev, result]);
    }

    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // 简单的 Tab 补全
      const cmds = Object.keys(COMMANDS);
      const matches = cmds.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setLines((prev) => [...prev, { type: "output", content: matches.join("  ") }]);
      }
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      // Ctrl+Enter 换行
      setInput((prev) => prev + "\n");
      e.preventDefault();
    }
  };

  // 点击终端区域聚焦输入
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <Card className="h-full flex flex-col bg-gray-950 border-gray-800" onClick={handleTerminalClick}>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* 终端头部 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 ml-2 font-mono">terminal</span>
          <span className="text-xs text-gray-600 ml-auto">visitor@resume</span>
        </div>

        {/* 终端内容区 */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-100 leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        >
          {lines.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap break-all">
              {line.prompt && (
                <span className="text-green-400 mr-2">{line.prompt}</span>
              )}
              <span
                className={cn(
                  "font-mono",
                  line.type === "error" && "text-red-400",
                  line.type === "welcome" && "text-blue-400",
                  line.type === "help" && "text-yellow-300"
                )}
              >
                {line.content}
              </span>
            </div>
          ))}
          {/* 光标闪烁 */}
          <div className="flex items-center">
            <span className="text-green-400 mr-2">visitor@resume:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-gray-100 font-mono text-sm"
              style={{ minWidth: "100px", caretColor: "white" }}
              disabled={isProcessing}
              autoFocus
            />
            <span className="inline-block w-2 h-5 bg-white animate-pulse" />
          </div>
        </div>

        {/* 终端底部状态栏 */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
          <span>就绪</span>
          <span className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Tab</kbd> 补全
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">↑/↓</kbd> 历史
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">Ctrl+C</kbd> 清屏
          </span>
        </div>
      </CardContent>
    </Card>
  );
}