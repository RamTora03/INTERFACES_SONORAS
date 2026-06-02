import { Track, DeckState } from './types';

// Map note names to frequencies
export const NOTE_FREQ: Record<string, number> = {
  // Octave 2
  'B2': 123.47, 'C#2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Bb2': 116.54, 'A2': 110.00,
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  // Octave 4
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00,
  '': 0, // Rest note
};

// Available tracks of Daft Punk
export const DAFT_TRACKS: Track[] = [
  {
    id: 'discovery_one_more_time',
    name: 'One More Time (Disco Real)',
    bpm: 123,
    key: 'G minor',
    color: '#FF0077',
    neonShadow: '0 0 10px #FF0077',
    description: 'Pista real de Discovery transmitida en alta definición. ¡Siente la potencia disco real!',
    url: 'https://archive.org/download/daft-punk-discovery-2001/01.%20One%20More%20Time.mp3',
    notes: { bass: [], synth: [], vocal: [], duration: 16 }
  },
  {
    id: 'discovery_aerodynamic',
    name: 'Aerodynamic (Disco Real)',
    bpm: 123,
    key: 'G minor',
    color: '#00F3FF',
    neonShadow: '0 0 10px #00F3FF',
    description: 'Pista de guitarra metal / sintetizador barroco real de Discovery en alta definición.',
    url: 'https://archive.org/download/daft-punk-discovery-2001/02.%20Aerodynamic.mp3',
    notes: { bass: [], synth: [], vocal: [], duration: 16 }
  },
  {
    id: 'discovery_digital_love',
    name: 'Digital Love (Disco Real)',
    bpm: 118,
    key: 'A major',
    color: '#FFEA00',
    neonShadow: '0 0 10px #FFEA00',
    description: 'El solo de sintetizador más tierno e inolvidable de Discovery en alta definición.',
    url: 'https://archive.org/download/daft-punk-discovery-2001/03.%20Digital%20Love.mp3',
    notes: { bass: [], synth: [], vocal: [], duration: 16 }
  },
  {
    id: 'discovery_harder_better',
    name: 'Harder Better Faster Stronger (Disco Real)',
    bpm: 123,
    key: 'F# minor',
    color: '#9D00FF',
    neonShadow: '0 0 10px #9D00FF',
    description: 'El loop de vocoder más famoso de la historia de la música electrónica en alta definición.',
    url: 'https://archive.org/download/daft-punk-discovery-2001/04.%20Harder%2C%20Better%2C%20Faster%2C%20Stronger.mp3',
    notes: { bass: [], synth: [], vocal: [], duration: 16 }
  },
  {
    id: 'around_the_world',
    name: 'Around the World',
    bpm: 121,
    key: 'D minor',
    color: '#00F3FF', // Cyan loop
    neonShadow: '0 0 10px #00F3FF',
    description: 'El clásico bassline hipnótico de Homework con filtros progresivos.',
    notes: {
      bass:  ['D3', '', 'D3', 'F3', '', 'G3', 'A3', '', 'C4', '', 'A3', 'G3', 'F3', '', 'F3', ''],
      synth: ['A4', 'A4', 'G4', 'F4', 'D4', 'D4', 'F4', 'G4', 'A4', 'A4', 'G4', 'F4', 'D4', 'D4', '', ''],
      vocal: ['A4', 'C5', 'A4', 'G4', 'F4', 'G4', 'F4', 'D4', 'A4', 'C5', 'A4', 'G4', 'F4', 'A4', 'G4', 'D4'],
      duration: 16
    }
  },
  {
    id: 'one_more_time',
    name: 'One More Time',
    bpm: 123,
    key: 'G minor',
    color: '#FF0077', // Neon pink
    neonShadow: '0 0 10px #FF0077',
    description: 'El himno de Discovery con vientos sintetizados y vocoder disco.',
    notes: {
      bass:  ['G3', 'G3', '', 'Eb3', 'Eb3', '', 'F3', 'F3', '', 'Bb3', 'Bb3', '', 'G3', 'F3', 'Eb3', 'D3'],
      synth: ['Bb4', 'C5', 'D5', 'Bb4', 'C5', 'D5', 'F5', 'D5', 'Bb4', 'C5', 'D5', 'Bb4', 'F4', 'G4', 'A4', 'Bb4'],
      vocal: ['D4', 'F4', 'Bb4', 'A4', 'G4', 'A4', 'G4', 'F4', 'D4', 'F4', 'Bb4', 'A4', 'G4', 'F4', 'G4', 'D4'],
      duration: 16
    }
  },
  {
    id: 'harder_better',
    name: 'Harder Better Faster Stronger',
    bpm: 123,
    key: 'F# minor',
    color: '#FFEA00', // Gold / Yellow
    neonShadow: '0 0 10px #FFEA00',
    description: 'Bucle electro-vocoder ultra rítmico con síncopa de sintetizador.',
    notes: {
      bass:  ['F#3', '', 'F#3', 'C#3', '', 'D3', '', 'A3', '', 'G#3', '', 'C#3', '', 'F#3', '', ''],
      synth: ['F#4', 'C#5', 'D5', 'A4', 'B4', 'C#5', 'E4', 'F#4', 'F#4', 'C#5', 'D5', 'A4', 'B4', 'E4', 'F#4', ''],
      vocal: ['F#4', 'B4', 'A4', 'G#4', 'F#4', 'G#4', 'F#4', 'C#4', 'F#4', 'B4', 'A4', 'G#4', 'F#4', 'B4', 'C#5', ''],
      duration: 16
    }
  },
  {
    id: 'robot_rock',
    name: 'Robot Rock',
    bpm: 112,
    key: 'D major',
    color: '#9D00FF', // Purple
    neonShadow: '0 0 10px #9D00FF',
    description: 'Riff distorsionado y voz metalizada directa del álbum Human After All.',
    notes: {
      bass:  ['D3', '', 'D3', 'D3', 'D4', 'C4', 'D4', '', 'G3', '', 'G3', 'G3', 'F3', '', 'F3', 'E3'],
      synth: ['D4', 'D4', 'D4', 'F#4', 'F#4', 'A4', 'D5', '', 'G4', 'G4', 'G4', 'B4', 'B4', 'D5', 'G5', ''],
      vocal: ['D3', 'D3', 'F3', 'D3', 'F3', 'A3', 'D4', '', 'D3', 'D3', 'F3', 'D3', 'F3', 'A3', 'D4', ''],
      duration: 16
    }
  },
  {
    id: 'get_lucky',
    name: 'Get Lucky',
    bpm: 116,
    key: 'B minor',
    color: '#00FF66', // Emerald / Green
    neonShadow: '0 0 10px #00FF66',
    description: '',
    notes: {
      bass:  ['B2', 'B2', '', 'D3', 'D3', '', 'F#3', 'F#3', '', 'E3', 'E3', '', 'D3', '', 'C#3', 'B2'],
      synth: ['F#4', 'B4', 'D5', 'F#5', 'A4', 'D5', 'F#5', 'A5', 'C#5', 'F#5', 'A5', 'C#6', 'B4', 'E5', 'G#5', 'B5'],
      vocal: ['D4', 'E4', 'F#4', 'D4', 'A4', 'F#4', 'E4', 'D4', 'C#4', 'D4', 'E4', 'C#4', 'G#4', 'E4', 'D4', 'C#4'],
      duration: 16
    }
  }
];

