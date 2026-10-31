import React, { useEffect } from 'react';
import { TimerMode, Task, ClockStyle, StudyQuote } from '../types/pomodoro';
import { Play, Pause, Minimize2, Volume2, SkipForward, RefreshCw } from 'lucide-react';
import { FlipClockDisplay } from './FlipClock';

interface ZenModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onSkipTimer: () => void;
  onResetTimer: () => void;
  mode: TimerMode;
  activeTask: Task | null;
  onOpenAmbient: () => void;
  clockStyle?: ClockStyle;
  quote?: StudyQuote;
}

export const ZenModeOverlay: React.FC<ZenModeOverlayProps> = ({
  isOpen,
  onClose,
  timeLeft,
  isRunning,
  onToggleTimer,
  onSkipTimer,
  onResetTimer,
  mode,
  activeTask,
  onOpenAmbient,
  clockStyle = 'ring',
  quote,
}) => {
  // ESC key to exit Zen mode
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        onToggleTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onToggleTimer]);

  if (!isOpen) return null;

  const hours = Math.floor(timeLeft / 3600);
  const remaining = timeLeft % 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const hrStr = String(hours).padStart(2, '0');
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const timeFormatted = hours > 0 ? `${hrStr}:${minStr}:${secStr}` : `${minStr}:${secStr}`;

  const modeLabel =
    mode === 'pomodoro' ? '深度專注中' : mode === 'shortBreak' ? '短暫休息時間' : '深度長休息';

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-between p-8 text-neutral-100 select-none animate-in fade-in duration-300">
      {/* Top Bar in Zen */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="tracking-widest uppercase font-mono">ZEN FOCUS MODE</span>
          <span className="text-neutral-600">· 按 ESC 或右上角退出</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAmbient}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors flex items-center gap-2 text-xs"
            title="調整背景音景"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">白噪音</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
            title="退出全螢幕 (ESC)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Hero Clock */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-6">
        {clockStyle === 'flip' ? (
          <FlipClockDisplay
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            modeLabel={modeLabel}
          />
        ) : (
          <>
            {/* Mode subtitle */}
            <div className="text-sm font-medium tracking-widest text-neutral-400 uppercase">
              {modeLabel}
            </div>


            {/* Huge Digital Clock */}
            <div className="text-8xl sm:text-9xl md:text-[11rem] font-bold font-mono tracking-tight tabular-nums text-neutral-100 drop-shadow-2xl">
              {timeFormatted}
            </div>
          </>
        )}


        {/* Current Active Task */}
        {activeTask ? (
          <div className="max-w-md px-6 py-2.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
            <div className="text-xs text-amber-400 font-medium">當前目標</div>
            <div className="text-sm font-semibold text-neutral-100 mt-0.5 truncate">
              {activeTask.title}
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-1">
              🍅 {activeTask.completedTomatoes} / {activeTask.estimatedTomatoes}
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-500 font-mono tracking-wide">
            心無旁騖 · 專注當下
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={onResetTimer}
            className="p-3 text-neutral-400 hover:text-white rounded-2xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            title="重置計時器"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleTimer}
            className={`px-8 py-4 rounded-2xl font-semibold text-base transition-all flex items-center gap-3 shadow-xl ${
              isRunning
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>暫停</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                <span>繼續專注</span>
              </>
            )}
          </button>

          <button
            onClick={onSkipTimer}
            className="p-3 text-neutral-400 hover:text-white rounded-2xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            title="跳過此階段"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quote with translation */}
      {quote && (
        <div className="max-w-xl text-center px-4 space-y-1 my-2">
          <p className="text-sm text-neutral-300 font-serif italic">
            「{quote.original}」
          </p>
          {quote.translation && (
            <p className="text-xs text-neutral-400 font-sans">
              {quote.translation}
            </p>
          )}
          <p className="text-[11px] text-amber-400/90 font-mono">
            — {quote.author} <span className="text-neutral-500">({quote.subject})</span>
          </p>
        </div>
      )}

      {/* Bottom hint */}
      <div className="text-xs text-neutral-600 font-mono tracking-wide">
        空白鍵 [Space] 快速暫停/開始 · 沉浸心流中
      </div>
    </div>
  );
};
