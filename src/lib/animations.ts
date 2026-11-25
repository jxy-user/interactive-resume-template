import { Variants } from "framer-motion";

/**
 * 窗口打开/关闭动画
 */
export const windowVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
};

/**
 * 窗口最小化/还原动画
 */
export const minimizeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 250,
    },
  },
};

/**
 * 图标进入/退出动画
 */
export const iconVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  }),
};

/**
 * 容器交错动画
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * 列表项动画
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/**
 * 卡片悬停动画
 */
export const cardHoverVariants = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    transition: { type: "spring", damping: 15, stiffness: 300 },
  },
};

/**
 * 页面淡入动画
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * 滑入动画 (从左/右/上/下)
 */
export const slideInVariants: Record<string, Variants> = {
  left: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
  right: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
  up: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
  down: {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  },
};

/**
 * 脉冲动画 - 用于引起注意
 */
export const pulseVariants: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

/**
 * 打字机效果动画配置
 */
export const typewriterVariants: Variants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: { duration: 2, ease: "easeInOut" },
  },
};

/**
 * 进度条动画
 */
export const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (level: number) => ({
    width: `${level}%`,
    transition: { duration: 1.5, delay: 0.3, ease: "easeOut" },
  }),
};

/**
 * 缩放淡入动画
 */
export const scaleFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/**
 * 任务栏图标弹跳动画
 */
export const bounceVariants: Variants = {
  rest: { y: 0 },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

/**
 * 旋转加载动画
 */
export const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
};