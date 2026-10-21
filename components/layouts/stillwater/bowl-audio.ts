// Yoga 6 · Stillwater — a singing bowl synthesised with Web Audio, so there
// are no samples to download. Struck, it rings out on a handful of partials,
// each a slightly detuned pair that beats (the bowl's slow "wah-wah"); rubbed
// round the rim, its fundamental swells and wobbles with a breath of friction.

/** Partials: frequency ratio, level, ring-out time (s) and the beat (Hz) within each pair. */
const PARTIALS = [
  { ratio: 1, level: 1, decay: 14, beat: 0.8 },
  { ratio: 2.76, level: 0.5, decay: 9, beat: 1.9 },
  { ratio: 5.18, level: 0.26, decay: 5, beat: 3.1 },
  { ratio: 8.2, level: 0.13, decay: 2.8, beat: 4.4 },
  { ratio: 11.9, level: 0.06, decay: 1.6, beat: 5.7 },
] as const;

/** G3 — a medium-sized bowl. */
const F0 = 196;
const VOLUME = 0.55;

interface Graph {
  ctx: AudioContext;
  /** Everything the bowl makes goes here (dry, plus a little room). */
  bus: GainNode;
  /** Master volume, for muting. */
  out: GainNode;
}

/** A room: a few seconds of decaying noise. */
function impulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  return buffer;
}

function noise(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** A partial as a beating pair of sines into `into`; returns the oscillators. */
function pair(ctx: AudioContext, into: AudioNode, freq: number, beat: number, level: number) {
  return [
    { f: freq - beat / 2, l: level },
    { f: freq + beat / 2, l: level * 0.55 },
  ].map(({ f, l }) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = f;
    const gain = ctx.createGain();
    gain.gain.value = l;
    osc.connect(gain).connect(into);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    return osc;
  });
}

export class SingingBowl {
  private graph: Graph | null = null;
  private rub: { level: GainNode; sources: AudioScheduledSourceNode[] } | null = null;
  private muted = false;

  /** Audio only starts inside a user gesture, so everything is built on first use. */
  private wake(): Graph {
    if (!this.graph) {
      const ctx = new AudioContext();
      const out = ctx.createGain();
      out.gain.value = this.muted ? 0 : VOLUME;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 12;
      comp.ratio.value = 4;
      const bus = ctx.createGain();
      const room = ctx.createConvolver();
      room.buffer = impulse(ctx, 3.2, 2.6);
      const wet = ctx.createGain();
      wet.gain.value = 0.32;
      bus.connect(out);
      bus.connect(room).connect(wet).connect(out);
      out.connect(comp).connect(ctx.destination);
      this.graph = { ctx, bus, out };
    }
    if (this.graph.ctx.state === "suspended") void this.graph.ctx.resume();
    return this.graph;
  }

  /** Strike the rim. `delay` (s) lines the sound up with the mallet landing on screen. */
  strike(strength = 1, delay = 0) {
    const { ctx, bus } = this.wake();
    const t = ctx.currentTime + delay;
    for (const p of PARTIALS) {
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.11 * strength, t + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);
      env.connect(bus);
      const oscs = pair(ctx, env, F0 * p.ratio, p.beat, p.level);
      for (const osc of oscs) {
        osc.start(t);
        osc.stop(t + p.decay + 0.05);
      }
      oscs[0].addEventListener("ended", () => env.disconnect());
    }
    // The mallet's soft knock.
    const knock = ctx.createBufferSource();
    knock.buffer = noise(ctx, 0.1);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 900;
    band.Q.value = 1.2;
    const knockGain = ctx.createGain();
    knockGain.gain.setValueAtTime(0.16 * strength, t);
    knockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    knock.connect(band).connect(knockGain).connect(bus);
    knock.start(t);
    knock.onended = () => knockGain.disconnect();
  }

  /** Start rubbing the rim: the bowl swells into song over a few seconds. */
  startSinging() {
    const { ctx, bus } = this.wake();
    if (this.rub) return;
    const t = ctx.currentTime;
    const level = ctx.createGain();
    level.gain.setValueAtTime(0, t);
    level.gain.setTargetAtTime(1, t, 1.1);
    // The tone wobbles as the stick goes round.
    const wobble = ctx.createGain();
    wobble.gain.value = 0.78;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1.7;
    const depth = ctx.createGain();
    depth.gain.value = 0.22;
    lfo.connect(depth).connect(wobble.gain);
    level.connect(wobble).connect(bus);
    const oscs = [...pair(ctx, level, F0, 0.8, 0.15), ...pair(ctx, level, F0 * 2.76, 1.9, 0.035)];
    // A breath of friction where the suede meets the rim.
    const hiss = ctx.createBufferSource();
    hiss.buffer = noise(ctx, 2);
    hiss.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1400;
    band.Q.value = 0.7;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.012;
    hiss.connect(band).connect(hissGain).connect(level);
    const sources = [...oscs, lfo, hiss];
    for (const s of sources) s.start(t);
    this.rub = { level, sources };
  }

  /** Lift the stick: the song rings on and fades. */
  stopSinging() {
    const rub = this.rub;
    if (!rub || !this.graph) return;
    this.rub = null;
    const t = this.graph.ctx.currentTime;
    const gain = rub.level.gain;
    gain.cancelScheduledValues(t);
    gain.setValueAtTime(gain.value, t);
    gain.setTargetAtTime(0, t, 1.6);
    for (const s of rub.sources) s.stop(t + 10);
    rub.sources[0].addEventListener("ended", () => rub.level.disconnect());
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    const g = this.graph;
    if (g) g.out.gain.setTargetAtTime(muted ? 0 : VOLUME, g.ctx.currentTime, 0.05);
  }

  dispose() {
    this.rub = null;
    void this.graph?.ctx.close();
    this.graph = null;
  }
}
