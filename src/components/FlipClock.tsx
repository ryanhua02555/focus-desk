import React, { useState, useEffect, useRef } from 'react';

interface FlipDigitProps {
  digit: string;
}

export const FlipDigit: React.FC<FlipDigitProps> = ({ digit }) => {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    if (digit !== prevDigitRef.current) {
      setPrevious(prevDigitRef.current);
      setCurrent(digit);
      setIsFlipping(true);
      prevDigitRef.current = digit;

      const timer = setTimeout(() => {
        setIsFlipping(false);
        setPrevious(digit);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <div className="relative w-12 sm:w-16 md:w-20 h-18 sm:h-24 md:h-28 rounded-xl select-none perspective-[800px]">
      {/* 1. Static Upper Half (Shows NEW / CURRENT digit top) */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-xl bg-neutral-900 border-t border-x border-neutral-800 shadow-inner flex items-end justify-center z-0">
        <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 tabular-nums translate-y-[50%]">
          {current}
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      </div>

      {/* 2. Static Lower Half (Shows PREVIOUS / CURRENT digit bottom) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-xl bg-neutral-900 border-b border-x border-neutral-800 shadow-inner flex items-start justify-center z-0">
        <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 tabular-nums -translate-y-[50%]">
          {isFlipping ? previous : current}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* 3. Flipping Upper Card (Flips down from 0deg to -90deg, showing PREVIOUS digit top) */}
      {isFlipping && (
        <div
          className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-xl bg-neutral-900 border-t border-x border-neutral-800 flex items-end justify-center origin-bottom z-20 animate-flip-top"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 tabular-nums translate-y-[50%]">
            {previous}
          </span>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />
        </div>
      )}

      {/* 4. Flipping Lower Card (Flips down from 90deg to 0deg, showing CURRENT digit bottom) */}
      {isFlipping && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-xl bg-neutral-900 border-b border-x border-neutral-800 flex items-start justify-center origin-top z-10 animate-flip-bottom"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 tabular-nums -translate-y-[50%]">
            {current}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Center Dividing Slit & Side Mechanical Notches */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-950 z-30 -translate-y-1/2" />
      <div className="absolute top-1/2 left-[-3px] w-2 h-2.5 bg-neutral-950 rounded-r -translate-y-1/2 z-30 border-r border-neutral-800" />
      <div className="absolute top-1/2 right-[-3px] w-2 h-2.5 bg-neutral-950 rounded-l -translate-y-1/2 z-30 border-l border-neutral-800" />
    </div>
  );
};

interface FlipClockDisplayProps {
  hours?: number;
  minutes: number;
  seconds: number;
  onClick?: () => void;
  modeLabel?: string;
}

export const FlipClockDisplay: React.FC<FlipClockDisplayProps> = ({
  hours = 0,
  minutes,
  seconds,
  onClick,
  modeLabel,
}) => {
  const hrStr = String(hours).padStart(2, '0');
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');

  const hrTens = hrStr[0];
  const hrUnits = hrStr[1];
  const minTens = minStr[0];
  const minUnits = minStr[1];
  const secTens = secStr[0];
  const secUnits = secStr[1];

  return (
    <div
      onClick={onClick}
      className="my-6 flex flex-col items-center cursor-pointer group select-none"
      title="點擊自訂時間（小時/分/秒）"
    >
      <div className="flex items-center gap-1.5 sm:gap-3 p-3.5 sm:p-6 bg-neutral-950/70 border border-neutral-800/80 hover:border-amber-500/40 rounded-3xl shadow-2xl transition-all">
        {/* Optional Hours Section (shows if hours > 0) */}
        {hours > 0 && (
          <>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <FlipDigit digit={hrTens} />
                <FlipDigit digit={hrUnits} />
              </div>
              <span className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest mt-2.5 font-mono">
                HOURS
              </span>
            </div>

            {/* Colon */}
            <div className="flex flex-col gap-2.5 sm:gap-4 px-0.5 sm:px-1">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/90 shadow-md shadow-amber-500/50" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/90 shadow-md shadow-amber-500/50" />
            </div>
          </>
        )}

        {/* Minutes Section */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <FlipDigit digit={minTens} />
            <FlipDigit digit={minUnits} />
          </div>
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest mt-2.5 font-mono">
            MINUTES
          </span>
        </div>

        {/* Colon separator */}
        <div className="flex flex-col gap-2.5 sm:gap-4 px-0.5 sm:px-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/90 shadow-md shadow-amber-500/50" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/90 shadow-md shadow-amber-500/50" />
        </div>

        {/* Seconds Section */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <FlipDigit digit={secTens} />
            <FlipDigit digit={secUnits} />
          </div>
          <span className="text-[10px] sm:text-xs text-amber-400/80 uppercase tracking-widest mt-2.5 font-mono">
            SECONDS
          </span>
        </div>
      </div>

      {modeLabel && (
        <div className="text-xs font-medium mt-3 tracking-wider text-amber-400/90 group-hover:text-amber-300 transition-colors uppercase">
          {modeLabel} · 點擊卡片自訂時長
        </div>
      )}
    </div>
  );
};