// Synth DJ Performance Pad items
export const VOCODER_PADS = [
  { id: 'airhorn', label: 'AIR HORN', subLabel: 'REGGAE DROP', color: '#FF0055' },
  { id: 'siren', label: 'REVO SIREN', subLabel: 'WARRIOR ALARM', color: '#00F3FF' },
  { id: 'laser', label: 'LASER SHOT', subLabel: 'CYBER BLAST', color: '#00FF66' },
  { id: 'sub_drop', label: 'SUB DROP', subLabel: '808 BASS BOOM', color: '#9D00FF' },
  { id: 'white_whoosh', label: 'WHITE RISER', subLabel: 'SWEEP RISE', color: '#FFEA00' },
  { id: 'scratch_cut', label: 'SCRATCH JUMP', subLabel: 'VINYL FLARE', color: '#FF00AA' },
  { id: 'reverb_snare', label: 'CLUB SNARE', subLabel: 'CHAMBER GATED', color: '#00FAFF' },
  { id: 'cowbell', label: '808 COWBELL', subLabel: 'RETRO CHIP', color: '#FF7700' },
  { id: 'laser_echo', label: 'RICOCHET', subLabel: 'GLITCH SPACE', color: '#AAFF00' },
  { id: 'sub_kick', label: 'CLUB IMPACT', subLabel: 'SUB BOOM', color: '#FF0055' },
  { id: 'tape_stop', label: 'TAPE STOP', subLabel: 'SLOW VINYL', color: '#9D00FF' },
  { id: 'beep_alert', label: 'GLITCH BEAT', subLabel: 'BEEP CHIP', color: '#00FF66' }
];

export class DaftAudioEngine {
  public ctx: AudioContext | null = null;
  
  // Channels
  public analyserA: AnalyserNode | null = null;
  public analyserB: AnalyserNode | null = null;
  
  // Real-time play offsets and tracking (Crucial for scratching & scrubbing)
  public playOffsetA: number = 0;
  public playOffsetB: number = 0;
  private lastPlayStartedTimeA: number = 0;
  private lastPlayStartedTimeB: number = 0;
  
  // Volume controls & Node routing
  private masterGain: GainNode | null = null;
  private channelA_Gain: GainNode | null = null;
  private channelB_Gain: GainNode | null = null;
  
  // EQ channels
  private eqA: BiquadFilterNode[] = [];
  private eqB: BiquadFilterNode[] = [];
  
  // Master effects
  private masterFilter: BiquadFilterNode | null = null;
  
  // Channel Effects
  private filterA: BiquadFilterNode | null = null;
  private filterB: BiquadFilterNode | null = null;
  
