/**
 * Cishan Folk Horror Psychoacoustic Web Audio Engine (中式民俗恐怖声学合成引擎)
 * Zero external audio files — 100% procedural Web Audio synthesis:
 * - 阴锣 (Metallic detuned funeral brass gong with inharmonic shimmer)
 * - 招魂唢呐 (Eerie nasal double-reed pitch-bent funeral suona wail)
 * - 祠堂木鱼与三更梆子 (Hollow temple wooden fish & night-watch clapper)
 * - 扎彩冥纸摩擦声 & 贴耳祝由低语 (Binaural paper effigy rustle & close-ear whisper)
 * - 起轿迎亲终局音墙 (Full-screen funeral procession climax stinger)
 */
class FolkHorrorAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.droneGain = null;
    this.enabled = false;
    this.lowScare = false;
    this.muyuTimer = null;
    this.curseLevel = 0;
  }

  init(lowScare = false) {
    this.lowScare = lowScare;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.enabled = true;
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 6;
    comp.connect(this.ctx.destination);

    this.master = this.ctx.createGain();
    this.master.gain.value = lowScare ? 0.42 : 0.88;
    this.master.connect(comp);

    // 4-second textured noise buffer for wind, paper rustle, and breath
    const sr = this.ctx.sampleRate;
    const len = sr * 4;
    this.noiseBuffer = this.ctx.createBuffer(1, len, sr);
    const ch = this.noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.04 * w) / 1.04;
      ch[i] = last * 1.8 + w * 0.12;
    }

    // Mountain shrine night wind & hollow incense hall resonance
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.03;
    this.droneGain.connect(this.master);

    const lowDrone = this.ctx.createOscillator();
    lowDrone.type = 'sine';
    lowDrone.frequency.value = 46.25; // Deep ancestral hall sub-resonance
    const lowGain = this.ctx.createGain();
    lowGain.gain.value = 0.55;
    lowDrone.connect(lowGain);
    lowGain.connect(this.droneGain);
    lowDrone.start();

    const fifthOsc = this.ctx.createOscillator();
    fifthOsc.type = 'triangle';
    fifthOsc.frequency.value = 68.8; // Slightly flat hollow fifth (uncanny ritual tuning)
    const fFilter = this.ctx.createBiquadFilter();
    fFilter.type = 'lowpass';
    fFilter.frequency.value = 150;
    const fGain = this.ctx.createGain();
    fGain.gain.value = 0.25;
    fifthOsc.connect(fFilter);
    fFilter.connect(fGain);
    fGain.connect(this.droneGain);
    fifthOsc.start();

    const windSrc = this.ctx.createBufferSource();
    windSrc.buffer = this.noiseBuffer;
    windSrc.loop = true;
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 310;
    this.windFilter.Q.value = 3.5;
    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.04;
    windSrc.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.master);
    windSrc.start();

    this.enabled = true;
  }

  toggleMute() {
    if (!this.ctx) {
      this.init(false);
      return true;
    }
    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(
      this.enabled ? (this.lowScare ? 0.42 : 0.88) : 0,
      now,
      0.08
    );
    return this.enabled;
  }

  setCurseDepth(d) {
    this.curseLevel = Math.max(0, Math.min(1, d));
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.setTargetAtTime(0.03 + this.curseLevel * 0.24, now, 0.25);
    this.windGain.gain.setTargetAtTime(0.03 + this.curseLevel * 0.14, now, 0.25);
    this.windFilter.frequency.setTargetAtTime(280 + this.curseLevel * 290, now, 0.3);
  }

  /**
   * Hollow Temple Wooden Fish (木鱼) or Midnight Bamboo Clapper (打更梆子)
   */
  playMuyu(pan = 0, pitch = 390, isClapper = false) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      panner.connect(this.master);
    }
    const dest = panner || this.master;

    const osc = this.ctx.createOscillator();
    osc.type = isClapper ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(pitch * 1.18, now);
    osc.frequency.exponentialRampToValueAtTime(pitch, now + 0.022);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.72, now + 0.19);

    const cavity = this.ctx.createBiquadFilter();
    cavity.type = 'bandpass';
    cavity.frequency.value = pitch * 1.05;
    cavity.Q.value = isClapper ? 8.5 : 5.5;

    const g = this.ctx.createGain();
    const peak = this.lowScare ? 0.32 : 0.68;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (isClapper ? 0.16 : 0.26));

    osc.connect(cavity);
    cavity.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Metallic Detuned Funeral Brass Gong (阴锣 — downward pitch bend!)
   * Real Chinese funeral/opera "阴锣 / 苏锣" bends slightly downward or shimmers inharmonically
   */
  playFuneralGong(intensity = 0.8) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const scale = intensity * (this.lowScare ? 0.42 : 0.88);

    // Inharmonic metallic partials with eerie downward pitch glide
    const ratios = [1.0, 1.38, 1.94, 2.47, 3.19, 4.31];
    const base = 168;
    ratios.forEach((r, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(base * r * 1.04, now);
      osc.frequency.exponentialRampToValueAtTime(base * r * 0.94, now + 1.8);

      const g = this.ctx.createGain();
      const partialVol = (scale * 0.26) / (idx * 0.65 + 1);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(partialVol, now + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.1 - idx * 0.28);

      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 3.2);
    });

    // Metallic strike wash
    const crash = this.ctx.createBufferSource();
    crash.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1850;
    bp.Q.value = 2.4;
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(scale * 0.35, now);
    cg.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    crash.connect(bp);
    bp.connect(cg);
    cg.connect(this.master);
    crash.start(now, 0, 1.5);
  }

  /**
   * Distant Eerie Funeral Suona Wail (凄厉走音唢呐哭腔)
   * Double-reed nasal sawtooth + resonant horn formant + mournful pitch-bend vibrato
   */
  playGhostSuona(duration = 2.8, distant = true) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    // Traditional mournful minor/sliding cry: F5 -> G#5 -> G5 (sliding flat) -> D5
    osc.frequency.setValueAtTime(587.3, now);
    osc.frequency.linearRampToValueAtTime(698.5, now + 0.35);
    osc.frequency.linearRampToValueAtTime(678.0, now + 1.35); // Microtonal weeping bend
    osc.frequency.linearRampToValueAtTime(554.3, now + duration);

    // Wide human-like weeping vibrato LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 5.8;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 16;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Nasal conical bore formant filters
    const nasal1 = this.ctx.createBiquadFilter();
    nasal1.type = 'bandpass';
    nasal1.frequency.value = 1420;
    nasal1.Q.value = 4.8;

    const distFilter = this.ctx.createBiquadFilter();
    distFilter.type = 'lowpass';
    distFilter.frequency.value = distant ? 2100 : 4800;

    const env = this.ctx.createGain();
    const vol = (distant ? 0.16 : 0.42) * (this.lowScare ? 0.45 : 1.0);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(vol, now + 0.18);
    env.gain.setValueAtTime(vol * 0.9, now + duration * 0.68);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(nasal1);
    nasal1.connect(distFilter);
    distFilter.connect(env);
    env.connect(this.master);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration + 0.05);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Dry Paper Effigy Rustle / Brush Stroke / Whispered Breath beside one ear
   */
  playPaperWhisper(pan = -0.9, duration = 1.9) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.setValueAtTime(1250, now);
    hp.frequency.linearRampToValueAtTime(2400, now + duration * 0.5);
    hp.frequency.linearRampToValueAtTime(900, now + duration);
    hp.Q.value = 3.8;

    const g = this.ctx.createGain();
    const v = this.lowScare ? 0.25 : 0.58;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(v, now + 0.22);
    g.gain.linearRampToValueAtTime(v * 0.3, now + 0.65);
    g.gain.linearRampToValueAtTime(v * 0.9, now + 1.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.value = pan;
      panner.connect(this.master);
    }
    src.connect(hp);
    hp.connect(g);
    g.connect(panner || this.master);
    src.start(now);
    src.stop(now + duration + 0.05);
  }

  /**
   * Play the Midnight Watch 0-7-1-5 Clapper Code (三更梆子暗码: 慢击与快击)
   * Plays atmospheric night rain + sedan footsteps + rhythmic bamboo clapper
   */
  playNightWatchCode() {
    if (!this.ctx) this.init(false);
    if (!this.enabled) return;

    // Distant gong + paper rustle
    this.playFuneralGong(0.45);
    setTimeout(() => this.playGhostSuona(2.5, true), 450);

    // Distinct bamboo clapper strikes right-to-left: 7 strikes? No, rhythmic 4-group clapper + whisper
    const timings = [300, 650, 1200, 1420, 1640];
    timings.forEach((ms, i) => {
      setTimeout(() => {
        this.playMuyu(-0.7 + i * 0.35, 780, true);
      }, ms);
    });
  }

  /**
   * Play crackling fire when burning the yellow talisman contract...
   * followed by DEAD SILENCE... then THE BRIDAL SEDAN BREACH!
   */
  triggerBurningClimax(onFireDone, onStrike) {
    if (!this.ctx) this.init(false);
    const now = this.ctx ? this.ctx.currentTime : 0;

    // 1. Crackling paper fire for 1.8s
    if (this.ctx && this.enabled) {
      const fireSrc = this.ctx.createBufferSource();
      fireSrc.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1600;
      bp.Q.value = 1.4;
      const fg = this.ctx.createGain();
      fg.gain.setValueAtTime(0.38, now);
      fg.gain.exponentialRampToValueAtTime(0.001, now + 1.75);
      fireSrc.connect(bp);
      bp.connect(fg);
      fg.connect(this.master);
      fireSrc.start(now, 0, 1.8);

      // Cut ambient drone into terrifying vacuum silence at 1.8s
      this.droneGain.gain.linearRampToValueAtTime(0, now + 1.7);
      this.windGain.gain.linearRampToValueAtTime(0, now + 1.7);
    }

    // 2. Ash reveal in dead silence ("阳间文书烧成灰，阴司才算正式收讫")
    setTimeout(() => {
      if (typeof onFireDone === 'function') onFireDone();
      // Sudden rapid wooden-fish taps accelerating right behind your neck!
      [0, 260, 470, 630, 750, 840].forEach((d, idx) => {
        setTimeout(() => this.playMuyu(idx % 2 === 0 ? -0.95 : 0.95, 420 + idx * 35, false), d);
      });
    }, 1850);

    // 3. FULL BRIDAL SEDAN & BLEEDING PAPER EFFIGY BREACH!
    setTimeout(() => {
      if (typeof onStrike === 'function') onStrike();
      this.playFuneralGong(1.15);
      this.playGhostSuona(2.4, false);
      this.playPaperWhisper(-0.95, 1.6);
      this.playPaperWhisper(0.95, 1.6);

      if (this.ctx && this.enabled) {
        const t = this.ctx.currentTime;
        const scale = this.lowScare ? 0.35 : 0.92;
        // Piercing dissonant double-suona tritone shriek
        [740, 783.99, 1480, 92.5].forEach((f, i) => {
          const o = this.ctx.createOscillator();
          o.type = i === 3 ? 'sawtooth' : 'square';
          o.frequency.setValueAtTime(f, t);
          o.frequency.linearRampToValueAtTime(f * (i % 2 === 0 ? 0.91 : 1.09), t + 1.7);
          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime((i === 3 ? 0.38 : 0.14) * scale, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 1.85);
          o.connect(g);
          g.connect(this.master);
          o.start(t);
          o.stop(t + 1.9);
        });
        this.droneGain.gain.setTargetAtTime(0.24, t + 2.0, 0.8);
      }
    }, 3150);
  }
}

window.folkAudio = new FolkHorrorAudio();
