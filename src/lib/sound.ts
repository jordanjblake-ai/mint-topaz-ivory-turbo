import type { SoundBed } from "@/data/scenes";

type Stopper = () => void;

function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

type AudioContextCtor = typeof AudioContext;

function AudioContextClass(): AudioContextCtor | null {
  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export class HybridSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private tag: HTMLAudioElement | null = null;
  private enabled = true;
  private started = false;
  private current: SoundBed | null = null;
  private pendingBed: SoundBed = "open";
  private stopCurrent: Stopper | null = null;
  private timers: number[] = [];
  private cuePlayed = false;
  private listeners = new Set<(running: boolean) => void>();

  get isStarted() {
    return this.started;
  }

  get isRunning() {
    return this.ctx?.state === "running";
  }

  onRunning(fn: (running: boolean) => void) {
    this.listeners.add(fn);
    fn(this.isRunning);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /** Must be called synchronously from a tap/click. Never from scroll. */
  unlock() {
    this.unlockMedia();
    this.ensureContext();
    this.kick();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume().then(() => {
        this.kick();
        this.notify();
        this.afterRunning();
      });
    } else if (ctx.state === "running") {
      this.afterRunning();
    }
    this.notify();
  }

  async start() {
    this.unlock();
    if (this.ctx?.state === "suspended") {
      try {
        await this.ctx.resume();
        this.kick();
        this.afterRunning();
        this.notify();
      } catch {
        /* autoplay */
      }
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(on ? 0.82 : 0, ctx.currentTime + 0.16);
  }

  setBed(bed: SoundBed) {
    this.pendingBed = bed;
    if (!this.ctx || !this.bus) return;
    if (bed === this.current) return;
    this.crossfade(bed);
  }

  dispose() {
    this.clearTimers();
    this.stopCurrent?.();
    this.stopCurrent = null;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.bus = null;
    this.started = false;
    this.current = null;
    if (this.tag) {
      this.tag.pause();
      this.tag.remove();
      this.tag = null;
    }
  }

  private notify() {
    const running = this.isRunning;
    this.listeners.forEach((fn) => fn(running));
  }

  private afterRunning() {
    if (!this.enabled) return;
    if (!this.current) this.setBed(this.pendingBed);
    this.playCue();
  }

  private unlockMedia() {
    if (!this.tag) {
      const tag = document.createElement("audio");
      tag.setAttribute("playsinline", "true");
      tag.setAttribute("webkit-playsinline", "true");
      tag.preload = "auto";
      tag.src = SILENT_WAV;
      tag.loop = false;
      tag.volume = 0.01;
      tag.style.display = "none";
      document.body.appendChild(tag);
      this.tag = tag;
    }
    const p = this.tag.play();
    if (p) void p.catch(() => {});
  }

  private ensureContext() {
    if (this.ctx && this.ctx.state === "closed") {
      this.ctx = null;
      this.master = null;
      this.bus = null;
      this.started = false;
      this.current = null;
    }
    if (this.ctx) return;
    const AC = AudioContextClass();
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = this.enabled ? 0.82 : 0;
    master.connect(ctx.destination);
    const bus = ctx.createGain();
    bus.connect(master);
    this.ctx = ctx;
    this.master = master;
    this.bus = bus;
    this.noise = this.makeNoise(3);
    this.started = true;
    ctx.addEventListener("statechange", () => this.notify());
  }

  private kick() {
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
    } catch {
      /* ignore */
    }
  }

  private playCue() {
    if (this.cuePlayed || !this.bus || !this.enabled) return;
    this.cuePlayed = true;
    this.ball(this.bus, 0.55);
    window.setTimeout(() => {
      if (this.bus && this.enabled) this.whistle(this.bus, 0.16);
    }, 280);
  }

  private crossfade(bed: SoundBed) {
    const ctx = this.ctx!;
    const oldBus = this.bus!;
    const next = ctx.createGain();
    next.gain.value = 0;
    next.connect(this.master!);
    this.bus = next;
    const prevStop = this.stopCurrent;
    this.clearTimers();
    this.current = bed;
    this.stopCurrent = this.build(bed, next);
    const now = ctx.currentTime;
    oldBus.gain.cancelScheduledValues(now);
    oldBus.gain.linearRampToValueAtTime(0, now + 1.15);
    next.gain.linearRampToValueAtTime(1, now + 1.25);
    window.setTimeout(() => {
      prevStop?.();
      try {
        oldBus.disconnect();
      } catch {
        /* already gone */
      }
    }, 1400);
  }

  private build(bed: SoundBed, dest: AudioNode): Stopper {
    const stops: Stopper[] = [];
    switch (bed) {
      case "open":
      case "founding":
        stops.push(this.wind(dest, 0.28, 0.18));
        stops.push(this.traffic(dest, 0.07));
        this.every(7200, 11000, () => this.ball(dest, 0.32));
        break;
      case "lanzarote":
        stops.push(this.ocean(dest, 0.34));
        this.every(9000, 15000, () => this.whistle(dest, 0.16));
        break;
      case "camp":
        stops.push(this.ocean(dest, 0.22));
        stops.push(this.voices(dest, 0.1));
        this.every(5000, 9000, () => this.spike(dest, 0.36));
        break;
      case "uk":
        stops.push(this.wind(dest, 0.32, 0.28));
        stops.push(this.ocean(dest, 0.12));
        this.every(4800, 8200, () => this.ball(dest, 0.34));
        break;
      case "london":
        stops.push(this.wind(dest, 0.2, 0.14));
        stops.push(this.traffic(dest, 0.1));
        stops.push(this.voices(dest, 0.08));
        this.every(6400, 10000, () => this.ball(dest, 0.26));
        break;
      case "champs":
        stops.push(this.crowd(dest, 0.24));
        this.champsCycle(dest);
        break;
      case "world":
        stops.push(this.airport(dest, 0.16));
        this.every(8000, 14000, () => this.whistle(dest, 0.15));
        break;
      case "dawn":
        stops.push(this.wind(dest, 0.08, 0.08));
        this.every(14000, 22000, () => this.ball(dest, 0.2));
        break;
    }
    return () => {
      this.clearTimers();
      stops.forEach((s) => s());
    };
  }

  private makeNoise(seconds: number) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = clamp(last * 0.97 + white * 0.03, -1, 1);
      data[i] = last * 3.2;
    }
    return buffer;
  }

  private loopNoise(
    dest: AudioNode,
    opts: {
      type?: BiquadFilterType;
      freq: number;
      q?: number;
      gain: number;
      lfo?: number;
      lfoDepth?: number;
    },
  ): Stopper {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.type ?? "bandpass";
    filter.frequency.value = opts.freq;
    filter.Q.value = opts.q ?? 0.7;
    const g = ctx.createGain();
    g.gain.value = opts.gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    if (opts.lfo) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = opts.lfo;
      lg.gain.value = opts.lfoDepth ?? opts.gain * 0.35;
      lfo.connect(lg);
      lg.connect(g.gain);
      lfo.start();
      src.start();
      return () => {
        try {
          lfo.stop();
          src.stop();
        } catch {
          /* closed */
        }
      };
    }
    src.start();
    return () => {
      try {
        src.stop();
      } catch {
        /* closed */
      }
    };
  }

  private wind(dest: AudioNode, gain: number, lfo: number) {
    return this.loopNoise(dest, {
      type: "bandpass",
      freq: 380,
      q: 0.55,
      gain,
      lfo,
      lfoDepth: gain * 0.4,
    });
  }

  private ocean(dest: AudioNode, gain: number) {
    return this.loopNoise(dest, {
      type: "lowpass",
      freq: 620,
      q: 0.4,
      gain,
      lfo: 0.08,
      lfoDepth: gain * 0.5,
    });
  }

  private traffic(dest: AudioNode, gain: number) {
    return this.loopNoise(dest, {
      type: "lowpass",
      freq: 140,
      q: 0.8,
      gain,
      lfo: 0.05,
      lfoDepth: gain * 0.4,
    });
  }

  private voices(dest: AudioNode, gain: number) {
    return this.loopNoise(dest, {
      type: "bandpass",
      freq: 1400,
      q: 1.1,
      gain,
      lfo: 0.22,
      lfoDepth: gain * 0.55,
    });
  }

  private crowd(dest: AudioNode, gain: number) {
    const a = this.loopNoise(dest, {
      type: "bandpass",
      freq: 900,
      q: 0.7,
      gain,
      lfo: 0.14,
      lfoDepth: gain * 0.45,
    });
    const b = this.loopNoise(dest, {
      type: "lowpass",
      freq: 280,
      q: 0.5,
      gain: gain * 0.6,
      lfo: 0.09,
      lfoDepth: gain * 0.3,
    });
    return () => {
      a();
      b();
    };
  }

  private airport(dest: AudioNode, gain: number) {
    const hum = this.loopNoise(dest, {
      type: "lowpass",
      freq: 220,
      q: 0.6,
      gain: gain * 0.8,
      lfo: 0.04,
      lfoDepth: gain * 0.2,
    });
    const pa = this.loopNoise(dest, {
      type: "bandpass",
      freq: 1800,
      q: 2.4,
      gain: gain * 0.35,
      lfo: 0.07,
      lfoDepth: gain * 0.25,
    });
    return () => {
      hum();
      pa();
    };
  }

  private ball(dest: AudioNode, gain: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
    og.gain.setValueAtTime(gain, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(og);
    og.connect(dest);
    osc.start(now);
    osc.stop(now + 0.3);

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(gain * 0.35, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    src.connect(f);
    f.connect(ng);
    ng.connect(dest);
    src.start(now);
    src.stop(now + 0.1);
  }

  private spike(dest: AudioNode, gain: number) {
    this.ball(dest, gain);
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime + 0.02;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2400;
    f.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain * 0.5, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(now);
    src.stop(now + 0.14);
  }

  private whistle(dest: AudioNode, gain: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1860, now);
    osc.frequency.linearRampToValueAtTime(2100, now + 0.18);
    osc.frequency.linearRampToValueAtTime(1760, now + 0.42);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.52);
  }

  private champsCycle(dest: AudioNode) {
    const run = () => {
      this.ball(dest, 0.12);
      this.timers.push(
        window.setTimeout(() => {
          this.spike(dest, 0.48);
        }, 1600),
      );
    };
    this.timers.push(window.setTimeout(run, 2200));
    this.timers.push(window.setInterval(run, 9800) as unknown as number);
  }

  private every(min: number, max: number, fn: () => void) {
    const schedule = () => {
      const wait = min + Math.random() * (max - min);
      const id = window.setTimeout(() => {
        fn();
        schedule();
      }, wait);
      this.timers.push(id);
    };
    schedule();
  }

  private clearTimers() {
    this.timers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.timers = [];
  }
}

export const hybridSound = new HybridSound();
