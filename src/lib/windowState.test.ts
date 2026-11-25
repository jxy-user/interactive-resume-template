import { describe, expect, it } from 'vitest';
import { defaultWindowConfigs } from './windowConfigs';
import { closeWindowState, createInitialWindowStates, openWindowState } from './windowState';

describe('window lifecycle', () => {
  it('starts with every window closed', () => {
    const windows = createInitialWindowStates(defaultWindowConfigs);
    expect(Object.values(windows).every((win) => win.isOpen === false)).toBe(true);
  });

  it('opens a window and raises its z-index', () => {
    const windows = openWindowState(createInitialWindowStates(defaultWindowConfigs), 'about', 101);
    expect(windows.about.isOpen).toBe(true);
    expect(windows.about.isMinimized).toBe(false);
    expect(windows.about.isActive).toBe(true);
    expect(windows.about.zIndex).toBe(101);
  });

  it('closes an open window', () => {
    const opened = openWindowState(createInitialWindowStates(defaultWindowConfigs), 'about', 101);
    const closed = closeWindowState(opened, 'about');
    expect(closed.about.isOpen).toBe(false);
    expect(closed.about.isActive).toBe(false);
  });

  it('can reopen a closed window', () => {
    const closed = closeWindowState(
      openWindowState(createInitialWindowStates(defaultWindowConfigs), 'about', 101),
      'about'
    );
    const reopened = openWindowState(closed, 'about', 102);
    expect(reopened.about.isOpen).toBe(true);
    expect(reopened.about.zIndex).toBe(102);
  });
});
