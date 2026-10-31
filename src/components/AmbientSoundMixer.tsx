import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Trees, Waves, Flame, Radio, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AmbientSoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundItem {
  id: 'rain' | 'cafe' | 'forest' | 'waves' | 'fire' | 'whiteNoise';
  name: string;
  icon: React.ReactNode;
  desc: string;
}

const SOUNDS: SoundItem[] = [
  { id: 'rain', name: '靜心雨聲', icon: <CloudRain className="w-5 h-5 text-sky-400" />, desc: '窗外綿密細雨，隔絕喧囂' },
  { id: 'cafe', name: '書香咖啡館', icon: <Coffee className="w-5 h-5 text-amber-500" />, desc: '午後溫潤低頻 murmur' },
  { id: 'forest', name: '森林微風', icon: <Trees className="w-5 h-5 text-emerald-400" />, desc: '林梢微風掠過松葉之音' },
  { id: 'waves', name: '潮汐浪湧', icon: <Waves className="w-5 h-5 text-cyan-400" />, desc: '平緩節律的舒緩海浪' },
  { id: 'fire', name: '壁爐薪火', icon: <Flame className="w-5 h-5 text-rose-400" />, desc: '木柴輕微噼啪暖意' },
  { id: 'whiteNoise', name: '專注白噪音', icon: <Radio className="w-5 h-5 text-indigo-400" />, desc: '平坦光譜，阻擋突發噪音' },
];

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({ isOpen, onClose }) => {
  const [volumes, setVolumes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('focusdesk_ambient_v1');
      return saved ? JSON.parse(saved) : { rain: 0, cafe: 0, forest: 0, waves: 0, fire: 0, whiteNoise: 0 };
    } catch {
      return { rain: 0, cafe: 0, forest: 0, waves: 0, fire: 0, whiteNoise: 0 };
    }
  });

  const [isMasterMuted, setIsMasterMuted] = useState(false);

  // Apply volume changes to soundEngine
  const handleVolumeChange = (id: SoundItem['id'], val: number) => {
    const updated = { ...volumes, [id]: val };
    setVolumes(updated);
    try {
      localStorage.setItem('focusdesk_ambient_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (!isMasterMuted) {
      soundEngine.setAmbientSound(id, val);
    }
  };

  const handleToggleSound = (id: SoundItem['id']) => {
    const current = volumes[id] || 0;
    const newVal = current > 0 ? 0 : 0.4;
    handleVolumeChange(id, newVal);
  };

  const handleStopAll = () => {
    const reset = { rain: 0, cafe: 0, forest: 0, waves: 0, fire: 0, whiteNoise: 0 };
    setVolumes(reset);
    soundEngine.stopAllAmbients();
    try {
      localStorage.setItem('focusdesk_ambient_v1', JSON.stringify(reset));
    } catch {
      // ignore
    }
  };

  const activeCount = Object.values(volumes).filter(v => v > 0).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 text-base">擬真白噪音混音器</h3>
              <p className="text-xs text-neutral-400">Web Audio 原生合成音景 · 助你進入深度心流</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick presets & stop */}
        <div className="flex items-center justify-between mt-4 mb-5 text-xs">
          <div className="text-neutral-400 flex items-center gap-2">
            <span>正在播放：</span>
            <span className="font-medium text-amber-400">{activeCount} 種音景</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Preset: Rainy Cafe
                const preset = { rain: 0.45, cafe: 0.35, forest: 0, waves: 0, fire: 0, whiteNoise: 0 };
                setVolumes(preset);
                Object.entries(preset).forEach(([k, v]) => soundEngine.setAmbientSound(k as any, v));
              }}
              className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            >
              雨夜咖啡
            </button>
            <button
              onClick={() => {
                // Preset: Forest Campfire
                const preset = { rain: 0, cafe: 0, forest: 0.4, waves: 0, fire: 0.3, whiteNoise: 0 };
                setVolumes(preset);
                Object.entries(preset).forEach(([k, v]) => soundEngine.setAmbientSound(k as any, v));
              }}
              className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            >
              林間薪火
            </button>
            {activeCount > 0 && (
              <button
                onClick={handleStopAll}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors flex items-center gap-1"
              >
                <VolumeX className="w-3.5 h-3.5" />
                全部靜音
              </button>
            )}
          </div>
        </div>

        {/* Sound List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {SOUNDS.map(sound => {
            const vol = volumes[sound.id] || 0;
            const isActive = vol > 0;
            return (
              <div
                key={sound.id}
                className={`p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-neutral-800/80 border-amber-500/30'
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => handleToggleSound(sound.id)}
                    className="flex items-center gap-2.5 text-left group"
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                      {sound.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-200 group-hover:text-white flex items-center gap-1.5">
                        <span>{sound.name}</span>
                        {isActive && (
                          <span className="text-[10px] text-amber-400 font-mono">
                            {Math.round(vol * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">{sound.desc}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleToggleSound(sound.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {isActive ? '播放中' : '啟動'}
                  </button>
                </div>

                {/* Slider */}
                <div className="flex items-center gap-3 pt-1">
                  <VolumeX className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={vol}
                    onChange={e => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm"
          >
            完成設定並繼續讀書
          </button>
        </div>
      </div>
    </div>
  );
};
