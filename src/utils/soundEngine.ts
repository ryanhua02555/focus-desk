/**
 * Web Audio API procedural sound engine for ambient soundscapes and study timer chimes.
 * Requires 0 external audio files, works fully offline and resiliently.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientNodes: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play notification chime for timer completions
  public playAlarm(type: 'tibetan-bell' | 'marimba' | 'zen-gong' | 'soft-beep' = 'tibetan-bell', volume: number = 0.8) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.7, now);
      masterGain.connect(ctx.destination);

      if (type === 'tibetan-bell' || type === 'zen-gong') {
        // Multi-harmonic singing bowl / meditation bell
        const freqs = type === 'zen-gong' ? [216, 432, 648, 864] : [528, 1056, 1584, 2112];
        const decay = type === 'zen-gong' ? 4.5 : 3.8;

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          // Harmonic decay: higher harmonics decay faster
          const harmonicGain = 1 / (idx * 1.5 + 1);
          gain.gain.setValueAtTime(harmonicGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay / (idx + 1));

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + decay);
        });
      } else if (type === 'marimba') {
        // Melodic 3-note ascending cheerful chime
        const notes = [440, 554.37, 659.25]; // A4, C#5, E5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + i * 0.14;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.6, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.85);
        });
      } else {
        // Soft digital beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1174.66, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  // Soft mechanical tick sound for countdown
  public playTick(volume: number = 0.2) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // ignore
    }
  }

  // Procedural Noise Buffer Generator
  private createNoiseBuffer(duration = 5): AudioBuffer {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Start or adjust an ambient soundscape
  public setAmbientSound(
    soundId: 'rain' | 'cafe' | 'forest' | 'waves' | 'fire' | 'whiteNoise',
    volume: number // 0 to 1
  ) {
    const existing = this.ambientNodes.get(soundId);

    // If volume is 0, stop the sound
    if (volume <= 0.01) {
      if (existing) {
        existing.stop();
        this.ambientNodes.delete(soundId);
      }
      return;
    }

    // If already playing, just update volume smoothly
    if (existing) {
      const ctx = this.getContext();
      existing.gain.gain.setTargetAtTime(volume * 0.5, ctx.currentTime, 0.2);
      return;
    }

    try {
      const ctx = this.getContext();
      const noiseBuffer = this.createNoiseBuffer(5);
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume * 0.5, ctx.currentTime + 0.5);

      if (soundId === 'rain') {
        // Rain: Pink/Lowpass filtered noise with slight resonance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(200, ctx.currentTime);

        source.connect(filter);
        filter.connect(highpass);
        highpass.connect(gain);
      } else if (soundId === 'waves') {
        // Ocean waves: Lowpass noise modulated by LFO
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave period

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.35, ctx.currentTime);

        lfo.connect(lfoGain.gain);
        source.connect(filter);
        filter.connect(gain);
        lfo.start();
      } else if (soundId === 'forest') {
        // Forest breeze: Bandpass sweeping gently
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
      } else if (soundId === 'cafe') {
        // Cozy Cafe: warm low-mid hum
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
      } else if (soundId === 'fire') {
        // Fire crackle: lowpass rumble
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
      } else {
        // White noise
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
      }

      gain.connect(ctx.destination);
      source.start();

      this.ambientNodes.set(soundId, {
        gain,
        stop: () => {
          try {
            gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
            setTimeout(() => {
              try {
                source.stop();
                source.disconnect();
              } catch {
                // ignore
              }
            }, 500);
          } catch {
            // ignore
          }
        },
      });
    } catch (e) {
      console.warn('Failed to start ambient sound:', e);
    }
  }

  // Stop all active ambient sounds
  public stopAllAmbients() {
    this.ambientNodes.forEach(node => node.stop());
    this.ambientNodes.clear();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllAmbients();
    }
  }
}

export const soundEngine = new SoundEngine();
