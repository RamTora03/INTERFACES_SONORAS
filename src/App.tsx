import { useState, useEffect } from 'react';
import { Disc, Radio, Sliders, Volume2, Moon, Activity, AlertCircle, RefreshCw, Key } from 'lucide-react';
import { GlobalDaftDJ, DAFT_TRACKS } from './audioEngine';
import { Turntable } from './components/Turntable';
import { Mixer } from './components/Mixer';
import { EffectsPanel } from './components/EffectsPanel';

export default function App() {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [deckA_TrackId, setDeckA_TrackId] = useState('around_the_world');
  const [deckB_TrackId, setDeckB_TrackId] = useState('one_more_time');
  const [ticker, setTicker] = useState(0);

  // Trigger small state rerender for reactive values across mixer and decks
  const refreshMainLayout = () => {
    setTicker(prev => prev + 1);
    
    // Sync active tracks from audio engine values
    const sA = GlobalDaftDJ.getDeckState('A');
    const sB = GlobalDaftDJ.getDeckState('B');
    if (sA.currentTrackId !== deckA_TrackId) setDeckA_TrackId(sA.currentTrackId);
    if (sB.currentTrackId !== deckB_TrackId) setDeckB_TrackId(sB.currentTrackId);
  };

  // Launch audio setup on click
  const handleStartConsole = () => {
    GlobalDaftDJ.init();
    if (GlobalDaftDJ.ctx) {
      if (GlobalDaftDJ.ctx.state === 'suspended') {
        GlobalDaftDJ.ctx.resume();
      }
      setIsAudioInitialized(true);
      
      // Play a lovely retro computerized start frequency test beep
      const osc = GlobalDaftDJ.ctx.createOscillator();
      const gain = GlobalDaftDJ.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, GlobalDaftDJ.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, GlobalDaftDJ.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.18, GlobalDaftDJ.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, GlobalDaftDJ.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(GlobalDaftDJ.ctx.destination);
      osc.start();
      osc.stop(GlobalDaftDJ.ctx.currentTime + 0.5);
    }
  };

  // Safe release resources on close
  useEffect(() => {
    return () => {
      GlobalDaftDJ.destroy();
    };
  }, []);

  const trackA = DAFT_TRACKS.find(t => t.id === deckA_TrackId) || DAFT_TRACKS[0];
  const trackB = DAFT_TRACKS.find(t => t.id === deckB_TrackId) || DAFT_TRACKS[1];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-purple-900 selection:text-white relative">
      
      {/* Decorative cyber grid grid lines background */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.01) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.01) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px, 40px 40px, 40px 40px'
        }}
      />

      {/* BEFORE INITIALIZATION LOCK SCREEN */}
      {!isAudioInitialized && (
        <div className="fixed inset-0 bg-[#040409]/95 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#0a0a12] border-2 border-zinc-900 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
            
            {/* Glowing vector grids inside cards */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
            
            {/* Spinning vector logo */}
            <div className="w-20 h-20 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center mb-6 animate-pulse shadow-lg relative">
              <Disc className="w-12 h-12 text-[#00F3FF] animate-spin" style={{ animationDuration: '4s' }} />
              <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0077] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF0077]"></span>
              </span>
            </div>

            <span className="text-[10px] tracking-[0.4em] font-mono text-zinc-500 font-extrabold uppercase mb-8">DAFT PUNK DJ DESK</span>

            <button 
              onClick={handleStartConsole}
              id="activate_console_btn"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#00F3FF] via-purple-600 to-[#FF0077] hover:from-[#3df6ff] hover:to-[#ff3d93] text-zinc-950 font-sans font-black tracking-widest text-sm rounded-2xl shadow-xl transition-all active:scale-[0.98] cursor-pointer hover:shadow-[0_0_35px_rgba(0,180,255,0.4)]"
            >
              ENCENDER MESA DJ
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <header className="border-b border-[#333] bg-[#050505] relative px-6 py-5 flex flex-col md:flex-row justify-between items-end z-10 gap-4">
        
        {/* Left Side: Brand Logo / Sleek Theme Header */}
        <div className="flex gap-4 items-end">
          <div className="relative mb-1">
            <div className="w-10 h-10 bg-[#111] border border-[#333] rounded-xl flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-[#00f3ff]" />
            </div>
            {/* Pulsing state */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff00ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff00ff]"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic text-white flex items-center gap-2">
              DAFT <span className="text-[#ff00ff]">PUNK</span>
            </h1>
          </div>
        </div>

        {/* Center Side: CYBER DAFT HELMETS STYLING */}
        <div className="flex items-center gap-8 py-1 px-4 bg-zinc-950/80 border border-zinc-900/60 rounded-2xl relative shadow-inner">
          
          {/* THOMAS BANGALTER'S HELMET (Silver Metal + Red Visor LED) */}
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-10 flex flex-col items-center justify-center bg-zinc-900 rounded-lg border border-zinc-800 shadow-md">
              <div className="w-10 h-6 bg-zinc-700 rounded-b-xl border border-zinc-600 flex items-center justify-center relative shadow-sm">
                {/* Silver Helmet Chin */}
                <div className="absolute -bottom-1 w-4 h-2.5 bg-zinc-600 rounded" />
                {/* RED VISOR LED */}
                <div className="w-8 h-1.5 bg-red-600 rounded-md shadow-[0_0_8px_#ef4444] animate-pulse" />
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">THOMAS</span>
          </div>

          <div className="h-5 w-[1px] bg-zinc-900" />

          {/* GUY-MANUEL DE HOMEM-CHRISTO'S HELMET (Gold Matte + Colorful Visor LED) */}
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-10 flex flex-col items-center justify-center bg-zinc-900 rounded-lg border border-zinc-800 shadow-md">
              <div className="w-10 h-6 bg-yellow-600 rounded-lg border border-yellow-500 flex flex-col items-center justify-center relative shadow-sm">
                <div className="absolute -bottom-1 w-4 h-2 bg-yellow-700 rounded" />
                {/* RAINBOW ACCENTS GLOW VISOR */}
                <div className="w-8 h-3.5 bg-zinc-950 rounded-md border border-yellow-400 overflow-hidden flex flex-col justify-between py-0.5">
                  <div className="w-full h-[1px] bg-cyan-400 shadow-[0_0_3px_#00F3FF]" />
                  <div className="w-full h-[1px] bg-yellow-400 shadow-[0_0_3px_#FFEA00]" />
                  <div className="w-full h-[1px] bg-pink-500 shadow-[0_0_3px_#FF0077]" />
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">GUY-MANUEL</span>
          </div>

        </div>

        {/* Right Side: Global Status Info */}
        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col">
            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">TEMPO GLOBAL SYNC</span>
            <span className="text-xs font-mono font-bold text-zinc-300">
              DECK A ({trackA.bpm} BPM) • DECK B ({trackB.bpm} BPM)
            </span>
          </div>
          <button 
            onClick={refreshMainLayout}
            className="p-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 rounded-xl text-zinc-400 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            title="Sincronizar Consola"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* MAIN COCKPIT DASHBOARD AREA */}
      <main className="flex-1 p-6 max-w-full lg:px-10 xl:px-14 w-full mx-auto flex flex-col gap-6 z-10">

        {/* ROW 1: Turntables, mixer, and deck configurations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Deck A Left Table */}
          <div className="col-span-1 lg:col-span-4">
            <Turntable 
              deckId="A" 
              onStateChange={refreshMainLayout} 
              activeTrackId={deckA_TrackId}
            />
          </div>

          {/* Central Mixing Desk Console */}
          <div className="col-span-1 lg:col-span-4">
            <Mixer 
              onUpdate={refreshMainLayout}
              trackAColor={trackA.color}
              trackBColor={trackB.color}
            />
          </div>

          {/* Deck B Right Table */}
          <div className="col-span-1 lg:col-span-4">
            <Turntable 
              deckId="B" 
              onStateChange={refreshMainLayout} 
              activeTrackId={deckB_TrackId}
            />
          </div>

        </div>

        {/* ROW 2: Custom FX Sweep filters pads (Left & Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Effects Rack Deck A */}
          <div className="col-span-1">
            <EffectsPanel 
              deckId="A" 
              onUpdate={refreshMainLayout}
              trackColor={trackA.color}
            />
          </div>

          {/* Effects Rack Deck B */}
          <div className="col-span-1">
            <EffectsPanel 
              deckId="B" 
              onUpdate={refreshMainLayout}
              trackColor={trackB.color}
            />
          </div>

        </div>

      </main>

      {/* BOTTOM STATUS BAR (From Sleek Interface design specs) */}
      <div className="px-6 py-3 border-t border-[#333] bg-[#050505] flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-widest text-zinc-500 gap-2 z-10">
        <div className="flex gap-6 flex-wrap justify-center">
          <span>ALIVE MODE: ACTIVE</span>
          <span>LATENCY: 1.2MS</span>
          <span>HAPTIC ENGINE: READY</span>
        </div>
        <div className="flex gap-6 text-[#00f3ff]">
          <span>SENSITIVITY: HIGH</span>
          <span>RECORDING: DISC A & B</span>
        </div>
      </div>

      {/* FOOTER METADATA BAR */}
      <footer className="px-6 py-4 border-t border-[#222] bg-[#050505] flex flex-col sm:flex-row justify-between items-center text-center gap-2 z-10 text-[10px] font-mono text-zinc-650">
        <p>CONSOLA DE CONTROL DE FRANCIA SINTETIZADORES. DAFT PUNK DJ DESK INC.</p>
        <p className="flex items-center gap-1.5 justify-center text-[#ff00ff]">
          <Moon className="w-3.5 h-3.5 text-[#ff00ff]" /> ESTILO NOCTURNO COLOQUIO • ESTRELLA NEÓN 2026
        </p>
      </footer>

    </div>
  );
}
