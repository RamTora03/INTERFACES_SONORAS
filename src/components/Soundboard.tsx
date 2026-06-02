import React from 'react';
import { VolumeX, Volume2, Shield } from 'lucide-react';
import { GlobalDaftDJ, VOCODER_PADS } from '../audioEngine';

interface SoundboardProps {
  onUpdate: () => void;
}

export const Soundboard: React.FC<SoundboardProps> = ({ onUpdate }) => {

  const handlePadPress = (padId: string) => {
    // Crucial: initialize Web Audio on gesture
    GlobalDaftDJ.init();

    // Trigger haptic feedback vibration if API exists (e.g. mobile android/chrome models)
    if (navigator.vibrate) {
      try {
        navigator.vibrate(45); // short 45ms haptic pulse
      } catch (err) {
        // Safe fail block
      }
    }

    GlobalDaftDJ.triggerSoundboardPad(padId);
    onUpdate();
  };

  return (
    <div className="relative flex flex-col p-5 bg-[#111] border border-[#222] rounded-3xl shadow-2xl overflow-hidden justify-between">
      
      {/* Laser header lines */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#333]">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-widest text-[#9D00FF] font-bold uppercase pb-0.5">
            MÓDULO DE FX & SAMPLEADO
          </span>
          <h3 className="text-md font-sans font-extrabold text-zinc-100 tracking-tight">
            TECLADO DE EFECTOS DE DJ
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#050505] rounded-xl border border-[#222]">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
          <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">SAMPLER READY</span>
        </div>
      </div>

      {/* Description captions */}
      <p className="text-zinc-500 text-[11px] mb-4 leading-normal tracking-tight">
        Presiona los botones para incorporar efectos de sonido reales de cabina de DJ. Cada samper se sintetiza en tiempo real usando osciladores y envolventes para enriquecer tu mezcla en vivo.
      </p>

      {/* Bento Layout Grid of 12 Pads */}
      <div className="grid grid-cols-4 gap-3">
        {VOCODER_PADS.map((pad) => {
          return (
            <button
              key={pad.id}
              onClick={() => handlePadPress(pad.id)}
              id={`soundboard_pad_${pad.id}`}
              className="relative col-span-1 h-14 rounded-2xl flex flex-col items-center justify-center p-1 border transition-all cursor-pointer font-sans active:translate-y-0.5 active:scale-95 focus:outline-none overflow-hidden select-none"
              style={{
                backgroundColor: '#050505',
                borderColor: '#222',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.3)`
              }}
              // CSS animation logic is triggered by Tailwind inline hover/active styles
              onMouseDown={(e) => {
                const btn = e.currentTarget;
                btn.style.boxShadow = `0 0 16px ${pad.color}`;
                btn.style.borderColor = pad.color;
              }}
              onMouseUp={(e) => {
                const btn = e.currentTarget;
                btn.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.3)`;
                btn.style.borderColor = '#222';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.3)`;
                btn.style.borderColor = '#222';
              }}
              onTouchStart={(e) => {
                const btn = e.currentTarget;
                btn.style.boxShadow = `0 0 16px ${pad.color}`;
                btn.style.borderColor = pad.color;
              }}
              onTouchEnd={(e) => {
                const btn = e.currentTarget;
                btn.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 6px rgba(0,0,0,0.3)`;
                btn.style.borderColor = '#222';
              }}
            >
              {/* Inner ambient glowing micro circle */}
              <div 
                className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: pad.color, boxShadow: `0 0 5px ${pad.color}` }}
              />

              {/* Pad title */}
              <span className="text-zinc-100 font-sans font-black text-[10px] tracking-widest text-center mt-1 select-none">
                {pad.label}
              </span>

              {/* Sub descriptor */}
              <span className="text-[8px] font-mono text-zinc-500 tracking-wide mt-0.5 select-none uppercase">
                {pad.subLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Futuristic caption indicator */}
      <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-zinc-600 justify-center">
        <Shield className="w-3.5 h-3.5" />
        <span>HAPTIC VIBRATION MOTOR INTEGRATION ACTIVE (MOBILE COMPATIBLE)</span>
      </div>

    </div>
  );
};