  private delayA: DelayNode | null = null;
  private delayGainA: GainNode | null = null;
  private delayB: DelayNode | null = null;
  private delayGainB: GainNode | null = null;
  
  private distortionA: WaveShaperNode | null = null;
  private distortionB: WaveShaperNode | null = null;

  // Sequencer loop trackers
  private stepInterval: any = null;
  public stepA = 0;
  public stepB = 0;
  private timeA = 0;
  private timeB = 0;
  
  // State Refs
  private stateA: DeckState = {
    isPlaying: false,
    playbackRate: 1.0,
    currentTrackId: 'around_the_world',
    isScratching: false,
    scratchSpeed: 0,
    filterCutoff: 0.5,
    filterResonance: 0.1,
    filterType: 'lowpass',
    delayFeedback: 0.0,
    delayTime: 0.25,
    distortionAmount: 0.0,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    volume: 0.8
  };

  private stateB: DeckState = {
    isPlaying: false,
    playbackRate: 1.0,
    currentTrackId: 'one_more_time',
    isScratching: false,
    scratchSpeed: 0,
    filterCutoff: 0.5,
    filterResonance: 0.1,
    filterType: 'lowpass',
    delayFeedback: 0.0,
    delayTime: 0.25,
    distortionAmount: 0.0,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    volume: 0.8
  };

  private crossfaderVal = 0.5; // 0 to 1
  private masterVol = 0.85;

  // White noise buffer for drum sweeps, hats & claps
  private noiseBuffer: AudioBuffer | null = null;

  // Real-time custom audio file players and cache
  public decodedBuffers: Map<string, AudioBuffer> = new Map();
  private activeSourceA: AudioBufferSourceNode | null = null;
  private activeSourceB: AudioBufferSourceNode | null = null;
  public customTracks: Track[] = [];

  constructor() {
    // Created lazily upon user interaction
  }

  // Register loaded custom track details
  public registerCustomTrack(track: Track, buffer: AudioBuffer) {
    if (!this.customTracks.some(t => t.id === track.id)) {
      this.customTracks.push(track);
    }
    this.decodedBuffers.set(track.id, buffer);
  }

