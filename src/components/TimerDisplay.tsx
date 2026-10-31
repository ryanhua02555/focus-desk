import React from 'react';
import { TimerMode, Task, PomodoroSettings, CustomPreset, ClockStyle, StudyQuote } from '../types/pomodoro';
import { Play, Pause, RotateCcw, SkipForward, Plus, Minus, Target, Clock, Sliders, Palette, RefreshCw } from 'lucide-react';
import { FlipClockDisplay } from './FlipClock';
import { formatSecondsToHms } from '../utils/storage';

interface TimerDisplayProps {
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  cycleCount: number;
  activeTask: Task | null;
  settings: PomodoroSettings;
  presets: CustomPreset[];
  quote: StudyQuote;
  onNextQuote: () => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onChangeMode: (mode: TimerMode) => void;
  onAdjustTime: (seconds: number) => void;
  onApplyPreset: (focusSec: number, shortSec: number, longSec: number) => void;
  onOpenTasks: () => void;
  onOpenZen: () => void;
  onOpenCustomTime: () => void;
  onOpenThemeStyle: () => void;
}


export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  mode,
  timeLeft,
  totalTime,
  isRunning,
  cycleCount,
  activeTask,
  settings,
  presets,
  quote,
  onNextQuote,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onChangeMode,
  onAdjustTime,
  onApplyPreset,
  onOpenTasks,
  onOpenZen,
  onOpenCustomTime,
  onOpenThemeStyle,
}) => {
  const hours = Math.floor(timeLeft / 3600);
  const remaining = timeLeft % 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const hrStr = String(hours).padStart(2, '0');
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const timeFormatted = hours > 0 ? `${hrStr}:${minStr}:${secStr}` : `${minStr}:${secStr}`;

  // Percentage for progress ring (0 to 100)
  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Active theme colors
  const modeColor =
    mode === 'pomodoro'
      ? { stroke: 'var(--accent-color, #fbbf24)', text: 'text-amber-400', bg: 'bg-amber-500/10' }
      : mode === 'shortBreak'
      ? { stroke: '#38bdf8', text: 'text-sky-400', bg: 'bg-sky-500/10' }
      : { stroke: '#a855f7', text: 'text-purple-400', bg: 'bg-purple-500/10' };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl mb-6 shadow-sm">
        <button
          onClick={() => onChangeMode('pomodoro')}
          className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === 'pomodoro'
              ? 'bg-neutral-800 text-white shadow-sm font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          專注讀書 ({formatSecondsToHms(settings.pomodoroSeconds).formatted})
        </button>
        <button
          onClick={() => onChangeMode('shortBreak')}
          className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === 'shortBreak'
              ? 'bg-neutral-800 text-white shadow-sm font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          短休息 ({formatSecondsToHms(settings.shortBreakSeconds).formatted})
        </button>
        <button
          onClick={() => onChangeMode('longBreak')}
          className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === 'longBreak'
              ? 'bg-neutral-800 text-white shadow-sm font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          長休息 ({formatSecondsToHms(settings.longBreakSeconds).formatted})
        </button>
      </div>


      {/* Active Task Pill / Target Card */}
      <div className="w-full mb-6">
        {activeTask ? (
          <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-400 font-medium">當前研讀科目</span>
                  <span className="text-xs text-neutral-400">· {activeTask.subject}</span>
                </div>
                <div className="text-sm font-semibold text-neutral-100 truncate">
                  {activeTask.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs text-neutral-300 px-2 py-1 bg-neutral-950 rounded-lg border border-neutral-800">
                🍅 {activeTask.completedTomatoes} / {activeTask.estimatedTomatoes}
              </span>
              <button
                onClick={onOpenTasks}
                className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                更換
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenTasks}
            className="p-3 bg-neutral-900/40 border border-dashed border-neutral-800 hover:border-neutral-700 rounded-2xl flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-400/70" />
            <span>尚未選定讀書目標，點擊綁定任務以記錄科目進度</span>
          </div>
        )}
      </div>

      {/* CLOCK DISPLAY SECTION */}
      {settings.clockStyle === 'ring' && (
        /* Style 1: Circular Ring */
        <div className="relative flex items-center justify-center my-4 group">
          <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform" viewBox="0 0 320 320">
            <circle
              cx="160"
              cy="160"
              r={radius}
              className="stroke-neutral-800/60"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={modeColor.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear drop-shadow-md"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center select-none">
            {/* Cycle dots */}
            <div className="flex items-center gap-1.5 mb-2">
              {Array.from({ length: settings.longBreakInterval }).map((_, i) => {
                const isFilled = i < cycleCount % settings.longBreakInterval;
                return (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isFilled ? 'bg-amber-400' : 'bg-neutral-800'
                    }`}
                    title={`週期進度 ${i + 1}/${settings.longBreakInterval}`}
                  />
                );
              })}
            </div>

            {/* Digits with click-to-customize */}
            <div
              onClick={onOpenCustomTime}
              className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-neutral-100 tabular-nums cursor-pointer hover:text-amber-400 transition-colors"
              title="點擊自訂時間"
            >
              {timeFormatted}
            </div>

            <div className={`text-xs font-medium mt-1 tracking-wider uppercase ${modeColor.text}`}>
              {mode === 'pomodoro'
                ? isRunning
                  ? '深度專注中'
                  : '準備好開始'
                : mode === 'shortBreak'
                ? '短暫小憩'
                : '深層放鬆'}
            </div>

            {/* Quick adjust time buttons */}
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onAdjustTime(-300)}
                className="px-2 py-0.5 text-[11px] font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                title="減少 5 分鐘"
              >
                -5m
              </button>
              <button
                onClick={() => onAdjustTime(300)}
                className="px-2 py-0.5 text-[11px] font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                title="增加 5 分鐘"
              >
                +5m
              </button>
            </div>
          </div>
        </div>
      )}

      {settings.clockStyle === 'flip' && (
        <FlipClockDisplay
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onClick={onOpenCustomTime}
          modeLabel={mode === 'pomodoro' ? '深度專注中' : mode === 'shortBreak' ? '短暫休息' : '長休息'}
        />
      )}

      {settings.clockStyle === 'minimal' && (
        /* Style 3: Minimal Jumbo Digits */
        <div className="my-10 flex flex-col items-center select-none">
          <div
            onClick={onOpenCustomTime}
            className="font-mono text-8xl sm:text-9xl font-bold tracking-tighter text-neutral-100 tabular-nums cursor-pointer hover:text-amber-400 transition-colors"
            title="點擊自訂時間"
          >
            {timeFormatted}
          </div>
          {/* Subtle breathing line */}
          <div className="w-48 h-1 bg-neutral-800 rounded-full mt-4 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-amber-400 transition-all duration-500"
            />
          </div>
          <div className={`text-xs font-medium mt-3 tracking-wider uppercase ${modeColor.text}`}>
            {mode === 'pomodoro' ? '深度專注中' : '休息中'}
          </div>
        </div>
      )}

      {/* Primary Action Controls */}
      <div className="flex items-center gap-4 mt-2">
        {/* Reset button */}
        <button
          onClick={onResetTimer}
          className="p-3 text-neutral-400 hover:text-neutral-100 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-2xl transition-colors"
          title="重設當前階段時間"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Big Start / Pause Button */}
        <button
          onClick={onToggleTimer}
          className={`px-8 py-4 rounded-2xl font-semibold text-base transition-all flex items-center gap-3 shadow-lg ${
            isRunning
              ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
              : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/20 hover:scale-[1.02]'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>暫停計時</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{mode === 'pomodoro' ? '開始專注讀書' : '開始休息'}</span>
            </>
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={onSkipTimer}
          className="p-3 text-neutral-400 hover:text-neutral-100 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-2xl transition-colors"
          title="跳過此階段"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Custom Time & Presets Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-xs max-w-full">
        {/* Dedicated Custom Time Trigger */}
        <button
          onClick={onOpenCustomTime}
          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 font-medium shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>自訂時間 (時/分/秒)</span>
        </button>

        {/* Style/Theme button */}
        <button
          onClick={onOpenThemeStyle}
          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
        >
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <span>畫面風格</span>
        </button>

        <span className="text-neutral-600 hidden sm:inline">|</span>

        {/* Presets list */}
        {presets.slice(0, 4).map(p => {
          const isActive = settings.pomodoroSeconds === p.focusSeconds && settings.shortBreakSeconds === p.shortBreakSeconds;
          return (
            <button
              key={p.id}
              onClick={() => onApplyPreset(p.focusSeconds, p.shortBreakSeconds, p.longBreakSeconds)}
              className={`px-2.5 py-1.5 rounded-xl transition-colors border ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold shadow-sm'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>


      {/* Inspiring Study Quote (Tailored to active subject with translation) */}
      <div className="w-full max-w-xl mt-8 p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl relative group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Subject Tag & Author */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {quote.subject || '治學心流'}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                — {quote.author}
              </span>
            </div>

            {/* Original Quote */}
            <p className="text-sm font-medium text-neutral-100 font-sans leading-relaxed">
              「{quote.original}」
            </p>

            {/* Translation */}
            {quote.translation && (
              <div className="text-xs text-neutral-400 mt-2.5 leading-relaxed bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/50">
                <span className="text-amber-400/90 font-medium mr-1.5">釋義：</span>
                {quote.translation}
              </div>
            )}
          </div>

          {/* Refresh / Next quote button */}
          <button
            onClick={onNextQuote}
            className="p-1.5 text-neutral-500 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
            title="換一句研讀勉勵名言"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

