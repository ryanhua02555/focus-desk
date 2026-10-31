import React from 'react';
import { PomodoroSettings } from '../types/pomodoro';
import { X, Sliders, Bell, Play, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSaveSettings: (settings: PomodoroSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = React.useState<PomodoroSettings>(settings);

  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PomodoroSettings = {
      ...form,
      pomodoroSeconds: form.pomodoroMinutes * 60,
      shortBreakSeconds: form.shortBreakMinutes * 60,
      longBreakSeconds: form.longBreakMinutes * 60,
    };
    onSaveSettings(updated);
    onClose();
  };


  const testAlarm = (type: PomodoroSettings['alarmSound']) => {
    soundEngine.playAlarm(type, form.alarmVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 text-base">番茄鐘自訂設定</h3>
              <p className="text-xs text-neutral-400">依據你的學科特性客製化心流週期</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-6 mt-5">
          {/* Time Durations */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              時長配置 (分鐘)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <label className="text-[11px] text-neutral-400 block mb-1">專注時長</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={form.pomodoroMinutes}
                    onChange={e => setForm({ ...form, pomodoroMinutes: Math.max(1, parseInt(e.target.value) || 25) })}
                    className="w-full bg-transparent font-mono text-lg font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500 font-sans">分</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <label className="text-[11px] text-neutral-400 block mb-1">短暫休息</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.shortBreakMinutes}
                    onChange={e => setForm({ ...form, shortBreakMinutes: Math.max(1, parseInt(e.target.value) || 5) })}
                    className="w-full bg-transparent font-mono text-lg font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500 font-sans">分</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <label className="text-[11px] text-neutral-400 block mb-1">深度長休</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={form.longBreakMinutes}
                    onChange={e => setForm({ ...form, longBreakMinutes: Math.max(1, parseInt(e.target.value) || 15) })}
                    className="w-full bg-transparent font-mono text-lg font-bold text-neutral-100 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-500 font-sans">分</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-neutral-300">長休息觸發週期</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">每完成</span>
                <select
                  value={form.longBreakInterval}
                  onChange={e => setForm({ ...form, longBreakInterval: parseInt(e.target.value) })}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-100 font-mono text-xs focus:outline-none"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4 (標準)</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
                <span className="text-neutral-500">個番茄鐘</span>
              </div>
            </div>
          </div>

          {/* Automation toggles */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              自動化流程
            </h4>

            <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-sm font-medium text-neutral-200">自動開始休息</div>
                <div className="text-xs text-neutral-500">專注倒數結束後，立即啟動休息倒數</div>
              </div>
              <input
                type="checkbox"
                checked={form.autoStartBreaks}
                onChange={e => setForm({ ...form, autoStartBreaks: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-sm font-medium text-neutral-200">自動開始下個番茄鐘</div>
                <div className="text-xs text-neutral-500">休息結束後，自動開啟下一段讀書時間</div>
              </div>
              <input
                type="checkbox"
                checked={form.autoStartPomodoros}
                onChange={e => setForm({ ...form, autoStartPomodoros: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>
          </div>

          {/* Sound & Notifications */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              提示音與鈴響
            </h4>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">結束提示鈴聲</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'tibetan-bell', name: '西藏頌缽 (平靜冥想)' },
                  { id: 'zen-gong', name: '禪意銅鑼 (深沉定心)' },
                  { id: 'marimba', name: '輕快木琴 (活力清脆)' },
                  { id: 'soft-beep', name: '柔和電音 (低調簡潔)' },
                ].map(sound => (
                  <div
                    key={sound.id}
                    onClick={() => setForm({ ...form, alarmSound: sound.id as any })}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                      form.alarmSound === sound.id
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-xs font-medium">{sound.name}</span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        testAlarm(sound.id as any);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white"
                      title="試聽"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>提示聲音量</span>
                <span className="font-mono">{Math.round(form.alarmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={form.alarmVolume}
                onChange={e => setForm({ ...form, alarmVolume: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
              <div>
                <div className="text-sm font-medium text-neutral-200">專注倒數滴答聲</div>
                <div className="text-xs text-neutral-500">每秒發出極微弱的指針木質點擊聲（助部分同學定心）</div>
              </div>
              <input
                type="checkbox"
                checked={form.tickingSound}
                onChange={e => setForm({ ...form, tickingSound: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl transition-colors font-semibold"
            >
              儲存設定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
