import type { WindowConfig, WindowId, WindowState } from '../types/desktop';

export type WindowStates = Record<WindowId, WindowState>;

export function createInitialWindowStates(
  configs: Record<WindowId, WindowConfig>
): WindowStates {
  const entries = (Object.keys(configs) as WindowId[]).map((id, index) => {
    const config = configs[id];
    const state: WindowState = {
      id,
      x: 72 + index * 24,
      y: 72 + index * 24,
      width: config.width,
      height: config.height,
      zIndex: 10,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isActive: false,
    };
    return [id, state] as const;
  });

  return Object.fromEntries(entries) as WindowStates;
}

export function openWindowState(
  windows: WindowStates,
  id: WindowId,
  zIndex: number
): WindowStates {
  return {
    ...windows,
    [id]: {
      ...windows[id],
      isOpen: true,
      isMinimized: false,
      isActive: true,
      zIndex,
    },
  };
}

export function closeWindowState(windows: WindowStates, id: WindowId): WindowStates {
  return {
    ...windows,
    [id]: {
      ...windows[id],
      isOpen: false,
      isActive: false,
    },
  };
}
