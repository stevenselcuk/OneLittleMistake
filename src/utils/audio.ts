let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  vol: number = 0.1,
  rampDown: boolean = true,
) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  if (rampDown) {
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  } else {
    gain.gain.setValueAtTime(0, audioCtx.currentTime + duration);
  }

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playLineSound = (player: 'P' | 'C') => {
  initAudio();
  // Player gets a slightly higher, crisper tone. Computer gets a lower tone.
  const freq = player === 'P' ? 880 : 659.25; // A5 or E5
  playTone(freq, 'sine', 0.15, 0.05);
};

export const playSquareSound = (player: 'P' | 'C') => {
  initAudio();
  const baseFreq = player === 'P' ? 880 : 659.25;

  // A quick, rewarding two-note arpeggio
  playTone(baseFreq, 'triangle', 0.2, 0.08);
  setTimeout(() => {
    playTone(baseFreq * 1.25, 'triangle', 0.4, 0.08); // Major third up
  }, 100);
};

export const playGameOverSound = (winner: 'P' | 'C' | 'Draw') => {
  initAudio();
  if (winner === 'P') {
    // Triumphant major chord
    playTone(523.25, 'sine', 1.5, 0.1); // C5
    playTone(659.25, 'sine', 1.5, 0.1); // E5
    playTone(783.99, 'sine', 1.5, 0.1); // G5
    playTone(1046.5, 'sine', 1.5, 0.1); // C6
  } else if (winner === 'C') {
    // Minor, descending or darker chord
    playTone(440, 'triangle', 1.5, 0.1); // A4
    playTone(523.25, 'triangle', 1.5, 0.1); // C5
    playTone(659.25, 'triangle', 1.5, 0.1); // E5
  } else {
    // Neutral draw chord
    playTone(440, 'sine', 1.5, 0.1);
    playTone(587.33, 'sine', 1.5, 0.1); // D5
    playTone(659.25, 'sine', 1.5, 0.1); // E5
  }
};
