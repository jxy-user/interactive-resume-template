export type WindowId =
  | "museum"
  | "about"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "writing"
  | "contact"
  | "terminal";

export interface WindowConfig {
  id: WindowId;
  title: string; // 窗口标题
  icon: string; // 图标 emoji 或组件名
  width: number; // 默认宽度 (px)
  height: number; // 默认高度 (px)
  minWidth: number;
  minHeight: number;
  component: string; // 组件名
}

export interface DesktopIcon {
  id: string;
  label: string; // 标签
  icon: string; // emoji 图标
  windowId: WindowId; // 关联窗口
  x: number; // 桌面位置 X
  y: number; // 桌面位置 Y
}

export interface WindowState {
  id: WindowId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
}

export interface DesktopState {
  wallpaper: string; // 壁纸 URL
  icons: DesktopIcon[];
  windows: Record<WindowId, WindowState>;
  activeWindow: WindowId | null;
  minimizedWindows: WindowId[];
}

export interface ContextMenuItem {
  label: string;
  action: string;
  disabled?: boolean;
  divider?: boolean;
}
