import React, { useEffect, useRef } from 'react';
import { DynamicBgEffect, ThemeMode } from '../types/pomodoro';

interface DynamicBackgroundProps {
  effect: DynamicBgEffect;
  theme?: ThemeMode;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ effect, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === 'none') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. STARS & SHOOTING STARS
    // ==========================================
    const stars = Array.from({ length: Math.min(120, Math.floor(width / 12)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));

    let shootingStar: { x: number; y: number; length: number; speed: number; angle: number; alpha: number; active: boolean } | null = null;
    let nextShootingStarTime = Date.now() + Math.random() * 4000 + 2000;

    // ==========================================
    // 2. RAIN & RIPPLES
    // ==========================================
    const raindrops = Array.from({ length: Math.min(90, Math.floor(width / 16)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 18 + 12,
      speed: Math.random() * 12 + 16,
      opacity: Math.random() * 0.35 + 0.15,
    }));

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }
    const ripples: Ripple[] = [];

    // ==========================================
    // 3. SAKURA CHERRY BLOSSOM PETALS
    // ==========================================
    const petals = Array.from({ length: Math.min(45, Math.floor(width / 30)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 6,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 1.5 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      opacity: Math.random() * 0.5 + 0.4,
    }));

    // ==========================================
    // 4. AURORA BOREALIS WAVES
    // ==========================================
    let auroraPhase = 0;

    // ==========================================
    // 5. FIRE EMBERS / SPARKS
    // ==========================================
    const embers = Array.from({ length: Math.min(65, Math.floor(width / 22)) }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 1.8 + 0.8,
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.8 + 0.2,
      decay: Math.random() * 0.006 + 0.003,
      color: Math.random() > 0.4 ? 'rgba(251, 146, 60,' : 'rgba(239, 68, 68,',
    }));

    // ==========================================
    // 6. SNOW PARTICLES
    // ==========================================
    const snowflakes = Array.from({ length: Math.min(80, Math.floor(width / 18)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      speedY: Math.random() * 1.2 + 0.6,
      wind: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    // ==========================================
    // 7. MATRIX CODE RAIN
    // ==========================================
    const matrixFontSize = 14;
    const matrixCols = Math.floor(width / matrixFontSize);
    const matrixDrops = Array.from({ length: matrixCols }, () => Math.floor(Math.random() * -50));
    const matrixChars = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

    // ==========================================
    // 8. BOKEH LIGHT ORBS
    // ==========================================
    const bokehOrbs = Array.from({ length: Math.min(22, Math.floor(width / 50)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 45 + 25,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.18 + 0.08,
      hue: Math.floor(Math.random() * 60 + 30), // Warm golden amber to rose
    }));

    const bubbles = Array.from({ length: Math.min(34, Math.floor(width / 32)) }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() * 18 + 8, speed: Math.random() * 0.7 + 0.25,
      drift: Math.random() * 0.5 + 0.2, phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.18 + 0.12, hue: Math.floor(Math.random() * 100 + 170),
    }));
    let cloudPhase = 0;
    const meteors = Array.from({ length: 7 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      length: Math.random() * 90 + 55, speed: Math.random() * 5 + 4,
      wait: Math.random() * 240,
    }));

    // ==========================================
    // RENDER LOOP
    // ==========================================
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // --- A. STARS ---
      if (effect === 'stars') {
        stars.forEach(s => {
          s.alpha += s.speed * s.twinkleDir;
          if (s.alpha > 0.9) s.twinkleDir = -1;
          else if (s.alpha < 0.2) s.twinkleDir = 1;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.fill();
        });

        // Shooting Star logic
        const now = Date.now();
        if (!shootingStar && now > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * (width * 0.7),
            y: Math.random() * (height * 0.4),
            length: Math.random() * 90 + 70,
            speed: Math.random() * 12 + 10,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            alpha: 1,
            active: true,
          };
          nextShootingStarTime = now + Math.random() * 6000 + 3500;
        }

        if (shootingStar && shootingStar.active) {
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.02;

          if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
          }
        }
      }

      // --- B. RAIN & RIPPLES ---
      else if (effect === 'rain') {
        ctx.lineWidth = 1.2;
        raindrops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.strokeStyle = `rgba(186, 230, 253, ${drop.opacity})`;
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 0.8;

          // Hit ground / bottom
          if (drop.y > height - 40) {
            if (Math.random() > 0.6) {
              ripples.push({
                x: drop.x,
                y: height - Math.random() * 30 - 5,
                radius: 1,
                maxRadius: Math.random() * 14 + 8,
                opacity: 0.45,
              });
            }
            drop.y = -drop.length;
            drop.x = Math.random() * (width + 50);
          }
        });

        // Draw ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${r.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          r.radius += 0.6;
          r.opacity -= 0.018;

          if (r.opacity <= 0 || r.radius >= r.maxRadius) {
            ripples.splice(i, 1);
          }
        }
      }

      // --- C. SAKURA PETALS ---
      else if (effect === 'sakura') {
        petals.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
          p.rotation += p.rotationSpeed;
          p.flip += p.flipSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(1, Math.cos(p.flip));

          // Draw a soft sakura petal
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.4, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
          ctx.fillStyle = `rgba(251, 207, 232, ${p.opacity})`;
          ctx.fill();
          ctx.restore();
        });
      }

      // --- D. AURORA BOREALIS ---
      else if (effect === 'aurora') {
        auroraPhase += 0.008;
        const wavesCount = 3;

        for (let w = 0; w < wavesCount; w++) {
          const baseHeight = height * (0.28 + w * 0.14);
          ctx.beginPath();
          ctx.moveTo(0, height);

          for (let x = 0; x <= width; x += 25) {
            const waveY =
              baseHeight +
              Math.sin(x * 0.003 + auroraPhase + w * 1.5) * 60 +
              Math.cos(x * 0.006 - auroraPhase * 0.8) * 35;
            ctx.lineTo(x, waveY);
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseHeight - 90, 0, height);
          if (w === 0) {
            grad.addColorStop(0, 'rgba(52, 211, 153, 0.16)');
            grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else if (w === 1) {
            grad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
            grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.07)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            grad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
            grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.05)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // --- E. FIRE EMBERS ---
      else if (effect === 'embers') {
        embers.forEach(e => {
          e.y -= e.speedY;
          e.x += e.speedX + Math.sin(e.y * 0.02) * 0.6;
          e.opacity -= e.decay;

          if (e.opacity <= 0 || e.y < -10) {
            e.y = height + Math.random() * 40;
            e.x = Math.random() * width;
            e.opacity = Math.random() * 0.8 + 0.3;
          }

          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${e.color} ${e.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // --- F. SNOW PARTICLES ---
      else if (effect === 'snow') {
        snowflakes.forEach(s => {
          s.y += s.speedY;
          s.x += s.wind + Math.sin(s.y * 0.015) * 0.4;

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.fill();
        });
      }

      // --- G. MATRIX CODE RAIN ---
      else if (effect === 'matrix') {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${matrixFontSize}px monospace`;

        for (let i = 0; i < matrixDrops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * matrixFontSize;
          const y = matrixDrops[i] * matrixFontSize;

          // Glowing white head, trailing green
          ctx.fillStyle = '#bbf7d0';
          ctx.fillText(char, x, y);

          ctx.fillStyle = '#22c55e';
          ctx.fillText(char, x, y - matrixFontSize);

          if (y > height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        }
      }

      // --- H. BOKEH LIGHT ORBS ---
      else if (effect === 'bokeh') {
        bokehOrbs.forEach(b => {
          b.y -= b.speedY;
          b.x += b.speedX;

          if (b.y < -b.radius * 2) {
            b.y = height + b.radius * 2;
            b.x = Math.random() * width;
          }

          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
          grad.addColorStop(0, `hsla(${b.hue}, 90%, 65%, ${b.opacity})`);
          grad.addColorStop(0.6, `hsla(${b.hue}, 80%, 55%, ${b.opacity * 0.4})`);
          grad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      // --- I. FLOATING IRIDESCENT BUBBLES ---
      else if (effect === 'bubbles') {
        bubbles.forEach(b => {
          b.y -= b.speed;
          b.x += Math.sin(b.phase + b.y * 0.008) * b.drift;
          if (b.y < -b.radius * 2) { b.y = height + b.radius; b.x = Math.random() * width; }
          const grad = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.35, 1, b.x, b.y, b.radius);
          grad.addColorStop(0, `hsla(${b.hue}, 90%, 90%, ${b.opacity * 0.8})`);
          grad.addColorStop(0.55, `hsla(${b.hue + 35}, 85%, 70%, ${b.opacity * 0.2})`);
          grad.addColorStop(1, `hsla(${b.hue}, 90%, 75%, ${b.opacity})`);
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad; ctx.fill();
          ctx.strokeStyle = `hsla(${b.hue + 25}, 90%, 90%, ${b.opacity + 0.12})`;
          ctx.lineWidth = 1; ctx.stroke();
        });
      }

      // --- J. SLOW MOVING COLOR CLOUDS ---
      else if (effect === 'clouds') {
        cloudPhase += 0.002;
        ['rgba(103, 232, 249, 0.07)', 'rgba(167, 139, 250, 0.065)', 'rgba(244, 114, 182, 0.05)'].forEach((color, i) => {
          const x = width * (0.2 + i * 0.3) + Math.sin(cloudPhase + i * 2) * width * 0.16;
          const y = height * (0.3 + i * 0.2) + Math.cos(cloudPhase * 0.8 + i) * height * 0.1;
          const radius = Math.max(width, height) * 0.42;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
          grad.addColorStop(0, color); grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
        });
      }

      // --- K. PERIODIC SHOOTING METEORS ---
      else if (effect === 'meteor') {
        meteors.forEach(m => {
          if (m.wait > 0) { m.wait -= 1; return; }
          const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y - m.length * 0.55);
          tail.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); tail.addColorStop(1, 'rgba(125, 211, 252, 0)');
          ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.length, m.y - m.length * 0.55);
          ctx.strokeStyle = tail; ctx.lineWidth = 2; ctx.stroke();
          ctx.beginPath(); ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; ctx.fill();
          m.x += m.speed; m.y += m.speed * 0.55;
          if (m.x - m.length > width || m.y - m.length * 0.55 > height) {
            m.x = Math.random() * width * 0.8; m.y = -Math.random() * height * 0.5;
            m.wait = Math.random() * 240 + 40;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect, theme]);

  if (effect === 'none') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.9 }}
    />
  );
};

