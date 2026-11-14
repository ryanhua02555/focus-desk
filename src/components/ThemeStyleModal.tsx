import React from 'react';
import { ThemeMode, ClockStyle, TextStyleMode } from '../types/pomodoro';
import { X, Palette, Check, CircleDot, Clock, AlignJustify, Sparkles } from 'lucide-react';

interface ThemeStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  currentClockStyle: ClockStyle;
  onSelectClockStyle: (style: ClockStyle) => void;
  currentTextStyle?: TextStyleMode;
  onSelectTextStyle?: (style: TextStyleMode) => void;
}

interface ThemeItem {
  id: ThemeMode;
  name: string;
  tagline: string;
  swatchBg: string;
  swatchSurface: string;
  swatchAccent: string;
  isLight?: boolean;
}

const THEMES: ThemeItem[] = [
  {
    id: 'dark',
    name: '深邃夜讀',
    tagline: '黑曜夜幕與暖珀燭光，深夜學習首選',
    swatchBg: 'bg-[#0a0a0a]',
    swatchSurface: 'bg-[#171717]',
    swatchAccent: 'bg-[#fbbf24]',
  },
  {
    id: 'light',
    name: '極簡日光',
    tagline: '清透北歐自然採光，明亮護眼不疲倦',
    swatchBg: 'bg-[#f8fafc]',
    swatchSurface: 'bg-[#ffffff]',
    swatchAccent: 'bg-[#d97706]',
    isLight: true,
  },
  {
    id: 'kyoto',
    name: '和風茶室',
    tagline: '手作和紙與溫潤木紋，心如止水',
    swatchBg: 'bg-[#f4efe4]',
    swatchSurface: 'bg-[#eae3d2]',
    swatchAccent: 'bg-[#7b5836]',
    isLight: true,
  },
  {
    id: 'forest',
    name: '林間竹影',
    tagline: '深山松林與苔原森綠，放鬆平復焦慮',
    swatchBg: 'bg-[#08120d]',
    swatchSurface: 'bg-[#0f2017]',
    swatchAccent: 'bg-[#10b981]',
  },
  {
    id: 'sunset',
    name: '暮色咖啡',
    tagline: '黃昏咖啡館與暖心摩卡，愜意溫柔',
    swatchBg: 'bg-[#150d12]',
    swatchSurface: 'bg-[#22141c]',
    swatchAccent: 'bg-[#f43f5e]',
  },
  {
    id: 'retro',
    name: '復古琥珀終端',
    tagline: '早期 CRT 琥珀磷光螢幕，黑客極客復古風',
    swatchBg: 'bg-[#0b0d02]',
    swatchSurface: 'bg-[#141804]',
    swatchAccent: 'bg-[#eab308]',
  },
  {
    id: 'halloween',
    name: '🎃 Q版萌鬼萬聖',
    tagline: '南瓜夜派對！小幽靈、糖果與魔法藥水陪伴心流',
    swatchBg: 'bg-[#12091f]',
    swatchSurface: 'bg-[#201235]',
    swatchAccent: 'bg-[#ff7a18]',
  },
  {
    id: 'christmas',
    name: '🎄 Q版暖雪聖誕',
    tagline: '暖心雪人與聖誕樹！薑餅屋、紅綠鈴鐺與飄雪氛圍',
    swatchBg: 'bg-[#0a1c14]',
    swatchSurface: 'bg-[#142c20]',
    swatchAccent: 'bg-[#ef4444]',
  },
];

const CLOCK_STYLES: { id: ClockStyle; name: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'ring',
    name: '圓形心流進度環',
    desc: '平滑動態進度外環，直覺感受時間剩餘比例',
    icon: <CircleDot className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'flip',
    name: '復古翻頁日曆鐘',
    desc: '擬真機械翻頁卡片設計，復古沉靜',
    icon: <Clock className="w-5 h-5 text-sky-400" />,
  },
  {
    id: 'minimal',
    name: '極簡巨幅數字',
    desc: '無外環純粹大字體，極致純淨無多餘干擾',
    icon: <AlignJustify className="w-5 h-5 text-emerald-400" />,
  },
];

interface TextStyleItem {
  id: TextStyleMode;
  name: string;
  desc: string;
  previewClass: string;
  previewSample: string;
  badge: string;
}

