import React from 'react';
import { Volume2, Maximize2, Settings, BookMarked, Sun, Moon, Palette } from 'lucide-react';
import { ThemeMode } from '../types/pomodoro';

interface NavbarProps {
  currentTab: 'timer' | 'tasks' | 'stats' | 'notes';
  onSelectTab: (tab: 'timer' | 'tasks' | 'stats' | 'notes') => void;
  pendingNotesCount: number;
  onOpenAmbient: () => void;
  onOpenZen: () => void;
  onOpenSettings: () => void;
  onOpenThemeStyle: () => void;
  theme: ThemeMode;
  activeAmbientsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  pendingNotesCount,
  onOpenAmbient,
  onOpenZen,
  onOpenSettings,
  onOpenThemeStyle,
  theme,
  activeAmbientsCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Wordmark Single Element */}
      <div
        onClick={() => onSelectTab('timer')}
        className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <BookMarked className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight text-neutral-100 font-sans">
          墨讀 FocusDesk
        </span>
      </div>

      {/* Zone 2: 4 Single-line Nav Tabs */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
        <button
          onClick={() => onSelectTab('timer')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            currentTab === 'timer'
              ? 'text-neutral-100 border-amber-400 font-semibold'
              : 'border-transparent'
          }`}
        >
          專注計時
        </button>
        <button
          onClick={() => onSelectTab('tasks')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            currentTab === 'tasks'
              ? 'text-neutral-100 border-amber-400 font-semibold'
              : 'border-transparent'
          }`}
        >
          讀書看板
        </button>
        <button
          onClick={() => onSelectTab('stats')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            currentTab === 'stats'
              ? 'text-neutral-100 border-amber-400 font-semibold'
              : 'border-transparent'
          }`}
        >
          學習統計
        </button>
        <button
          onClick={() => onSelectTab('notes')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
            currentTab === 'notes'
              ? 'text-neutral-100 border-amber-400 font-semibold'
              : 'border-transparent'
          }`}
        >
          <span>閃念便籤</span>
          {pendingNotesCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono">
              {pendingNotesCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: Primary Action & Tools */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Ambient sound button */}
        <button
          onClick={onOpenAmbient}
          className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
            activeAmbientsCount > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
          }`}
          title="背景白噪音混音"
        >
          <Volume2 className="w-4 h-4" />
          {activeAmbientsCount > 0 && (
            <span className="text-[11px] font-mono hidden sm:inline">{activeAmbientsCount}</span>
          )}
        </button>

        {/* Theme & Style selector */}
        <button
          onClick={onOpenThemeStyle}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          title="畫面風格與主題切換"
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline text-neutral-300">畫面風格</span>
        </button>

        {/* Zen fullscreen button */}
        <button
          onClick={onOpenZen}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-100 rounded-xl transition-colors hidden sm:flex items-center"
          title="沉浸全螢幕專注"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-100 rounded-xl transition-colors"
          title="番茄鐘設定"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
