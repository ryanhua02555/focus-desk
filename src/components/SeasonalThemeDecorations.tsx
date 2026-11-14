import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types/pomodoro';
import { Sparkles, X, Heart, Volume2 } from 'lucide-react';

interface SeasonalThemeDecorationsProps {
  theme: ThemeMode;
}

const HALLOWEEN_MESSAGES = [
  'Boo! 🎃 專注魔法加成中～',
  '糖果給認真學習的你！🍬',
  '黑貓正趴在書堆旁守護你 🐾',
  '沉浸在知識的魔法大鍋中 ✨',
  '不給番茄就搗蛋！👻',
];

const CHRISTMAS_MESSAGES = [
  'Merry Focus! ❄️ 暖雪靜心陪伴中',
  '今天也是在為夢想積攢星光 ⭐',
  '自習桌前就是最溫暖的薑餅屋 🍪',
  '給未來的自己最好的聖誕禮物 🎁',
  '深讀完喝一杯暖暖的熱可可吧 ☕',
];

export const SeasonalThemeDecorations: React.FC<SeasonalThemeDecorationsProps> = ({ theme }) => {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubbleTimeoutId, setBubbleTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset bubble when theme changes
  useEffect(() => {
    setBubbleText(null);
    setIsDismissed(false);
  }, [theme]);

  if (theme !== 'halloween' && theme !== 'christmas') {
    return null;
  }

  const handleCharacterClick = () => {
    if (bubbleTimeoutId) clearTimeout(bubbleTimeoutId);
    const messages = theme === 'halloween' ? HALLOWEEN_MESSAGES : CHRISTMAS_MESSAGES;
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setBubbleText(randomMsg);

    const id = setTimeout(() => {
      setBubbleText(null);
    }, 4000);
    setBubbleTimeoutId(id);
  };

  return (
    <>
      {/* 1. Snowflakes background for Christmas */}
      {theme === 'christmas' && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const left = (i * 4.2) % 100;
            const duration = 5 + (i % 5) * 2;
            const delay = (i % 6) * 1.2;
            const size = 10 + (i % 3) * 6;
            const opacity = 0.3 + (i % 4) * 0.18;
            return (
              <span
                key={i}
                className="absolute text-white select-none"
                style={{
                  left: `${left}%`,
                  top: '-20px',
                  fontSize: `${size}px`,
                  opacity,
                  animation: `snow-fall ${duration}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                ❄
              </span>
            );
          })}
        </div>
      )}

      {/* 2. Mystical Floating Candies / Magic Orbs for Halloween */}
      {theme === 'halloween' && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => {
            const left = (i * 6.3) % 100;
            const top = 10 + (i * 5.5) % 80;
            const duration = 6 + (i % 4) * 2;
            const delay = (i % 5) * 0.9;
            const icon = i % 4 === 0 ? '✨' : i % 4 === 1 ? '🍬' : i % 4 === 2 ? '🦇' : '🌟';
            return (
              <span
                key={i}
                className="absolute select-none opacity-20 hover:opacity-80 transition-opacity"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: '14px',
                  animation: `cute-float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                {icon}
              </span>
            );
          })}
        </div>
      )}

      {/* 3. Interactive Cute Festive Companion in Bottom Right */}
      {!isDismissed && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
          {/* Speech Bubble */}
          {bubbleText && (
            <div className="mb-2 px-3 py-1.5 rounded-2xl bg-white/95 text-neutral-900 shadow-xl border border-amber-300 text-xs font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[200px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{bubbleText}</span>
            </div>
          )}

          {/* Character Container */}
          <div className="relative group flex items-center">
            {/* Close small badge */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] z-10"
              title="暫時隱藏吉祥物"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Clickable Cute Character */}
            <button
              onClick={handleCharacterClick}
              className="p-2.5 rounded-2xl cursor-pointer transition-transform active:scale-95 hover:scale-105 flex items-center gap-2 shadow-xl border backdrop-blur-md"
              style={{
                backgroundColor: theme === 'halloween' ? 'rgba(38, 20, 56, 0.85)' : 'rgba(20, 44, 32, 0.85)',
                borderColor: theme === 'halloween' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(239, 68, 68, 0.4)',
              }}
              title="點擊萌萌夥伴獲取專注祝福！"
            >
              {theme === 'halloween' ? (
                // Chibi Ghost Character
                <div className="flex items-center gap-2">
                  <div className="relative animate-cute-float text-3xl">
                    <span>👻</span>
                    <span className="absolute -top-1 -right-1 text-sm animate-bounce">🎃</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
                      <span>萌鬼自習伴</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-300">Q版</span>
                    </div>
                    <div className="text-[9px] text-purple-300">點我互動・注入魔法</div>
                  </div>
                </div>
              ) : (
                // Chibi Snowman Character
                <div className="flex items-center gap-2">
                  <div className="relative animate-cute-bounce text-3xl">
                    <span>⛄</span>
                    <span className="absolute -top-1 -right-1 text-sm animate-pulse">🎄</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <span>暖雪小雪人</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/20 text-red-300">Q版</span>
                    </div>
                    <div className="text-[9px] text-emerald-200/80">點我互動・傳送溫暖</div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