const TEXT_STYLES: TextStyleItem[] = [
  {
    id: 'default',
    name: '現代純粹 (Default)',
    desc: '極簡清爽無襯線，清晰專注無干擾',
    previewClass: 'text-fx-default text-neutral-100',
    previewSample: '25:00',
    badge: '經典',
  },
  {
    id: 'neon',
    name: '霓虹賽博 (Cyber Neon)',
    desc: '賽博龐克光暈與電流動態律動',
    previewClass: 'text-fx-neon',
    previewSample: '25:00',
    badge: '流光動態',
  },
  {
    id: 'aurora',
    name: '流光金輝 (Liquid Aurora)',
    desc: '動態彩虹漸變流光，如液態金屬流動',
    previewClass: 'text-fx-aurora',
    previewSample: '25:00',
    badge: '流光動態',
  },
  {
    id: 'pixel',
    name: '復古像素 (8-Bit Arcade)',
    desc: '懷舊街機像素風格與微頻率 CRT 閃爍',
    previewClass: 'text-fx-pixel',
    previewSample: '25:00',
    badge: '街機動態',
  },
  {
    id: 'matrix',
    name: '駭客矩陣 (Matrix Terminal)',
    desc: '經典極客螢光綠，數位掃描呼吸脈衝',
    previewClass: 'text-fx-matrix',
    previewSample: '25:00',
    badge: '脈衝動態',
  },
  {
    id: 'cosmic',
    name: '星際璀璨 (Cosmic Stardust)',
    desc: '浩瀚星雲紫粉璀璨與星塵微光浮動',
    previewClass: 'text-fx-cosmic',
    previewSample: '25:00',
    badge: '璀璨動態',
  },
  {
    id: 'literary',
    name: '典雅墨韻 (Literary Serif)',
    desc: '古典襯線典雅字體，伴隨溫潤呼吸墨影',
    previewClass: 'text-fx-literary',
    previewSample: '25:00',
    badge: '呼吸動態',
  },
];

export const ThemeStyleModal: React.FC<ThemeStyleModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentClockStyle,
  onSelectClockStyle,
  currentTextStyle = 'default',
  onSelectTextStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 text-base">畫面風格與時鐘視覺</h3>
              <p className="text-xs text-neutral-400">挑選契合你當下心境的讀書氛圍</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Themes Grid */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            讀書環境主題 (8 種氛圍與 Q 版節慶)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map(theme => {
              const isSelected = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                      <span>{theme.name}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-tight mb-3">
                    {theme.tagline}
                  </p>

                  {/* Swatch palette preview */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800/80">
                    <div className={`w-5 h-5 rounded-md border border-white/10 ${theme.swatchBg}`} title="背景色" />
                    <div className={`w-5 h-5 rounded-md border border-white/10 ${theme.swatchSurface}`} title="卡片色" />
                    <div className={`w-5 h-5 rounded-md border border-white/10 ${theme.swatchAccent}`} title="強調色" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Clock Styles */}
        <div className="mt-6 pt-5 border-t border-neutral-800 space-y-3">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            時鐘顯示樣式
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CLOCK_STYLES.map(style => {
              const isSelected = currentClockStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => onSelectClockStyle(style.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {style.icon}
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-xs font-semibold text-neutral-100">{style.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">{style.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Text & Typography Styles with Dynamic FX */}
        <div className="mt-6 pt-5 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>動態文字風格與時鐘特效 (7 款藝術字體)</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEXT_STYLES.map(style => {
              const isSelected = (currentTextStyle || 'default') === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => onSelectTextStyle?.(style.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
                      <span>{style.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                        {style.badge}
                      </span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>

                  <p className="text-[11px] text-neutral-400 mb-3 leading-tight">
                    {style.desc}
                  </p>

                  {/* Animated Dynamic Text Preview Box */}
                  <div className="h-12 rounded-xl bg-black/40 border border-neutral-800/80 flex items-center justify-center px-4 overflow-hidden shadow-inner">
                    <span className={`text-2xl font-bold tracking-tight select-none ${style.previewClass}`}>
                      {style.previewSample}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors font-semibold"
          >
            完成風格設定
          </button>
        </div>
      </div>
    </div>
  );
};
