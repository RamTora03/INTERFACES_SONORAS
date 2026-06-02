import React, { useEffect, useState, useRef } from 'react';
import { Sliders, Zap, Repeat, Flame } from 'lucide-react';
import { GlobalDaftDJ } from '../audioEngine';

interface EffectsPanelProps {
  deckId: 'A' | 'B';
  onUpdate: () => void;
  trackColor: string;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ deckId, onUpdate, trackColor }) => {
  const [filterCutoff, setFilterCutoff] = useState(0.5);
  const [filterRes, setFilterRes] = useState(0.1);
  const [filterType, setFilterType] = useState<'lowpass' | 'highpass' | 'bandpass'>('lowpass');

  const [delayTime, setDelayTime] = useState(0.25);
  const [delayFeedback, setDelayFeedback] = useState(0.0);
  const [distortion, setDistortion] = useState(0.0);

  // XY filter pad dragging references
  const padRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingPad, setIsDraggingPad] = useState(false);

  useEffect(() => {
    const state = GlobalDaftDJ.getDeckState(deckId);
    setFilterCutoff(state.filterCutoff);
    setFilterRes(state.filterResonance);
    setFilterType(state.filterType);
    setDelayTime(state.delayTime);
    setDelayFeedback(state.delayFeedback);
    setDistortion(state.distortionAmount);
  }, [deckId]);

  const handleFilterTypeChange = (type: 'lowpass' | 'highpass' | 'bandpass') => {
    setFilterType(type);
    GlobalDaftDJ.setDeckState(deckId, { filterType: type });
    onUpdate();
  };

  const handleDelayChange = (time: number, feedback: number) => {
    setDelayTime(time);
    setDelayFeedback(feedback);
    GlobalDaftDJ.setDeckState(deckId, { delayTime: time, delayFeedback: feedback });
    onUpdate();
  };

  const handleDistortionChange = (amount: number) => {
    setDistortion(amount);
    GlobalDaftDJ.setDeckState(deckId, { distortionAmount: amount });
    onUpdate();
  };

  // --- XY PAD DRAGGING MATHS ---

  const handlePadInteraction = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();
    // Clamp inputs 0 to 1
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)); // invert Y so top is max frequency

    setFilterRes(x);
    setFilterCutoff(y);

    GlobalDaftDJ.setDeckState(deckId, {
      filterResonance: x,
      filterCutoff: y
    });
    onUpdate();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    GlobalDaftDJ.init();
    setIsDraggingPad(true);
    handlePadInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingPad) return;
    handlePadInteraction(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDraggingPad(false);
  };

  // Bind document wide mouse move to release dragging safely outside boundary
  useEffect(() => {
    if (isDraggingPad) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPad]);

  // Touch triggers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    GlobalDaftDJ.init();
    setIsDraggingPad(true);
    if (e.touches.length > 0) {
      handlePadInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePadInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-[#111] border border-[#222] rounded-3xl shadow-xl justify-between">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-3 border-b border-[#333] pb-2">
        <Sliders className="w-5 h-5" style={{ color: trackColor }} />
        <span className="text-zinc-200 font-bold font-sans text-xs uppercase tracking-wider">
          EFECTOR DECK {deckId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* XY FILTER PAD SECTION */}
        <div className="col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <span className="text-[10px] font-mono tracking-wider font-bold text-zinc-500">XY SWEEP PAD</span>
            <div className="flex gap-1">
              <button 
                onClick={() => handleFilterTypeChange('lowpass')}
                className={`text-[8px] px-1.5 py-0.5 font-bold font-mono border rounded ${
                  filterType === 'lowpass' ? 'bg-zinc-100 text-zinc-950 border-zinc-100' : 'bg-transparent text-zinc-500 border-zinc-800'
                }`}
              >LP</button>
              <button 
                onClick={() => handleFilterTypeChange('highpass')}
                className={`text-[8px] px-1.5 py-0.5 font-bold font-mono border rounded ${
                  filterType === 'highpass' ? 'bg-zinc-100 text-zinc-950 border-zinc-100' : 'bg-transparent text-zinc-500 border-zinc-800'
                }`}
              >HP</button>
            </div>
          </div>

          {/* Interactive touch XY field */}
          <div 
            ref={padRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDraggingPad(false)}
            className="w-full h-32 bg-[#050505] border border-[#222] rounded-2xl relative overflow-hidden cursor-crosshair shadow-inner"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
          >
            {/* Horizontal axis grid resonance indicator */}
            <div className="absolute inset-x-0 border-t border-dashed border-zinc-900" style={{ bottom: `${filterCutoff * 100}%` }} />
            <div className="absolute inset-y-0 border-l border-dashed border-zinc-900" style={{ left: `${filterRes * 100}%` }} />

            {/* Moving glowing cross point */}
            <div 
              className="absolute w-4 h-4 -ml-2 -mb-2 rounded-full border-2 border-white transition-all duration-75 flex items-center justify-center shadow-lg"
              style={{ 
                left: `${filterRes * 100}%`, 
                bottom: `${filterCutoff * 100}%`,
                backgroundColor: trackColor,
                boxShadow: `0 0 12px ${trackColor}`
              }}
            >
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>

            {/* Static labels inside axes */}
            <div className="absolute bottom-2 left-2 text-[7px] font-mono font-bold text-zinc-700 tracking-wider">▲ FREQ /  ► RES</div>
            <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-600 font-bold uppercase">{filterType}</div>
          </div>

          {/* Dynamic indicators in text */}
          <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-1 px-1">
            <span>RES: {Math.round(filterRes * 100)}%</span>
            <span>CUTOFF: {Math.round(filterCutoff * 100)}%</span>
          </div>
        </div>

        {/* DELAY REVERBERATION & SATURATION PANEL */}
        <div className="col-span-1 flex flex-col justify-between">
          
          {/* DELAY TIME / FEEDBACK MODULE */}
          <div className="flex flex-col bg-[#050505] p-2 border border-[#222] rounded-xl relative">
            <div className="flex justify-between items-center mb-1 text-[8px] font-mono font-bold">
              <span className="text-zinc-400 flex items-center gap-1"><Repeat className="w-3 h-3" /> ECHO DELAY</span>
              <span style={{ color: trackColor }}>{Math.round(delayFeedback * 100)}% FB</span>
            </div>
            
            {/* Feedback amount */}
            <input 
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={delayFeedback}
              onChange={(e) => handleDelayChange(delayTime, parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-100"
              style={{
                background: `linear-gradient(to right, ${trackColor} ${delayFeedback * 111}%, #27272a ${delayFeedback * 111}%)`
              }}
            />
            {/* Delay Time */}
            <div className="flex justify-between text-[7px] font-mono text-zinc-650 mt-2">
              <span>RATE TIME</span>
              <span>{(delayTime * 1000).toFixed(0)} ms</span>
            </div>
            <input 
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={delayTime}
              onChange={(e) => handleDelayChange(parseFloat(e.target.value), delayFeedback)}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer mt-1"
            />
          </div>

          {/* OVERDRIVE BITCRUSH SATURATOR */}
          <div className="flex flex-col bg-[#050505] p-2 border border-[#222] rounded-xl relative mt-3">
            <div className="flex justify-between items-center mb-1 text-[8px] font-mono font-bold">
              <span className="text-zinc-400 flex items-center gap-1"><Flame className="w-3 h-3 text-red-500" /> OVERDRIVE</span>
              <span className="text-red-400" style={{ textShadow: distortion > 0 ? '0 0 4px #ef444450' : 'none' }}>{Math.round(distortion * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="0.95"
              step="0.05"
              value={distortion}
              onChange={(e) => handleDistortionChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-500"
              style={{
                background: `linear-gradient(to right, #ef4444 ${distortion * 100}%, #27272a ${distortion * 100}%)`
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
