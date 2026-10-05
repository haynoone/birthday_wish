/**
 * Audio controller & sound synthesizers using HTMLAudio and Web Audio API
 */
import defaultBackgroundMusic from '../assets/music/background.mp3';
import { experienceConfig } from '../config/experienceConfig';

export type AudioTrackType = 'default' | 'birthday';

const DEFAULT_BG_MUSIC_URL = defaultBackgroundMusic || '/assets/music/background.mp3';

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private currentTrack: AudioTrackType | null = null;
  private isBgmPlaying = false;
  private isMuted = false;
  private userManuallyPaused = false;
  private synthLoopId: number | null = null;
  private listeners: Set<() => void> = new Set();
  private gestureListenerAdded = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getTrackType(): AudioTrackType | null {
    return this.currentTrack;
  }

  public getCurrentTrackTitle(): string {
    if (this.currentTrack === 'birthday') {
      return experienceConfig.music.title || 'Birthday Mix';
    }
    return 'Atmospheric Soundtrack';
  }

  public initBackgroundMusic(url?: string) {
    if (url) {
      this.switchTrack('birthday', url, false);
    } else {
      this.playDefaultMusic(false);
    }
  }

  /**
   * Play default background music (src/assets/music/background.mp3)
   * for landing page, login page, and pre-terminal scenes
   */
  public playDefaultMusic(autoStart = true) {
    this.switchTrack('default', DEFAULT_BG_MUSIC_URL, autoStart);
  }

  /**
   * Play birthday celebration music for terminalMessage3D and onwards
   */
  public playBirthdayMusic(autoStart = true) {
    const birthdayUrl = experienceConfig.music.url || '/assets/music/birthday-unlock.mp3';
    this.switchTrack('birthday', birthdayUrl, autoStart);
  }

  private switchTrack(track: AudioTrackType, url: string, autoStart: boolean) {
    // If already initialized and playing this track, don't restart
    if (this.currentTrack === track && this.bgAudio) {
      if (autoStart && !this.userManuallyPaused && !this.isBgmPlaying && !this.isMuted) {
        this.startMusic();
      }
      return;
    }

    // Changing track: stop and release current track
    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
        this.bgAudio.src = '';
      } catch {
        // ignore
      }
      this.bgAudio = null;
    }
    this.stopSynthMelody();

    this.currentTrack = track;

    try {
      this.bgAudio = new Audio(url);
      this.bgAudio.loop = true;
      this.bgAudio.volume = track === 'birthday' ? 0.45 : 0.4;
      this.bgAudio.crossOrigin = 'anonymous';

      this.bgAudio.addEventListener('play', () => {
        this.isBgmPlaying = true;
        this.notify();
      });

      this.bgAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
        this.notify();
      });

      this.bgAudio.addEventListener('error', (err) => {
        console.warn(`Audio playback error for ${track} track:`, err);
        if (track === 'birthday' && this.isBgmPlaying) {
          this.startSynthMelody();
        }
      });
    } catch (e) {
      console.warn('Failed to init audio track', e);
    }

    // Set up gesture fallback in case browser policy blocks initial autoplay
    this.setupAutoplayGestureHandler();

    if (autoStart && !this.userManuallyPaused && !this.isMuted) {
      this.startMusic();
    }
  }

  private setupAutoplayGestureHandler() {
    if (this.gestureListenerAdded || typeof window === 'undefined') return;
    this.gestureListenerAdded = true;

    const onFirstUserInteraction = () => {
      this.gestureListenerAdded = false;
      if (!this.userManuallyPaused && !this.isMuted && !this.isBgmPlaying) {
        if (this.bgAudio) {
          this.bgAudio
            .play()
            .then(() => {
              this.isBgmPlaying = true;
              this.notify();
            })
            .catch(() => {});
        }
      }
    };

    window.addEventListener('click', onFirstUserInteraction, { once: true, capture: true });
    window.addEventListener('touchstart', onFirstUserInteraction, { once: true, capture: true });
    window.addEventListener('keydown', onFirstUserInteraction, { once: true, capture: true });
  }

  public async startMusic() {
    if (this.isMuted) return;
    this.userManuallyPaused = false;

    // If no track initialized, default to default music
    if (!this.bgAudio) {
      this.playDefaultMusic(false);
    }

    if (this.bgAudio) {
      try {
        await this.bgAudio.play();
        this.isBgmPlaying = true;
        this.notify();
        return;
      } catch (err) {
        console.log('Audio autoplay prevented by browser policy; awaiting gesture', err);
        this.setupAutoplayGestureHandler();
      }
    }

    // Fallback: WebAudio sweet ambient melody for birthday track
    if (this.currentTrack === 'birthday') {
      this.startSynthMelody();
      this.isBgmPlaying = true;
      this.notify();
    }
  }

  public pauseMusic() {
    this.userManuallyPaused = true;
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.stopSynthMelody();
    this.isBgmPlaying = false;
    this.notify();
  }

  public toggleMusic() {
    if (this.isBgmPlaying) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgAudio) {
      this.bgAudio.muted = this.isMuted;
    }
    if (this.isMuted && this.isBgmPlaying) {
      this.pauseMusic();
    } else if (!this.isMuted && !this.isBgmPlaying) {
      this.startMusic();
    }
    this.notify();
  }

  public isPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Play /assets/music/birthday-unlock.mp3 with 1-2s fade-in
   */
  public playBirthdayUnlock(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (this.bgAudio) {
          this.bgAudio.pause();
        }
        this.stopSynthMelody();

        const audio = new Audio('/assets/music/birthday-unlock.mp3');
        audio.volume = 0;
        this.bgAudio = audio;
        this.isBgmPlaying = true;
        this.notify();

        audio
          .play()
          .then(() => {
            // Fade in over 1.5s (1–2s)
            const startTime = performance.now();
            const targetVolume = this.isMuted ? 0 : 0.7;
            const fadeDuration = 1500;

            const fadeInterval = setInterval(() => {
              const elapsed = performance.now() - startTime;
              const progress = Math.min(elapsed / fadeDuration, 1);
              if (audio) {
                audio.volume = progress * targetVolume;
              }
              if (progress >= 1) {
                clearInterval(fadeInterval);
                resolve();
              }
            }, 50);
          })
          .catch((err) => {
            console.log('Unlock audio playback note:', err);
            // Fallback: sweet synth celebration
            this.startSynthMelody();
            resolve();
          });
      } catch (err) {
        console.warn('Could not initialize unlock music:', err);
        resolve();
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- Web Audio Chimes & Sound Effects ---

  // Cute pop click
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // Card Flip Whoosh
  public playCardFlip() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  // Success Match Chime (sweet major chord)
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Soft, lush celebration chord & magical chime arpeggio for celebration effects
  public playCelebrationSoftSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Soft warm bass anchor
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(261.63, now); // C4 warm root
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.0005, now + 1.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 1.25);

      // Sweet sparkling music-box chime notes (E5, G5, B5, D6, G6, B6)
      const chimeNotes = [659.25, 783.99, 987.77, 1174.66, 1567.98, 1975.53];
      chimeNotes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternating sine and triangle for sparkling bell-like warmth
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.07, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, noteTime + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    } catch {
      // ignore
    }
  }

  // Wrong guess gentle boop
  public playBuzzer() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // ignore
    }
  }

  // Playful Volcano Eruption rumble & sparkle
  public playVolcanoEruption() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      // Low warm rumble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      // High sparkles
      [880, 1174.66, 1318.51].forEach((f, i) => {
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = 'triangle';
        sOsc.frequency.setValueAtTime(f, ctx.currentTime + 0.1 + i * 0.06);
        sGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.1 + i * 0.06);
        sGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.06);

        sOsc.connect(sGain);
        sGain.connect(ctx.destination);

        sOsc.start(ctx.currentTime + 0.1 + i * 0.06);
        sOsc.stop(ctx.currentTime + 0.45 + i * 0.06);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Subtle, adorable kitten 'meow' sound synthesized via Web Audio API.
   * Emulates real feline vocal formants (m-ee-o-w pitch bend, formant bandpass filter, and harmonics).
   */
  public playMeow(variant: 'meow' | 'chirp' | 'purr' = 'meow') {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Slight random pitch variation (+/- 4%) so rapid clicks feel organic & lively
      const pitchVar = 0.96 + Math.random() * 0.08;

      if (variant === 'chirp') {
        // Quick inquisitive kitten chirp/mew (ideal for fast clicks on poses & compass)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        const startFreq = 720 * pitchVar;
        const peakFreq = 1040 * pitchVar;
        const endFreq = 860 * pitchVar;
        const duration = 0.16;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(1.8, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
        return;
      }

      // Classic sweet kitten meow (~0.38s)
      const duration = 0.38;

      // Dual oscillator: Warm fundamental sine + gentle harmonic triangle
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscGain1 = ctx.createGain();
      const oscGain2 = ctx.createGain();

      // Formant filter to produce the characteristic feline "m-e-e-o-w" acoustic shift
      const formantFilter = ctx.createBiquadFilter();
      formantFilter.type = 'bandpass';
      formantFilter.Q.setValueAtTime(2.2, now);
      // Sweep formant from 1200Hz to 1600Hz ("ee") down to 820Hz ("ow")
      formantFilter.frequency.setValueAtTime(1200, now);
      formantFilter.frequency.exponentialRampToValueAtTime(1600, now + 0.11);
      formantFilter.frequency.exponentialRampToValueAtTime(820, now + duration);

      // Pitch trajectory:
      // Starts around 640 Hz (nasal "m"), swoops up to 890 Hz ("ee"), then glides down to 490 Hz ("ow")
      const fStart = 640 * pitchVar;
      const fPeak = 890 * pitchVar;
      const fEnd = 490 * pitchVar;

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fStart, now);
      osc1.frequency.exponentialRampToValueAtTime(fPeak, now + 0.11);
      osc1.frequency.exponentialRampToValueAtTime(fEnd, now + duration);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(fStart * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(fPeak * 1.5, now + 0.11);
      osc2.frequency.exponentialRampToValueAtTime(fEnd * 1.5, now + duration);

      // Master gain envelope
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      // Soft gentle attack
      masterGain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      // Subtle sustain during vowel
      masterGain.gain.setValueAtTime(0.14, now + 0.14);
      // Smooth fade out as mouth closes
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscGain1.gain.setValueAtTime(0.85, now);
      oscGain2.gain.setValueAtTime(0.22, now);

      osc1.connect(oscGain1);
      osc2.connect(oscGain2);

      oscGain1.connect(formantFilter);
      oscGain2.connect(formantFilter);

      formantFilter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.02);
      osc2.stop(now + duration + 0.02);
    } catch {
      // ignore
    }
  }

  // Cozy Lo-fi Birthday Synth Loop Fallback
  private startSynthMelody() {
    if (this.synthLoopId !== null) return;
    // Pentatonic happy birthday tune notes (in Hz)
    const melody = [
      392.0, 392.0, 440.0, 392.0, 523.25, 493.88, 0,
      392.0, 392.0, 440.0, 392.0, 587.33, 523.25, 0,
      392.0, 392.0, 783.99, 659.25, 523.25, 493.88, 440.0, 0,
      698.46, 698.46, 659.25, 523.25, 587.33, 523.25, 0
    ];
    let noteIndex = 0;

    const tick = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      try {
        const ctx = this.getAudioContext();
        const freq = melody[noteIndex % melody.length];
        if (freq > 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }
        noteIndex++;
      } catch {
        // ignore
      }
      this.synthLoopId = window.setTimeout(tick, 350);
    };

    tick();
  }

  private stopSynthMelody() {
    if (this.synthLoopId !== null) {
      clearTimeout(this.synthLoopId);
      this.synthLoopId = null;
    }
  }
}

export const sound = new SoundEngine();
