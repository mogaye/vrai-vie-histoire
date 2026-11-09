/**
 * Synthesizes the iconic Netflix "Ta-dum" sound using Web Audio API
 */
export function playNetflixTaDum(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First low thud (timpani/sub hit)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.8);

    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Second iconic swell / chord hit (starts ~100ms in)
    const t2 = now + 0.12;

    const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(f, t2);
      osc.frequency.linearRampToValueAtTime(f * 1.02, t2 + 0.7);

      gain.gain.setValueAtTime(0, t2);
      gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), t2 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t2 + 1.8);

      // Lowpass filter for warm cinematic feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t2);
      filter.frequency.exponentialRampToValueAtTime(300, t2 + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t2);
      osc.stop(t2 + 1.9);
    });
  } catch (err) {
    console.warn('Audio playback not permitted or supported yet:', err);
  }
}

export function playClickSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio autoplay restrictions
  }
}
