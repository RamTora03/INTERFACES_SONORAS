export interface Track {
  id: string;
  name: string;
  bpm: number;
  key: string;
  color: string;
  neonShadow: string;
  description: string;
  url?: string; // Preloaded mp3 streaming url
  notes?: {
    bass: string[]; // Bass notes (e.g., "D3", "F3") mapped in sequences
    synth: string[]; // Chord or lead notes
    vocal: string[]; // Formant vocal indexes/frequencies
    duration: number; // grid size (e.g. 16 or 32 steps)
  };
}

export interface DeckState {
  isPlaying: boolean;
  playbackRate: number; // Speed, default 1.0 (corresponds to pitch)
  currentTrackId: string;
  isScratching: boolean;
  scratchSpeed: number;
  filterCutoff: number; // 0 to 1
  filterResonance: number; // 0 to 1
  filterType: 'lowpass' | 'highpass' | 'bandpass';
  delayFeedback: number; // 0 to 0.95
  delayTime: number; // 0 to 1
  distortionAmount: number; // 0 to 1
  eqLow: number; // -12 to +12 dB
  eqMid: number; // -12 to +12 dB
  eqHigh: number; // -12 to +12 dB
  volume: number; // 0 to 1
}

export interface SoundboardPad {
  id: string;
  label: string;
  subLabel: string;
  color: string;
}
