import React, { useEffect, useRef, useState } from 'react';
import { Sliders, Volume2, Music, Shuffle } from 'lucide-react';
import { GlobalDaftDJ, DAFT_TRACKS } from '../audioEngine';

interface MixerProps {
  onUpdate: () => void;
  trackAColor: string;
  trackBColor: string;
}

export const Mixer: React.FC<MixerProps> = ({ onUpdate, trackAColor, trackBColor }) => {
  const [eqL_A, setEqL_A] = useState(0);
  const [eqM_A, setEqM_A] = useState(0);
  const [eqH_A, setEqH_A] = useState(0);
  const [volA, setVolA] = useState(0.8);

  const [eqL_B, setEqL_B] = useState(0);
  const [eqM_B, setEqM_B] = useState(0);
  const [eqH_B, setEqH_B] = useState(0);
  const [volB, setVolB] = useState(0.8);

  const [crossfader, setCrossfader] = useState(0.5);
  const [masterVol, setMasterVol] = useState(0.85);

  // VU Meter Canvas refs
  const meterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load defaults from state
  useEffect(() => {
    const sA = GlobalDaftDJ.getDeckState('A');
    setEqL_A(sA.eqLow);
    setEqM_A(sA.eqMid);
    setEqH_A(sA.eqHigh);
    setVolA(sA.volume);

    const sB = GlobalDaftDJ.getDeckState('B');
    setEqL_B(sB.eqLow);
    setEqM_B(sB.eqMid);
    setEqH_B(sB.eqHigh);
    setVolB(sB.volume);
  }, []);

  // EQ Adjustments handlers
  const handleEqChange = (deck: 'A' | 'B', band: 'low' | 'mid' | 'high', val: number) => {
    if (deck === 'A') {
      if (band === 'low') { setEqL_A(val); GlobalDaftDJ.setDeckState('A', { eqLow: val }); }
      if (band === 'mid') { setEqM_A(val); GlobalDaftDJ.setDeckState('A', { eqMid: val }); }
      if (band === 'high') { setEqH_A(val); GlobalDaftDJ.setDeckState('A', { eqHigh: val }); }
    } else {
      if (band === 'low') { setEqL_B(val); GlobalDaftDJ.setDeckState('B', { eqLow: val }); }
      if (band === 'mid') { setEqM_B(val); GlobalDaftDJ.setDeckState('B', { eqMid: val }); }
      if (band === 'high') { setEqH_B(val); GlobalDaftDJ.setDeckState('B', { eqHigh: val }); }
    }
    // Refresh Crossfader equations
    GlobalDaftDJ.updateCrossfader(crossfader);
    onUpdate();
  };

  const handleVolumeChange = (deck: 'A' | 'B', val: number) => {
    if (deck === 'A') {
      setVolA(val);
      GlobalDaftDJ.setDeckState('A', { volume: val });
    } else {
      setVolB(val);
      GlobalDaftDJ.setDeckState('B', { volume: val });
    }
    GlobalDaftDJ.updateCrossfader(crossfader);
    onUpdate();
  };

  const handleCrossfaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCrossfader(val);
    GlobalDaftDJ.updateCrossfader(val);
    onUpdate();
  };

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVol(val);
    GlobalDaftDJ.updateMasterVolume(val);
    onUpdate();
  };

  // --- RENDERING COGNIZANT HIGH RESOLUTION REALTIME VU METER SYSTEM ---

  useEffect(() => {
    const canvas = meterCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const binA = new Uint8Array(128);
    const binB = new Uint8Array(128);

    // Filter decays for smooth LED levels bouncing
    let peakA = 0;
    let peakB = 0;
    let peakMaster = 0;

    const renderMeters = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Extract real audio heights
      let ampA = 0;
      let ampB = 0;

      if (GlobalDaftDJ.analyserA) {
        GlobalDaftDJ.analyserA.getByteFrequencyData(binA);
        let sumA = 0;
        // Read low-mid range for thump
        for (let i = 0; i < 40; i++) sumA += binA[i];
        ampA = sumA / 40; // 0 to 255
      }
      if (GlobalDaftDJ.analyserB) {
        GlobalDaftDJ.analyserB.getByteFrequencyData(binB);
        let sumB = 0;
        for (let i = 0; i < 40; i++) sumB += binB[i];
        ampB = sumB / 40;
      }

      // Smooth peak drops
      peakA = Math.max(ampA, peakA * 0.92);
      peakB = Math.max(ampB, peakB * 0.92);

      // Compute Master based on crossfader ratio
      const r = crossfader * Math.PI * 0.5;
      const leftMix = Math.cos(r) * peakA * (volA / 0.8);
      const rightMix = Math.sin(r) * peakB * (volB / 0.8);
      const masterAmp = (leftMix + rightMix) * masterVol;
      peakMaster = Math.max(masterAmp, peakMaster * 0.92);

      // Draw three meter channels: Left (Deck A), Middle (Master), Right (Deck B)
      const numLEDs = 14;
      const ledSpacing = 4;
      const ledWidth = 14;
      const ledHeight = (canvas.height - 35) / numLEDs - ledSpacing;

      const drawLEDChannel = (x: number, peakVal: number, title: string, glowColor: string) => {
        // Draw Label Title
        ctx.fillStyle = '#52525b';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + ledWidth / 2, canvas.height - 8);

        // Convert peakVal (0 to 180 typical) to LED steps
        const scaledVal = Math.min(numLEDs, Math.ceil((peakVal / 150) * numLEDs));

        for (let i = 0; i < numLEDs; i++) {
          const isLit = i < scaledVal;

          // LED styling colors: Bottom (green), middle (yellow/orange), top (red)
          let color = '#181824'; // Unlit base
          if (isLit) {
            if (i > numLEDs - 3) color = '#ef4444'; // Red peak clip
            else if (i > numLEDs - 6) color = '#f59e0b'; // Gold mid
            else color = glowColor; // Dynamic neon track accents or Green
          }

          const y = canvas.height - 25 - (i * (ledHeight + ledSpacing)) - ledHeight;

          ctx.fillStyle = color;
          // Soft rounded led caps
          ctx.beginPath();
          ctx.roundRect(x, y, ledWidth, ledHeight, 1.5);
          ctx.fill();

          // Core bright center for active neon look
          if (isLit && i === scaledVal - 1) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 1, ledWidth - 4, ledHeight - 2, 1);
            ctx.fill();
            ctx.shadowBlur = 0; // disable back to default
          }
        }
      };

      const paddingX = 14;
      drawLEDChannel(paddingX, peakA, 'A', trackAColor);
      drawLEDChannel(canvas.width / 2 - 7, peakMaster, 'MST', '#FFEA00');
      drawLEDChannel(canvas.width - paddingX - ledWidth, peakB, 'B', trackBColor);

      animId = requestAnimationFrame(renderMeters);
    };

    renderMeters();
    return () => cancelAnimationFrame(animId);
  }, [trackAColor, trackBColor, crossfader, volA, volB, masterVol]);

  const resetEQ = (deck: 'A' | 'B') => {
    handleEqChange(deck, 'low', 0);
    handleEqChange(deck, 'mid', 0);
    handleEqChange(deck, 'high', 0);
  };

  return (
    <div className="relative flex flex-col p-5 bg-[#111] border border-[#222] rounded-3xl shadow-2xl h-full justify-between select-none">
      
      {/* Decorative center logo strip */}
      <div className="flex flex-col items-center justify-center text-center pb-3 border-b border-[#333]">
        <span className="text-[10px] tracking-[0.3em] font-mono text-[#00f3ff] font-extrabold uppercase">DAFT CONSOLE</span>
        <h3 className="text-sm font-sans font-black text-white tracking-widest uppercase mt-0.5">
          FRENCH HOUSE COPLER
        </h3>
      </div>

      {/* Main double column rack */}
      <div className="grid grid-cols-5 gap-4 my-auto items-stretch mt-4">
        
        {/* DECK A CHANNEL MIXING BOARD */}
        <div className="col-span-2 flex flex-col justify-between p-3 bg-zinc-950/40 rounded-2xl border border-[#222] relative">
          <div className="text-center mb-2">
            <span className="text-[9px] font-mono text-[#00F3FF] font-bold tracking-widest uppercase">CH A</span>
          </div>

          {/* Volume Gain Fader */}
          <div className="flex flex-col mb-4 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/40">
            <div className="flex justify-between items-center mb-1 text-[8px] font-mono font-bold text-zinc-500">
              <span>VOL</span>
              <span style={{ color: trackAColor }}>{Math.round(volA * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volA}
              onChange={(e) => handleVolumeChange('A', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-[#00F3FF]"
              style={{
                background: `linear-gradient(to right, ${trackAColor} ${volA * 100}%, #27272a ${volA * 100}%)`
              }}
            />
          </div>

          {/* EQ Knobs */}
          <div className="flex flex-col gap-3">
            {/* HIGH EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">HIGH (HI)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqH_A} 
                onChange={(e) => handleEqChange('A', 'high', parseFloat(e.target.value))}
                className="w-16 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqH_A > 0 ? `+${eqH_A}` : eqH_A} dB</span>
            </div>

            {/* MID EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">MID (MID)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqM_A} 
                onChange={(e) => handleEqChange('A', 'mid', parseFloat(e.target.value))}
                className="w-16 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqM_A > 0 ? `+${eqM_A}` : eqM_A} dB</span>
            </div>

            {/* LOW EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">BASS (LOW)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqL_A} 
                onChange={(e) => handleEqChange('A', 'low', parseFloat(e.target.value))}
                className="w-16 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqL_A > 0 ? `+${eqL_A}` : eqL_A} dB</span>
            </div>
            
            <button 
              onClick={() => resetEQ('A')}
              className="text-[8px] font-mono hover:text-zinc-350 cursor-pointer bg-zinc-900 border border-zinc-800 py-1 text-zinc-500 rounded-md hover:bg-zinc-850 mt-1 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              RESET EQ
            </button>
          </div>
        </div>

        {/* MID COLUMN - DYNAMIC LED VU METER BAR PANEL */}
        <div className="col-span-1 flex flex-col justify-center items-center bg-[#050505] rounded-2xl border border-[#222] p-2 shadow-inner">
          <canvas 
            ref={meterCanvasRef} 
            width={85} 
            height={205}
            className="w-full h-full block" 
          />
        </div>

        {/* DECK B CHANNEL MIXING BOARD */}
        <div className="col-span-2 flex flex-col justify-between p-3 bg-zinc-950/40 rounded-2xl border border-[#222] relative">
          <div className="text-center mb-2">
            <span className="text-[9px] font-mono text-[#FF0077] font-bold tracking-widest uppercase">CH B</span>
          </div>

          {/* Volume Gain Fader */}
          <div className="flex flex-col mb-4 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900/40">
            <div className="flex justify-between items-center mb-1 text-[8px] font-mono font-bold text-zinc-500">
              <span>VOL</span>
              <span style={{ color: trackBColor }}>{Math.round(volB * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volB}
              onChange={(e) => handleVolumeChange('B', parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-[#FF0077]"
              style={{
                background: `linear-gradient(to right, ${trackBColor} ${volB * 100}%, #27272a ${volB * 100}%)`
              }}
            />
          </div>

          {/* EQ Knobs */}
          <div className="flex flex-col gap-3">
            {/* HIGH EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">HIGH (HI)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqH_B} 
                onChange={(e) => handleEqChange('B', 'high', parseFloat(e.target.value))}
                className="w-16 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqH_B > 0 ? `+${eqH_B}` : eqH_B} dB</span>
            </div>

            {/* MID EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">MID (MID)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqM_B} 
                onChange={(e) => handleEqChange('B', 'mid', parseFloat(e.target.value))}
                className="w-16 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqM_B > 0 ? `+${eqM_B}` : eqM_B} dB</span>
            </div>

            {/* LOW EQ */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-zinc-500 font-bold mb-1">BASS (LOW)</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                value={eqL_B} 
                onChange={(e) => handleEqChange('B', 'low', parseFloat(e.target.value))}
                className="w-16 h-1 bg-[#272733] rounded appearance-none cursor-pointer accent-zinc-100"
              />
              <span className="text-[9px] font-mono text-zinc-400 mt-1">{eqL_B > 0 ? `+${eqL_B}` : eqL_B} dB</span>
            </div>
            
            <button 
              onClick={() => resetEQ('B')}
              className="text-[8px] font-mono hover:text-zinc-350 cursor-pointer bg-zinc-900 border border-zinc-800 py-1 text-zinc-500 rounded-md hover:bg-zinc-850 mt-1 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              RESET EQ
            </button>
          </div>
        </div>
      </div>

      {/* MASTER SYSTEM CONTROLLER BLOCK */}
      <div className="flex flex-col gap-4 mt-5 p-4 bg-[#050505] border border-[#222] rounded-2xl shadow-inner">
        
        {/* Master Output knob */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-yellow-400" />
            <span className="text-[10px] font-bold font-mono text-zinc-400 tracking-wider">OUTPUT MASTER</span>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-[210px]">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVol}
              onChange={handleMasterChange}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-ns-resize accent-yellow-400"
              style={{
                background: `linear-gradient(to right, #eab308 ${masterVol * 100}%, #27272a ${masterVol * 100}%)`
              }}
            />
            <span className="text-xs font-mono font-bold text-yellow-400 w-8 text-right">{Math.round(masterVol * 100)}%</span>
          </div>
        </div>

        {/* BOTTOM CROSSFADER ELEMENT */}
        <div className="flex flex-col border-t border-[#333] pt-3.5">
          <div className="flex justify-between items-center text-[9px] font-mono font-extrabold text-zinc-650 mb-2">
            <span style={{ color: crossfader < 0.4 ? trackAColor : '#52525b' }}>◄ DECK A</span>
            <span className="text-zinc-400 mx-auto font-black tracking-[0.2em] uppercase">CROSSFADER</span>
            <span style={{ color: crossfader > 0.6 ? trackBColor : '#52525b' }}>DECK B ►</span>
          </div>
          <div className="relative flex items-center bg-[#050505] py-2.5 px-3 rounded-xl border border-[#222] shadow-lg">
            <input 
              id="crossfader_input"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={crossfader}
              onChange={handleCrossfaderChange}
              className="w-full h-1.5 bg-zinc-950 border border-zinc-800 rounded-lg appearance-none cursor-ew-resize accent-yellow-400"
            />
          </div>
          {/* Tic marks for traditional dj tables */}
          <div className="flex justify-between text-[8px] font-mono text-zinc-700 px-2 mt-1.5 font-bold">
            <span>CH.A 100%</span>
            <span>MIX CENTER</span>
            <span>CH.B 100%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