  // Helper to decode a Blob or ArrayBuffer into our map
  public async decodeAudioFile(trackId: string, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.ctx) {
      this.init();
    }
    if (!this.ctx) {
      throw new Error("ctx could not be initialized");
    }
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.decodedBuffers.set(trackId, buffer);
    return buffer;
  }

  public findTrack(trackId: string): Track {
    const isCustom = this.isRealTrack(trackId);
    if (isCustom) {
      const found = this.customTracks.find(t => t.id === trackId);
      if (found) return found;
    }
    return DAFT_TRACKS.find(t => t.id === trackId) || DAFT_TRACKS[0];
  }

  public isRealTrack(trackId: string): boolean {
    return trackId.startsWith('custom_') || trackId.startsWith('discovery_') || this.decodedBuffers.has(trackId);
  }

  private syncAudioSourcePlayState(deck: 'A' | 'B') {
    if (!this.ctx) return;
    const state = deck === 'A' ? this.stateA : this.stateB;
    const activeSrc = deck === 'A' ? this.activeSourceA : this.activeSourceB;
    const dest = deck === 'A' ? this.analyserA : this.analyserB;

    const isCustom = this.isRealTrack(state.currentTrackId);

    if (!isCustom || !state.isPlaying || state.isScratching) {
      if (activeSrc) {
        try {
          activeSrc.stop();
        } catch (e) {
          // Already stopped
        }
        if (deck === 'A') this.activeSourceA = null;
        else this.activeSourceB = null;

        // Save current play offset on stop
        if (deck === 'A' && this.lastPlayStartedTimeA > 0) {
          const elapsed = (this.ctx.currentTime - this.lastPlayStartedTimeA) * this.stateA.playbackRate;
          this.playOffsetA = this.playOffsetA + elapsed;
          this.lastPlayStartedTimeA = 0;
        } else if (deck === 'B' && this.lastPlayStartedTimeB > 0) {
          const elapsed = (this.ctx.currentTime - this.lastPlayStartedTimeB) * this.stateB.playbackRate;
          this.playOffsetB = this.playOffsetB + elapsed;
          this.lastPlayStartedTimeB = 0;
        }
      }
      return;
    }

    const buffer = this.decodedBuffers.get(state.currentTrackId);
    if (!buffer) {
      return;
    }

    if (activeSrc) {
      activeSrc.playbackRate.setValueAtTime(state.playbackRate, this.ctx.currentTime);
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    if (dest) {
      source.connect(dest);
    }
    source.playbackRate.setValueAtTime(state.playbackRate, this.ctx.currentTime);

    // Play from saved offset modulo buffer duration
    const savedOffset = deck === 'A' ? this.playOffsetA : this.playOffsetB;
    const safeOffset = Math.max(0, savedOffset % buffer.duration);
    source.start(0, safeOffset);

    if (deck === 'A') {
      this.activeSourceA = source;
      this.lastPlayStartedTimeA = this.ctx.currentTime;
    } else {
      this.activeSourceB = source;
      this.lastPlayStartedTimeB = this.ctx.currentTime;
    }
  }

  // Initialize Audio Context on click
  public init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create Analysers
    this.analyserA = this.ctx.createAnalyser();
    this.analyserA.fftSize = 256;
    this.analyserB = this.ctx.createAnalyser();
    this.analyserB.fftSize = 256;
    
    // Create Noise Buffer
    this.createNoiseBuffer();

    // Setup Master Routing
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
    
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
    
    // Connect to outputs
    this.masterGain.connect(this.masterFilter);
    this.masterFilter.connect(this.ctx.destination);

    // Initial Routing setup for Deck A & B
    this.setupDeckRouting('A', this.analyserA);
    this.setupDeckRouting('B', this.analyserB);

    // Set Initial values
    this.updateEQ('A');
    this.updateEQ('B');
    this.updateFilter('A');
    this.updateFilter('B');
    this.updateDelay('A');
    this.updateDelay('B');
    this.updateDistortion('A');
    this.updateDistortion('B');
    this.updateCrossfader(this.crossfaderVal);

    // Start Sequencer Clock
    this.startSequencerClock();
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  private setupDeckRouting(deck: 'A' | 'B', analyser: AnalyserNode) {
    if (!this.ctx || !this.masterGain) return;

    // Direct Channel Gain Node
    const chanGain = this.ctx.createGain();
    chanGain.gain.setValueAtTime(deck === 'A' ? this.stateA.volume : this.stateB.volume, this.ctx.currentTime);
    
    if (deck === 'A') this.channelA_Gain = chanGain;
    else this.channelB_Gain = chanGain;

    // Filter node
    const filter = this.ctx.createBiquadFilter();
    filter.type = deck === 'A' ? this.stateA.filterType : this.stateB.filterType;
    if (deck === 'A') this.filterA = filter;
    else this.filterB = filter;

    // Distortion
    const shaper = this.ctx.createWaveShaper();
    shaper.oversample = '4x';
    if (deck === 'A') this.distortionA = shaper;
    else this.distortionB = shaper;

    // EQ Nodes (Low, Mid, High in Series)
    const eqLow = this.ctx.createBiquadFilter();
    eqLow.type = 'lowshelf';
    eqLow.frequency.setValueAtTime(250, this.ctx.currentTime);

    const eqMid = this.ctx.createBiquadFilter();
    eqMid.type = 'peaking';
    eqMid.frequency.setValueAtTime(1000, this.ctx.currentTime);
    eqMid.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const eqHigh = this.ctx.createBiquadFilter();
    eqHigh.type = 'highshelf';
    eqHigh.frequency.setValueAtTime(4000, this.ctx.currentTime);

    if (deck === 'A') this.eqA = [eqLow, eqMid, eqHigh];
    else this.eqB = [eqLow, eqMid, eqHigh];

    // Delay Node and Delay Loop
    const delay = this.ctx.createDelay(1.0);
    const delayGain = this.ctx.createGain();
    
    if (deck === 'A') {
      this.delayA = delay;
      this.delayGainA = delayGain;
    } else {
      this.delayB = delay;
      this.delayGainB = delayGain;
    }

    // Wiring Series Chain:
    // Source -> Analyser -> EQ Low -> EQ Mid -> EQ High -> Distortion -> Filter -> Channel Gain -> Master Gain
    // And Parallel Delay path out from EQ High back into Channel Gain
    
    // Connect parts of pipeline together
    analyser.connect(eqLow);
    eqLow.connect(eqMid);
    eqMid.connect(eqHigh);
    eqHigh.connect(shaper);
    shaper.connect(filter);
    filter.connect(chanGain);
    chanGain.connect(this.masterGain);

    // Parallel Delay Loop
    eqHigh.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delay); // Feedback
    delayGain.connect(chanGain); // Mix with dry signal
  }

  // --- SETTERS & UPDATE HELPERS ---

  public setDeckState(deck: 'A' | 'B', updates: Partial<DeckState>) {
    if (deck === 'A') {
      if (updates.currentTrackId !== undefined) {
        this.playOffsetA = 0;
        this.lastPlayStartedTimeA = 0;
      }
      this.stateA = { ...this.stateA, ...updates };
      
      // Update real Audio Nodes if active
      if (this.ctx) {
        if (updates.volume !== undefined && this.channelA_Gain) {
          this.channelA_Gain.gain.setTargetAtTime(updates.volume, this.ctx.currentTime, 0.02);
        }
        if (updates.filterCutoff !== undefined || updates.filterResonance !== undefined || updates.filterType !== undefined) {
          this.updateFilter('A');
        }
        if (updates.delayFeedback !== undefined || updates.delayTime !== undefined) {
          this.updateDelay('A');
        }
        if (updates.distortionAmount !== undefined) {
          this.updateDistortion('A');
        }
        if (updates.eqLow !== undefined || updates.eqMid !== undefined || updates.eqHigh !== undefined) {
          this.updateEQ('A');
        }

        // Custom player speed sync
        if (updates.playbackRate !== undefined && this.activeSourceA) {
          this.activeSourceA.playbackRate.setValueAtTime(this.stateA.playbackRate, this.ctx.currentTime);
        }

        // Custom player play/pause state sync
        if (updates.isPlaying !== undefined || updates.currentTrackId !== undefined || updates.isScratching !== undefined) {
          this.syncAudioSourcePlayState('A');
        }
      }
    } else {
      if (updates.currentTrackId !== undefined) {
        this.playOffsetB = 0;
        this.lastPlayStartedTimeB = 0;
      }
      this.stateB = { ...this.stateB, ...updates };

      if (this.ctx) {
        if (updates.volume !== undefined && this.channelB_Gain) {
          this.channelB_Gain.gain.setTargetAtTime(updates.volume, this.ctx.currentTime, 0.02);
        }
        if (updates.filterCutoff !== undefined || updates.filterResonance !== undefined || updates.filterType !== undefined) {
          this.updateFilter('B');
        }
        if (updates.delayFeedback !== undefined || updates.delayTime !== undefined) {
          this.updateDelay('B');
        }
        if (updates.distortionAmount !== undefined) {
          this.updateDistortion('B');
        }
        if (updates.eqLow !== undefined || updates.eqMid !== undefined || updates.eqHigh !== undefined) {
          this.updateEQ('B');
        }

        // Custom player speed sync
        if (updates.playbackRate !== undefined && this.activeSourceB) {
          this.activeSourceB.playbackRate.setValueAtTime(this.stateB.playbackRate, this.ctx.currentTime);
        }

        // Custom player play/pause state sync
        if (updates.isPlaying !== undefined || updates.currentTrackId !== undefined || updates.isScratching !== undefined) {
          this.syncAudioSourcePlayState('B');
        }
      }
    }
  }

  public getDeckState(deck: 'A' | 'B'): DeckState {
    return deck === 'A' ? this.stateA : this.stateB;
  }

  private updateEQ(deck: 'A' | 'B') {
    if (!this.ctx) return;
    const eqNodes = deck === 'A' ? this.eqA : this.eqB;
    const state = deck === 'A' ? this.stateA : this.stateB;

    if (eqNodes.length >= 3) {
      eqNodes[0].gain.setTargetAtTime(state.eqLow, this.ctx.currentTime, 0.05);
      eqNodes[1].gain.setTargetAtTime(state.eqMid, this.ctx.currentTime, 0.05);
      eqNodes[2].gain.setTargetAtTime(state.eqHigh, this.ctx.currentTime, 0.05);
    }
  }

  private updateFilter(deck: 'A' | 'B') {
    if (!this.ctx) return;
    const filter = deck === 'A' ? this.filterA : this.filterB;
    const state = deck === 'A' ? this.stateA : this.stateB;

    if (filter) {
      filter.type = state.filterType;
      // Exponential mapping for filter frequency cutoff
      const minFreq = 40;
      const maxFreq = 18000;
      const logFreq = minFreq * Math.pow(maxFreq / minFreq, state.filterCutoff);
      
      filter.frequency.setTargetAtTime(logFreq, this.ctx.currentTime, 0.04);
      filter.Q.setTargetAtTime(state.filterResonance * 15 + 0.1, this.ctx.currentTime, 0.04);
    }
  }

  private updateDelay(deck: 'A' | 'B') {
    if (!this.ctx) return;
    const delay = deck === 'A' ? this.delayA : this.delayB;
    const delayGain = deck === 'A' ? this.delayGainA : this.delayGainB;
    const state = deck === 'A' ? this.stateA : this.stateB;

    if (delay && delayGain) {
      // delayTime is 0 to 1, maps to 0 to 0.8 seconds
      const resolvedTime = Math.max(0.01, state.delayTime * 0.8);
      delay.delayTime.setTargetAtTime(resolvedTime, this.ctx.currentTime, 0.1);
      
      // Delay feedback gain mapping
      delayGain.gain.setTargetAtTime(state.delayFeedback * 0.85, this.ctx.currentTime, 0.1);
    }
  }

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount * 100 : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private updateDistortion(deck: 'A' | 'B') {
    if (!this.ctx) return;
    const shaper = deck === 'A' ? this.distortionA : this.distortionB;
    const state = deck === 'A' ? this.stateA : this.stateB;

    if (shaper) {
      if (state.distortionAmount <= 0.01) {
        shaper.curve = null;
      } else {
        shaper.curve = this.makeDistortionCurve(state.distortionAmount);
      }
    }
  }

  public updateCrossfader(val: number) {
    this.crossfaderVal = val;
    if (!this.ctx || !this.channelA_Gain || !this.channelB_Gain) return;

    // Equal-power crossfading curves
    const r = val * Math.PI * 0.5;
    const leftGain = Math.cos(r) * this.stateA.volume;
    const rightGain = Math.sin(r) * this.stateB.volume;

    this.channelA_Gain.gain.setTargetAtTime(leftGain, this.ctx.currentTime, 0.02);
    this.channelB_Gain.gain.setTargetAtTime(rightGain, this.ctx.currentTime, 0.02);
  }

  public updateMasterVolume(val: number) {
    this.masterVol = val;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.02);
    }
  }

  // --- SYNTHESIZER AND SEQUENCER CORE ENGINE ---

  private startSequencerClock() {
    if (this.stepInterval) clearInterval(this.stepInterval);

    // Fast timer interval (e.g. 25ms checks) running independent trackers
    // To ensure exact phase alignments and fast playback adjustment
    let lastTime = Date.now();
    
    this.stepInterval = setInterval(() => {
      if (!this.ctx || this.ctx.state === 'suspended') return;

      const now = Date.now();
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      // Update Deck A sequence step
      if (this.stateA.isPlaying && !this.stateA.isScratching) {
        const trackA = this.findTrack(this.stateA.currentTrackId);
        // Calculate step duration in seconds based on BPM and Pitch
        const stepDur = (60 / trackA.bpm) / 4; // 16th notes
        this.timeA += deltaSec * this.stateA.playbackRate;

        if (this.timeA >= stepDur) {
          this.timeA = this.timeA % stepDur;
          this.stepA = (this.stepA + 1) % (trackA.notes ? trackA.notes.duration : 16);
          this.triggerStepSound('A', this.stepA);
        }
      }

      // Update Deck B sequence step
      if (this.stateB.isPlaying && !this.stateB.isScratching) {
        const trackB = this.findTrack(this.stateB.currentTrackId);
        const stepDur = (60 / trackB.bpm) / 4;
        this.timeB += deltaSec * this.stateB.playbackRate;

        if (this.timeB >= stepDur) {
          this.timeB = this.timeB % stepDur;
          this.stepB = (this.stepB + 1) % (trackB.notes ? trackB.notes.duration : 16);
          this.triggerStepSound('B', this.stepB);
        }
      }
    }, 20);
  }

  // Synthesis of instruments
  private triggerStepSound(deck: 'A' | 'B', step: number) {
    if (!this.ctx || !this.analyserA || !this.analyserB) return;

    const state = deck === 'A' ? this.stateA : this.stateB;
    
    // Bypass synth sound if playing a custom or preloaded real audio track
    const isCustom = this.isRealTrack(state.currentTrackId);
    if (isCustom) {
      return; 
    }

    const track = this.findTrack(state.currentTrackId);
    const destination = deck === 'A' ? this.analyserA : this.analyserB;

    // Pitch adjustment factor
    const pitchFactor = state.playbackRate;

    // 1. Kick Drum (Steady 4-on-the-floor trigger on 0, 4, 8, 12)
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      this.synthesizeKick(destination, pitchFactor);
    }

    // 2. Snare / Clap (Triggered on 4, 12, slightly accented)
    if (step === 4 || step === 12) {
      setTimeout(() => {
        this.synthesizeClap(destination, pitchFactor);
      }, 10);
    }

    // 3. Open/Closed Hi-hats (Alternative beats on offbeats: 2, 6, 10, 14)
    if (step % 2 === 0 && step !== 0 && step !== 4 && step !== 8 && step !== 12) {
      this.synthesizeHihat(destination, step % 4 === 2, pitchFactor);
    }

    // 4. Bassline Synthesis
    const bassNote = track.notes.bass[step % track.notes.bass.length];
    if (bassNote && NOTE_FREQ[bassNote]) {
      const origFreq = NOTE_FREQ[bassNote];
      const speedCorrFreq = origFreq * pitchFactor; // Frequency scales with playback rate
      this.synthesizeBass(destination, speedCorrFreq);
    }

    // 5. Retro Synth Keyboard Chord/Arp
    const synthNote = track.notes.synth[step % track.notes.synth.length];
    if (synthNote && NOTE_FREQ[synthNote]) {
      const origFreq = NOTE_FREQ[synthNote];
      const speedCorrFreq = origFreq * pitchFactor;
      this.synthesizeLeadSynth(destination, speedCorrFreq, track.color);
    }

    // 6. Vocal robot chants
    const vocalNote = track.notes.vocal[step % track.notes.vocal.length];
    if (vocalNote && NOTE_FREQ[vocalNote] && step % 2 === 0) {
      const origFreq = NOTE_FREQ[vocalNote];
      const speedCorrFreq = origFreq * pitchFactor;
      this.synthesizeVocoder(destination, speedCorrFreq, step % 4 === 0 ? 'a' : 'o');
    }
  }

  // --- SYNTHESIZERS ---

  private synthesizeKick(destination: AudioNode, pitchFactor: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(destination);

    // Deep heavy punch
    osc.type = 'sine';
    const startFreq = 150 * pitchFactor;
    const endFreq = 40 * pitchFactor;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.24);
  }

  private synthesizeClap(destination: AudioNode, pitchFactor: number) {
    if (!this.ctx || !this.noiseBuffer) return;

    // We can simulate a clap using white noise passing through dynamic highpass triggers
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200 * pitchFactor, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(destination);

    const now = this.ctx.currentTime;
    
    // Snare triple flutter clap effect
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setValueAtTime(0.6, now + 0.01);
    gain.gain.setValueAtTime(0.2, now + 0.025);
    gain.gain.setValueAtTime(0.8, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + (pitchFactor * 0.05));

    noise.start(now);
    noise.stop(now + 0.25);
  }

  private synthesizeHihat(destination: AudioNode, isOpen: boolean, pitchFactor: number) {
    if (!this.ctx || !this.noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000 * pitchFactor, this.ctx.currentTime);

    const gain = this.ctx.createGain();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    const duration = isOpen ? 0.18 : 0.05;
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.start(now);
    noise.stop(now + duration + 0.05);
  }

  private synthesizeBass(destination: AudioNode, freq: number) {
    if (!this.ctx || freq <= 0) return;

    // Classic French House slap-bass consists of layered oscillators
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    
    // Slap filter envelope
    const now = this.ctx.currentTime;
    bassFilter.frequency.setValueAtTime(150, now);
    bassFilter.frequency.exponentialRampToValueAtTime(900, now + 0.05);
    bassFilter.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    bassFilter.Q.setValueAtTime(3.0, now);

    osc1.connect(bassFilter);
    osc2.connect(bassFilter);
    bassFilter.connect(gain);
    gain.connect(destination);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq + 1.2, now); // Detuned

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  }

  private synthesizeLeadSynth(destination: AudioNode, freq: number, color: string) {
    if (!this.ctx || freq <= 0) return;

    // Warm chord stab lead (analog brass simulation)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const synthFilter = this.ctx.createBiquadFilter();
    synthFilter.type = 'lowpass';
    synthFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    synthFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    osc1.connect(synthFilter);
    osc2.connect(synthFilter);
    synthFilter.connect(gain);
    gain.connect(destination);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime); // Perfect fifth overlay

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Double peaked bandpass filter simulating vowel formants
  private synthesizeVocoder(destination: AudioNode, freq: number, vowel: 'a' | 'o') {
    if (!this.ctx || freq <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Formant peaks for 'a' (800Hz, 1200Hz) or 'o' (450Hz, 800Hz)
    const f1 = vowel === 'a' ? 850 : 450;
    const f2 = vowel === 'a' ? 1400 : 800;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(f1, this.ctx.currentTime);
    filter1.Q.setValueAtTime(6.0, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(f2, this.ctx.currentTime);
    filter2.Q.setValueAtTime(6.0, this.ctx.currentTime);

    const combGain = this.ctx.createGain();

    osc.connect(filter1);
    osc.connect(filter2);
    
    filter1.connect(combGain);
    filter2.connect(combGain);
    combGain.connect(gain);
    gain.connect(destination);

    // Pulse width style robot vocoder sound (pulse oscillator simulated by detuned saws)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // --- SCRATCHING REAL-TIME AUDIO SYNTHESIS ---

  public triggerScratchSfx(deck: 'A' | 'B', speed: number) {
    if (!this.ctx || Math.abs(speed) < 0.05) return;

    const destination = deck === 'A' ? this.analyserA : this.analyserB;
    if (!destination) return;

    const now = this.ctx.currentTime;
    const count = Math.min(3, Math.floor(Math.abs(speed) * 8) + 1);

    for (let i = 0; i < count; i++) {
      // 1. Vinyl rub / friction
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      // Squeal pitch changes directly with dragging velocity speed
      osc.type = 'triangle';
      const baseFreq = 80 + Math.abs(speed) * 280;
      osc.frequency.setValueAtTime(baseFreq, now + i * 0.01);
      osc.frequency.linearRampToValueAtTime(baseFreq * (speed > 0 ? 1.6 : 0.5), now + 0.05 + i * 0.01);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.12 * Math.min(1.5, Math.abs(speed)), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  // --- SCRUBBING & TRACK CHUNK SCRATCH PLAYBACK ---

  public scrubTrack(deck: 'A' | 'B', deltaRadians: number) {
    if (!this.ctx) return;
    const isA = deck === 'A';
    const state = isA ? this.stateA : this.stateB;
    const isCustom = this.isRealTrack(state.currentTrackId);
    if (!isCustom) return;

    const buffer = this.decodedBuffers.get(state.currentTrackId);
    if (!buffer) return;

    // Scale radians to seconds. A full turn (2 * PI) = 15 seconds.
    const secondsPerRadian = 15.0 / (2 * Math.PI);
    const dt = deltaRadians * secondsPerRadian;

    if (isA) {
      if (this.lastPlayStartedTimeA > 0) {
        const elapsed = (this.ctx.currentTime - this.lastPlayStartedTimeA) * this.stateA.playbackRate;
        this.playOffsetA += elapsed;
        this.lastPlayStartedTimeA = this.ctx.currentTime;
      }
      this.playOffsetA += dt;
      if (this.playOffsetA < 0) this.playOffsetA = 0;
      this.playOffsetA = this.playOffsetA % buffer.duration;
    } else {
      if (this.lastPlayStartedTimeB > 0) {
        const elapsed = (this.ctx.currentTime - this.lastPlayStartedTimeB) * this.stateB.playbackRate;
        this.playOffsetB += elapsed;
        this.lastPlayStartedTimeB = this.ctx.currentTime;
      }
      this.playOffsetB += dt;
      if (this.playOffsetB < 0) this.playOffsetB = 0;
      this.playOffsetB = this.playOffsetB % buffer.duration;
    }
  }

  public playScratchSlice(deck: 'A' | 'B', speed: number) {
    if (!this.ctx || Math.abs(speed) < 0.05) return;
    const state = deck === 'A' ? this.stateA : this.stateB;
    const isCustom = this.isRealTrack(state.currentTrackId);
    if (!isCustom) return;

    const buffer = this.decodedBuffers.get(state.currentTrackId);
    if (!buffer) return;

    const sliceSrc = this.ctx.createBufferSource();
    sliceSrc.buffer = buffer;

    // Highpass filter for that slick high frequency friction sound of vinyl playing very fast
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 + Math.abs(speed) * 400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    // Envelope for a tactile rubbing sliver sound
    const vol = Math.min(0.7, Math.abs(speed) * 0.35);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // Playback speed scales with scratching speed (avoid negative pitch limits)
    const stretchSpeed = Math.max(0.12, Math.min(4.0, Math.abs(speed)));
    sliceSrc.playbackRate.setValueAtTime(stretchSpeed, now);

    const offset = deck === 'A' ? this.playOffsetA : this.playOffsetB;
    const safeOffset = Math.max(0, offset % buffer.duration);

    sliceSrc.connect(filter);
    filter.connect(gain);

    const dest = deck === 'A' ? this.analyserA : this.analyserB;
    if (dest) {
      gain.connect(dest);
    } else {
      gain.connect(this.ctx.destination);
    }

    try {
      sliceSrc.start(now, safeOffset, 0.15);
    } catch (e) {
      // Offset exception protection
    }
  }

  // --- SOUNBDARD SYNTH VOICE TRIGGER ---
  // Renders 12 authentic high-fidelity synthesized DJ controller soundboard effects
  public triggerSoundboardPad(padId: string) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    // Safety check context state
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const pad = VOCODER_PADS.find(p => p.id === padId);
    if (!pad) return;

    const now = this.ctx.currentTime;
    const dest = this.masterGain || this.ctx.destination;

    if (padId === 'airhorn') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      const freqs = [196, 220, 294, 330, 392];
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 14; 
      lfoGain.gain.value = 18; 

      lfo.connect(lfoGain);

      freqs.forEach(f => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        lfoGain.connect(osc.frequency);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 1.3);
      });
      lfo.start(now);
      lfo.stop(now + 1.3);
      gain.connect(dest);
    } 
    else if (padId === 'siren') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.4);
      osc.frequency.linearRampToValueAtTime(400, now + 0.9);
      osc.frequency.linearRampToValueAtTime(1050, now + 1.3);
      osc.frequency.linearRampToValueAtTime(320, now + 1.6);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 1.7);
    } 
    else if (padId === 'laser') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.4);
    } 
    else if (padId === 'sub_drop') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(135, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 1.6);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 1.9);
    } 
    else if (padId === 'white_whoosh') {
      if (!this.noiseBuffer) this.createNoiseBuffer();
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(150, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 1.4);
        filter.Q.setValueAtTime(2.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.34, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(now);
        noise.stop(now + 1.6);
      }
    } 
    else if (padId === 'scratch_cut') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.08);
      osc.frequency.linearRampToValueAtTime(120, now + 0.16);
      osc.frequency.linearRampToValueAtTime(750, now + 0.28);
      osc.frequency.linearRampToValueAtTime(150, now + 0.4);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.45);
    } 
    else if (padId === 'reverb_snare') {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(185, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.15);

      if (!this.noiseBuffer) this.createNoiseBuffer();
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1100, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.24, now);
        noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(dest);

        noise.start(now);
        noise.stop(now + 0.85);
      }
    } 
    else if (padId === 'cowbell') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'square';
      osc1.frequency.value = 540; 
      
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.value = 800; 

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.0, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } 
    else if (padId === 'laser_echo') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.12, now);
      const fbGain = this.ctx.createGain();
      fbGain.gain.setValueAtTime(0.42, now);

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2600, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.14);

      osc.connect(gain);
      gain.connect(delay);
      delay.connect(fbGain);
      fbGain.connect(delay);
      delay.connect(dest);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.18);
    } 
    else if (padId === 'sub_kick') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.75, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.75);
    } 
    else if (padId === 'tape_stop') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(2, now + 0.7);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(45, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.9);
    } 
    else if (padId === 'beep_alert') {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.setValueAtTime(900, now + 0.07);
      osc.frequency.setValueAtTime(1350, now + 0.14);
      osc.frequency.setValueAtTime(680, now + 0.22);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.42);
    }
  }

  // --- MASTER CLEAN UP ---
  public destroy() {
    if (this.stepInterval) clearInterval(this.stepInterval);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Single instance for standard operations globally
export const GlobalDaftDJ = new DaftAudioEngine();
