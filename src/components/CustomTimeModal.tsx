import React, { useState, useEffect } from 'react';
import { CustomPreset } from '../types/pomodoro';
import { formatSecondsToHms } from '../utils/storage';
import { X, Clock, Plus, Trash2, Check, Bookmark, RotateCcw } from 'lucide-react';

interface CustomTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFocusSeconds: number;
  currentShortBreakSeconds: number;
  currentLongBreakSeconds: number;
  presets: CustomPreset[];
  onApplySeconds: (focusSec: number, shortSec: number, longSec: number) => void;
  onSaveNewPreset: (preset: Omit<CustomPreset, 'id'>) => void;
  onDeletePreset: (id: string) => void;
}

export const CustomTimeModal: React.FC<CustomTimeModalProps> = ({
  isOpen,
  onClose,
  currentFocusSeconds,
  currentShortBreakSeconds,
  currentLongBreakSeconds,
  presets,
  onApplySeconds,
  onSaveNewPreset,
  onDeletePreset,
}) => {
  // Focus HMS
  const [focusH, setFocusH] = useState(Math.floor(currentFocusSeconds / 3600));
  const [focusM, setFocusM] = useState(Math.floor((currentFocusSeconds % 3600) / 60));
  const [focusS, setFocusS] = useState(currentFocusSeconds % 60);

  // Short break HMS
  const [shortH, setShortH] = useState(Math.floor(currentShortBreakSeconds / 3600));
  const [shortM, setShortM] = useState(Math.floor((currentShortBreakSeconds % 3600) / 60));
  const [shortS, setShortS] = useState(currentShortBreakSeconds % 60);

  // Long break HMS
  const [longH, setLongH] = useState(Math.floor(currentLongBreakSeconds / 3600));
  const [longM, setLongM] = useState(Math.floor((currentLongBreakSeconds % 3600) / 60));
  const [longS, setLongS] = useState(currentLongBreakSeconds % 60);

  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Sync when modal opens
  useEffect(() => {
    setFocusH(Math.floor(currentFocusSeconds / 3600));
    setFocusM(Math.floor((currentFocusSeconds % 3600) / 60));
    setFocusS(currentFocusSeconds % 60);

    setShortH(Math.floor(currentShortBreakSeconds / 3600));
    setShortM(Math.floor((currentShortBreakSeconds % 3600) / 60));
    setShortS(currentShortBreakSeconds % 60);

    setLongH(Math.floor(currentLongBreakSeconds / 3600));
    setLongM(Math.floor((currentLongBreakSeconds % 3600) / 60));
    setLongS(currentLongBreakSeconds % 60);
  }, [currentFocusSeconds, currentShortBreakSeconds, currentLongBreakSeconds, isOpen]);

  if (!isOpen) return null;

  const totalFocusSec = Math.max(5, focusH * 3600 + focusM * 60 + focusS);
  const totalShortSec = Math.max(5, shortH * 3600 + shortM * 60 + shortS);
  const totalLongSec = Math.max(5, longH * 3600 + longM * 60 + longS);

  const handleApply = () => {
    onApplySeconds(totalFocusSec, totalShortSec, totalLongSec);
    onClose();
  };

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;
    onSaveNewPreset({
      name: presetName.trim(),
      focusSeconds: totalFocusSec,
      shortBreakSeconds: totalShortSec,
      longBreakSeconds: totalLongSec,
      focusMinutes: Math.floor(totalFocusSec / 60),
      shortBreakMinutes: Math.floor(totalShortSec / 60),
      longBreakMinutes: Math.floor(totalLongSec / 60),
    });
    setPresetName('');
    setIsSavingPreset(false);
  };

  const setHmsFromTotal = (type: 'focus' | 'short' | 'long', total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (type === 'focus') {
      setFocusH(h);
      setFocusM(m);
      setFocusS(s);
    } else if (type === 'short') {
      setShortH(h);
      setShortM(m);
      setShortS(s);
    } else {
      setLongH(h);
      setLongM(m);
      setLongS(s);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 text-base">自訂專注與休息時長</h3>
              <p className="text-xs text-neutral-400">支援精確到「小時」、「分鐘」與「秒鐘」的彈性配置</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Triple Input Blocks: Hours, Minutes, Seconds */}
        <div className="space-y-4 my-5">
          {/* 1. FOCUS TIME */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🍅 專注時長 (Focus)</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                總計：<strong className="text-amber-400">{formatSecondsToHms(totalFocusSec).formatted}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Hours */}
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">小時 (Hours)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={focusH}
                    onChange={e => setFocusH(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">h</span>
                </div>
              </div>

              {/* Minutes */}
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">分鐘 (Minutes)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={focusM}
                    onChange={e => setFocusM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">m</span>
                </div>
              </div>

              {/* Seconds */}
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">秒鐘 (Seconds)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={focusS}
                    onChange={e => setFocusS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">s</span>
                </div>
              </div>
            </div>

            {/* Quick adjust chips */}
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[10px] text-neutral-500">快捷：</span>
              <button
                type="button"
                onClick={() => setHmsFromTotal('focus', totalFocusSec + 30)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +30秒
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('focus', totalFocusSec + 300)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +5分鐘
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('focus', totalFocusSec + 900)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +15分鐘
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('focus', totalFocusSec + 3600)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +1小時
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('focus', 25 * 60)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-400 hover:text-white"
              >
                重設 25m
              </button>
            </div>
          </div>

          {/* 2. SHORT BREAK */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <span>☕ 短暫休息 (Short Break)</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                總計：<strong className="text-sky-400">{formatSecondsToHms(totalShortSec).formatted}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">小時 (Hours)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={shortH}
                    onChange={e => setShortH(Math.max(0, Math.min(3, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">h</span>
                </div>
              </div>

              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">分鐘 (Minutes)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={shortM}
                    onChange={e => setShortM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">m</span>
                </div>
              </div>

              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">秒鐘 (Seconds)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={shortS}
                    onChange={e => setShortS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">s</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[10px] text-neutral-500">快捷：</span>
              <button
                type="button"
                onClick={() => setHmsFromTotal('short', totalShortSec + 30)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +30秒
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('short', totalShortSec + 60)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-300"
              >
                +1分鐘
              </button>
              <button
                type="button"
                onClick={() => setHmsFromTotal('short', 5 * 60)}
                className="px-2 py-0.5 text-[10px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md text-neutral-400 hover:text-white"
              >
                重設 5m
              </button>
            </div>
          </div>

          {/* 3. LONG BREAK */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                <span>🛋️ 深度長休 (Long Break)</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                總計：<strong className="text-purple-400">{formatSecondsToHms(totalLongSec).formatted}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">小時 (Hours)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={longH}
                    onChange={e => setLongH(Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">h</span>
                </div>
              </div>

              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">分鐘 (Minutes)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={longM}
                    onChange={e => setLongM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">m</span>
                </div>
              </div>

              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 font-medium mb-1">秒鐘 (Seconds)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={longS}
                    onChange={e => setLongS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-center font-mono text-xl font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presets List */}
        <div className="pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>快速套用預設</span>
            </span>
            <button
              onClick={() => setIsSavingPreset(!isSavingPreset)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>將當前時鐘存為新預設</span>
            </button>
          </div>

          {/* Save new preset drawer */}
          {isSavingPreset && (
            <form onSubmit={handleCreatePreset} className="mb-3 p-3 bg-neutral-950 border border-amber-500/30 rounded-xl space-y-2 animate-in fade-in">
              <input
                type="text"
                required
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                placeholder="輸入預設名稱，例如：深度模考 1小時15分、速記衝刺 5分30秒..."
                className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSavingPreset(false)}
                  className="px-2.5 py-1 text-neutral-400 hover:text-neutral-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium rounded-lg"
                >
                  確認儲存
                </button>
              </div>
            </form>
          )}

          {/* Preset Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map(p => {
              const isCurrent = totalFocusSec === p.focusSeconds && totalShortSec === p.shortBreakSeconds;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setHmsFromTotal('focus', p.focusSeconds);
                    setHmsFromTotal('short', p.shortBreakSeconds);
                    setHmsFromTotal('long', p.longBreakSeconds);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between group transition-colors ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{p.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      {formatSecondsToHms(p.focusSeconds).formatted} / {formatSecondsToHms(p.shortBreakSeconds).formatted}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!['p-classic', 'p-deep', 'p-exam', 'p-sprint', 'p-quick'].includes(p.id) && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeletePreset(p.id);
                        }}
                        className="p-1 text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="刪除自訂預設"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isCurrent && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl transition-colors shadow-sm"
          >
            套用此時長 ({formatSecondsToHms(totalFocusSec).formatted})
          </button>
        </div>
      </div>
    </div>
  );
};
