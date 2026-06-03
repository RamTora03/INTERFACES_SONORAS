import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Disc, Upload, Trash2 } from 'lucide-react';
import { GlobalDaftDJ, DAFT_TRACKS } from '../audioEngine';
import { DeckState, Track } from '../types';
import { getCustomTracks, saveCustomTrack, deleteCustomTrack, CustomTrack } from '../db';

interface TurntableProps {
  deckId: 'A' | 'B';
  onStateChange: () => void;
  activeTrackId: string;
}

export const Turntable: React.FC<TurntableProps> = ({ deckId, onStateChange, activeTrackId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Local reactive copy of Web Audio state for toggle elements
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(1.0);
  const [selectedTrackId, setSelectedTrackId] = useState(activeTrackId);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [localCustomTracks, setLocalCustomTracks] = useState<CustomTrack[]>([]);

  // Function to load tracks from IndexedDB and sync to AudioEngine
  const syncCustomTracksFromDB = async () => {
    try {
      const dbTracks = await getCustomTracks();
      setLocalCustomTracks(dbTracks);
      
      // Register all DB tracks into audioEngine
      for (const t of dbTracks) {
        if (!GlobalDaftDJ.decodedBuffers.has(t.id)) {
          const arrayBuffer = await t.fileData.arrayBuffer();
          const buffer = await GlobalDaftDJ.decodeAudioFile(t.id, arrayBuffer);
          GlobalDaftDJ.registerCustomTrack({
            id: t.id,
            name: t.name,
            bpm: t.bpm,
            key: t.key,
            color: t.color,
            neonShadow: t.neonShadow,
            description: t.description,
            notes: { bass: [], synth: [], vocal: [], duration: 16 }
          }, buffer);
        } else {
          const fakeTrackObj = {
            id: t.id,
            name: t.name,
            bpm: t.bpm,
            key: t.key,
            color: t.color,
            neonShadow: t.neonShadow,
            description: t.description,
            notes: { bass: [], synth: [], vocal: [], duration: 16 }
          };
          if (!GlobalDaftDJ.customTracks.some(ct => ct.id === t.id)) {
            GlobalDaftDJ.customTracks.push(fakeTrackObj);
          }
        }
      }
      onStateChange();
    } catch (err) {
      console.error("Error loading saved tracks from IndexedDB", err);
    }
  };

  // Preloads and decodes pre-configured archive.org real tracks on-the-fly
  const ensureTrackLoaded = async (trackId: string): Promise<boolean> => {
    if (GlobalDaftDJ.decodedBuffers.has(trackId)) {
      return true;
    }

    const track = DAFT_TRACKS.find(t => t.id === trackId) || GlobalDaftDJ.customTracks.find(t => t.id === trackId);
    if (!track || !track.url) {
      return true; // synthesized track or already defined
    }

    GlobalDaftDJ.init();
    setIsDecoding(true);

    try {
      const response = await fetch(track.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${track.url}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await GlobalDaftDJ.decodeAudioFile(trackId, arrayBuffer);

      GlobalDaftDJ.registerCustomTrack({
        id: track.id,
        name: track.name,
        bpm: track.bpm,
        key: track.key,
        color: track.color,
        neonShadow: track.neonShadow,
        description: track.description,
        notes: { bass: [], synth: [], vocal: [], duration: 16 }
      }, buffer);

      return true;
    } catch (err) {
      console.error("Error loading real track", err);
      alert("Error al descargar la canción real de internet. Revisa tu conexión y vuelve a intentar.");
      return false;
    } finally {
      setIsDecoding(false);
    }
  };

  useEffect(() => {
    syncCustomTracksFromDB();
  }, [deckId, activeTrackId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    GlobalDaftDJ.init();
    setIsDecoding(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const cleanName = file.name.replace(/\.[^/.]+$/, ""); // strip extension
      const customId = `custom_${Date.now()}`;
      
      // Cyber colors and neon shadows
      const COLORS = ['#FF0077', '#00F3FF', '#FFEA00', '#9D00FF', '#00FF66'];
      const SHADOWS = [
        '0 0 10px #FF0077',
        '0 0 10px #00F3FF',
        '0 0 10px #FFEA00',
        '0 0 10px #9D00FF',
        '0 0 10px #00FF66'
      ];
      const randomIndex = Math.floor(Math.random() * COLORS.length);
      const trackColor = COLORS[randomIndex];
      const neonShadow = SHADOWS[randomIndex];

      // Decode the file data to AudioBuffer
      const buffer = await GlobalDaftDJ.decodeAudioFile(customId, arrayBuffer);
      
      // Register custom track details
      const trackObj = {
        id: customId,
        name: cleanName,
        bpm: 120, // Default reference bpm
        key: 'Original',
        color: trackColor,
        neonShadow: neonShadow,
        description: `Pista real importada: "${file.name}". Guardada de forma persistente en tu navegador.`
      };

      // Save custom track persistently in IndexedDB
      await saveCustomTrack({
        id: customId,
        name: cleanName,
        bpm: 120,
        key: 'Original',
        color: trackColor,
        neonShadow: neonShadow,
        description: `Pista real importada: "${file.name}". Guardada de forma persistente en tu navegador.`,
        fileName: file.name,
        fileData: file,
        addedAt: Date.now()
      });

      // Register memo details in audio engine
      GlobalDaftDJ.registerCustomTrack({
        ...trackObj,
        notes: { bass: [], synth: [], vocal: [], duration: 16 }
      }, buffer);

      // Select it on this deck and refresh UI!
      setSelectedTrackId(customId);
      GlobalDaftDJ.setDeckState(deckId, { currentTrackId: customId });
      
      // Synchronize database custom tracks list and trigger update
      await syncCustomTracksFromDB();
      onStateChange();
    } catch (err) {
      console.error("Error decoding audio file", err);
      alert("Error al procesar el archivo. Asegúrate de que es un archivo de audio compatible (MP3, WAV, M4A, etc.)");
    } finally {
      setIsDecoding(false);
    }
  };

  const handleDeleteTrack = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (selectedTrackId === id) {
        const defaultTrack = DAFT_TRACKS[0].id;
        setSelectedTrackId(defaultTrack);
        GlobalDaftDJ.setDeckState(deckId, { currentTrackId: defaultTrack, isPlaying: false });
      }
      
      await deleteCustomTrack(id);
      GlobalDaftDJ.customTracks = GlobalDaftDJ.customTracks.filter(t => t.id !== id);
      GlobalDaftDJ.decodedBuffers.delete(id);
      
      await syncCustomTracksFromDB();
      onStateChange();
    } catch (err) {
      console.error("Error deleting track", err);
    }
  };

  // Dragging/Scratching tracker
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const rotateAngle = useRef(0);
  const dragVelocity = useRef(0);
  const lastDragTime = useRef(0);

  // Sync state initially and periodically
  useEffect(() => {
    const state = GlobalDaftDJ.getDeckState(deckId);
    setIsPlaying(state.isPlaying);
    setPitch(state.playbackRate);
    setSelectedTrackId(state.currentTrackId);
  }, [deckId, activeTrackId]);

  // Track the current step index of the sequencer visually
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(deckId === 'A' ? GlobalDaftDJ.stepA : GlobalDaftDJ.stepB);
      }, 50);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, deckId]);

  // Audio Play Pause Toggle
  const handlePlayPause = async () => {
    // Crucial: initialize context on user interaction
    GlobalDaftDJ.init();
    if (GlobalDaftDJ.ctx && GlobalDaftDJ.ctx.state === 'suspended') {
      await GlobalDaftDJ.ctx.resume();
    }

    const state = GlobalDaftDJ.getDeckState(deckId);
    const nextPlaying = !state.isPlaying;

    if (nextPlaying) {
      const success = await ensureTrackLoaded(selectedTrackId);
      if (!success) return; // Loading failed, ignore trigger
    }

    GlobalDaftDJ.setDeckState(deckId, { isPlaying: nextPlaying });
    setIsPlaying(nextPlaying);
    onStateChange();
  };

  const handleStop = () => {
    GlobalDaftDJ.setDeckState(deckId, { isPlaying: false });
    setIsPlaying(false);
    if (deckId === 'A') GlobalDaftDJ.stepA = 0;
    else GlobalDaftDJ.stepB = 0;
    onStateChange();
  };

  const handleTrackChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const trackId = e.target.value;
    setSelectedTrackId(trackId);
    GlobalDaftDJ.setDeckState(deckId, { currentTrackId: trackId });
    onStateChange();

    // Trigger preload fetch in background
    ensureTrackLoaded(trackId).catch(err => console.warn("Background track preload issue ignored:", err));
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPitch(val);
    GlobalDaftDJ.setDeckState(deckId, { playbackRate: val });
    onStateChange();
  };

  // Helper: helper coordinates for drag interaction angles
  const getMouseAngle = (e: React.MouseEvent<HTMLCanvasElement> | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    return Math.atan2(dy, dx);
  };

  // --- MOUSE/TOUCH SCRATCH DRAGGING EVENTS ---

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    GlobalDaftDJ.init();
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDragging.current = true;
    lastAngle.current = getMouseAngle(e, canvas);
    lastDragTime.current = Date.now();
    GlobalDaftDJ.setDeckState(deckId, { isScratching: true });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging.current) return;

    const angle = getMouseAngle(e, canvas);
    let delta = angle - lastAngle.current;

    // Handle wrap-around boundary jumps
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    rotateAngle.current += delta;
    lastAngle.current = angle;

    const timeNow = Date.now();
    const dt = Math.max(1, timeNow - lastDragTime.current); // ms
    lastDragTime.current = timeNow;

    // Calculate angular velocity (radians per second)
    const velocity = (delta / dt) * 1000;
    dragVelocity.current = velocity;

    // Update real song play position by scrubbing forward/backward
    GlobalDaftDJ.scrubTrack(deckId, delta);

    // Play tactile physical scratch squeals & buffer segments at current speed
    if (Math.abs(velocity) > 0.06) {
      GlobalDaftDJ.triggerScratchSfx(deckId, velocity * 0.15);
      GlobalDaftDJ.playScratchSlice(deckId, velocity * 0.4);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      GlobalDaftDJ.setDeckState(deckId, { isScratching: false, scratchSpeed: 0 });
    }
  };

  // Bind Touch Events manually supporting multi-touch and mobile scrolling override
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      // Prevent browser bounce scrolling on turntable interaction
      e.preventDefault();
      GlobalDaftDJ.init();
      isDragging.current = true;
      lastAngle.current = getMouseAngle(e, canvas);
      lastDragTime.current = Date.now();
      GlobalDaftDJ.setDeckState(deckId, { isScratching: true });
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseMove(e);
    };

    const onTouchEnd = () => {
      handleMouseUpOrLeave();
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [deckId]);

  // --- CANVAS HIGH DEFINITION RENDERING LOOP ---

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const track = GlobalDaftDJ.findTrack(selectedTrackId);

    // Separate buffer for visualizer analyser frequency reading
    const analyser = deckId === 'A' ? GlobalDaftDJ.analyserA : GlobalDaftDJ.analyserB;
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      // 1. Clear Canvas with high transparency trails for neon motion blur
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const diskRadius = Math.min(canvas.width, canvas.height) * 0.38;

      // 2. Fetch Frequency Waveform data from Web Audio Analyser
      let audioVolumeFactor = 0;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        // Calculate average amplitude (loudness of beat) for glowing scaling
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        audioVolumeFactor = sum / bufferLength; // 0 to 255
      }

      // 3. DRAW OUTWARDS NEON SOUND WAVES AROUND THE VINYL
      // These represent concentric arcs vibrating and expanding dynamically to frequency levels
      if (audioVolumeFactor > 5) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotateAngle.current * 0.1); // Slowly counter-rotate waves

        const wavePoints = 48;
        ctx.beginPath();
        for (let i = 0; i <= wavePoints; i++) {
          const angle = (i / wavePoints) * Math.PI * 2;
          // Map frequency bins to points
          const binIndex = Math.floor((i % (wavePoints / 2)) * (bufferLength / 24));
          const waveVal = (dataArray[binIndex] || 0) * (0.12 + Math.random() * 0.05); // frequency amplitude
          
          const glowRadius = diskRadius + 10 + waveVal;
          const x = Math.cos(angle) * glowRadius;
          const y = Math.sin(angle) * glowRadius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = track.color;
        ctx.shadowColor = track.color;
        ctx.shadowBlur = 12 + (audioVolumeFactor * 0.1);
        ctx.stroke();
        ctx.restore();
      }

      // 4. DRAW PHYSICAL VINYL DISK Platter
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Auto-rotate if playing, otherwise stand still or rotate with scratching velocity
      if (isPlaying && !isDragging.current) {
        rotateAngle.current += 0.05 * pitch;
      }
      ctx.rotate(rotateAngle.current);

      // Matte Charcoal Body base
      ctx.beginPath();
      ctx.arc(0, 0, diskRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#111115';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 15;
      ctx.fill();

      // Golden outer boundary styling
      ctx.strokeStyle = '#222230';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Shiny vinyl grooves (thin concentric light rings)
      ctx.shadowBlur = 0; // disable heavy shadows for micro lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let r = diskRadius - 8; r > 30; r -= 10) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Highlight glossy shine reflection sectors (recreates professional vinyl surface reflecting light)
      const gradGlint = ctx.createRadialGradient(0, 0, 10, 0, 0, diskRadius);
      gradGlint.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradGlint.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      gradGlint.addColorStop(0.7, 'rgba(255, 255, 255, 0.07)');
      gradGlint.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradGlint;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, diskRadius, -Math.PI / 8, Math.PI / 8);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, diskRadius, Math.PI - Math.PI / 8, Math.PI + Math.PI / 8);
      ctx.closePath();
      ctx.fill();

      // 5. CENTER GOLD OR PLATINUM MOUNT LABEL (Retro-futuristic Daft Punk Helmets style)
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#050505';
      ctx.strokeStyle = track.color;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Glowing Neon Core Pin
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = track.color;
      ctx.shadowBlur = 10;
      ctx.fill();

      // Little cyber-grid markings inside labeling
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-25, 0); ctx.lineTo(25, 0);
      ctx.moveTo(0, -25); ctx.lineTo(0, 25);
      ctx.stroke();

      ctx.restore();

      // 6. DRAW CHROME TONEARM / STYLUS NEEDLE
      // Placed stationary at top-right, angled slightly based on sequence progression
      ctx.save();
      const armX = centerX + diskRadius * 0.9;
      const armY = centerY - diskRadius * 0.9;
      
      ctx.translate(armX, armY);
      // Slight entry movement rotation as song progresses (0 to 16 steps maps onto slight angle)
      const currentStepVal = deckId === 'A' ? GlobalDaftDJ.stepA : GlobalDaftDJ.stepB;
      const progressAngle = 0.22 + (currentStepVal / 16) * 0.12;
      ctx.rotate(progressAngle);

      // Main thick metallic body of tonearm
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(30, 40, -10, 160);
      ctx.strokeStyle = '#3e3e52';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(30, 40, -10, 160);
      ctx.strokeStyle = '#e2e2e9';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Metallic counterweight at origin base
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#8a8a9a';
      ctx.fill();

      // Stylus cartridge head resting on vinyl record
      ctx.save();
      ctx.translate(-10, 160);
      ctx.rotate(-0.4);
      
      ctx.beginPath();
      ctx.rect(-6, -14, 12, 22);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Neon stylus cartridge laser glow indicator (Cyan/Pink depending on deck!)
      ctx.shadowColor = track.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = track.color;
      ctx.beginPath();
      ctx.arc(0, 4, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [selectedTrackId, isPlaying, pitch, deckId]);

  // Adjust canvas size when window container shifts
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dynamicWidth = container.clientWidth;
      canvas.width = dynamicWidth;
      // Golden ratio layout scaling height dynamically (capped for cinematic console height alignment)
      canvas.height = Math.max(260, Math.min(410, Math.floor(dynamicWidth * 0.85)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeTrack = GlobalDaftDJ.findTrack(selectedTrackId);

  return (
    <div className="relative flex flex-col p-5 bg-[#111] border border-[#222] rounded-3xl shadow-2xl overflow-hidden group">
      {/* Absolute Neon Glow border shadow */}
      <div 
        className="absolute inset-0 border-t-2 opacity-5 pointer-events-none transition-all duration-300"
        style={{ borderColor: activeTrack.color, boxShadow: `inset 0 4px 30px ${activeTrack.color}15` }}
      />

      {/* Title Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span 
            className="text-xs uppercase tracking-widest font-mono text-zinc-500 font-bold transition-all"
            style={{ textShadow: isPlaying ? activeTrack.neonShadow : 'none', color: isPlaying ? activeTrack.color : '#71717a' }}
          >
            SINTETIZADOR DE CANAL
          </span>
          <h2 className="text-2xl font-bold font-sans text-zinc-100 tracking-tight flex items-center gap-2">
            DECK {deckId} 
            <span 
              className="inline-block w-2.5 h-2.5 rounded-full" 
              style={{ 
                backgroundColor: isPlaying ? activeTrack.color : '#3f3f46',
                boxShadow: isPlaying ? activeTrack.neonShadow : 'none' 
              } } 
            />
          </h2>
        </div>
        
        {/* Track dropdown selection */}
        <div className="relative">
          <select 
            value={selectedTrackId}
            onChange={handleTrackChange}
            className="appearance-none bg-zinc-950 text-xs font-mono text-zinc-100 px-4 py-2 pr-9 border border-[#333] rounded-xl focus:outline-none focus:border-zinc-500 cursor-pointer text-center tracking-tight max-w-[150px] truncate"
          >
            <optgroup label="Álbum Discovery (Reales ✨)" className="bg-zinc-950 text-zinc-400 font-bold">
              {DAFT_TRACKS.filter(t => t.url).map(t => (
                <option key={t.id} value={t.id} className="text-[#00F3FF] font-semibold">{t.name}</option>
              ))}
            </optgroup>
            <optgroup label="Sintetizadores Daft" className="bg-zinc-950 text-zinc-500">
              {DAFT_TRACKS.filter(t => !t.url).map(t => (
                <option key={t.id} value={t.id} className="text-zinc-100">{t.name}</option>
              ))}
            </optgroup>
            {localCustomTracks.length > 0 && (
              <optgroup label="Pistas Persistentes" className="bg-zinc-950 text-zinc-500">
                {localCustomTracks.map(t => (
                  <option key={t.id} value={t.id} className="text-zinc-100">{t.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-650">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className="stroke-current">
              <path d="M1 1L4 4L7 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Description caption */}
      <p className="text-zinc-500 text-[11px] h-8 leading-normal tracking-tight line-clamp-2 pr-4">{activeTrack.description}</p>

      {/* TURNTABLE PLATTER DOCK CANVAS */}
      <div 
        ref={containerRef} 
        className="relative bg-zinc-950/60 rounded-2xl p-2 border border-zinc-900/80 my-4 overflow-hidden shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <canvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseMove={(e) => handleMouseMove(e)}
          className="w-full h-full block touch-none"
        />
        
        {isDecoding && (
          <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-4 text-center select-none backdrop-blur-sm z-20">
            <div className="w-10 h-10 border-t-2 border-r-2 border-[#00f3ff] rounded-full animate-spin mb-3" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#00f3ff] font-extrabold uppercase animate-pulse">DECODIFICANDO AUDIO...</span>
            <span className="text-[8px] font-mono text-zinc-500 mt-1 uppercase">CARGANDO MEMORIA PERSISTENTE DE AUDIO</span>
          </div>
        )}
        
        {/* Scratching indicator badge */}
        {isDragging.current && (
          <div className="absolute top-4 left-4 bg-red-950/90 text-red-400 font-mono text-[9px] px-2 py-0.5 border border-red-850 rounded-md animate-pulse uppercase tracking-widest flex items-center gap-1 shadow-md">
            <Disc className="w-3.5 h-3.5 animate-spin" /> SCRATCH ACTIVE
          </div>
        )}
      </div>

      {/* SEQUENCER LED STEP METER BAR */}
      <div className="flex items-center justify-between gap-1 p-1.5 bg-[#050505] rounded-xl border border-[#222] mb-5 relative">
        <span className="text-[9px] font-mono font-bold text-zinc-600 ml-1.5 uppercase">CLOCK</span>
        <div className="flex items-center gap-1.5 flex-1 justify-end mr-1">
          {Array.from({ length: 16 }).map((_, stepIdx) => {
            const isActive = currentStep === stepIdx;
            return (
              <div 
                key={stepIdx}
                className="w-2.5 h-2.5 rounded-full transition-all duration-75 relative"
                style={{
                  backgroundColor: isActive 
                    ? activeTrack.color 
                    : stepIdx % 4 === 0 ? '#27272a' : '#18181b',
                  boxShadow: isActive ? activeTrack.neonShadow : 'none'
                }}
              >
                {/* Micro accent */}
                {stepIdx % 4 === 0 && !isActive && (
                  <span className="absolute inset-0 bg-zinc-700 rounded-full scale-[0.4]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTION CONTROLS & SLIDERS */}
      <div className="grid grid-cols-4 gap-4 items-center">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          id={`play_btn_deck_${deckId}`}
          className="col-span-1 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all shadow-md focus:outline-none"
          style={{
            backgroundColor: isPlaying ? `${activeTrack.color}1C` : '#050505',
            borderColor: isPlaying ? activeTrack.color : '#333',
            boxShadow: isPlaying ? activeTrack.neonShadow + '25' : 'none'
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" style={{ color: activeTrack.color }} />
          ) : (
            <Play className="w-6 h-6 text-zinc-400" />
          )}
          <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color: isPlaying ? activeTrack.color : '#a1a1aa' }}>
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </span>
        </button>

        {/* STOP / RESET button */}
        <button
          onClick={handleStop}
          id={`stop_btn_deck_${deckId}`}
          className="col-span-1 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 border border-[#333] bg-[#050505] hover:bg-[#111] hover:border-zinc-700 transition-all text-zinc-400 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] font-bold font-mono tracking-wider">CUE</span>
        </button>

        {/* PITCH ADJUSTMENT FADER */}
        <div className="col-span-2 flex flex-col bg-zinc-950/40 p-3 rounded-2xl border border-zinc-900/60 relative">
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <span className="text-[9px] font-mono tracking-widest text-[#a1a1aa] uppercase font-bold">PITCH / TEMPO</span>
            <span 
              className="text-xs font-mono font-bold transition-all" 
              style={{ color: pitch !== 1.0 ? activeTrack.color : '#71717a' }}
            >
              {pitch === 1.0 ? '0.0%' : `${((pitch - 1) * 100).toFixed(1)}%`}
            </span>
          </div>
          <div className="relative flex items-center">
            <input 
              type="range"
              min="0.65"
              max="1.35"
              step="0.005"
              value={pitch}
              onChange={handlePitchChange}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-ew-resize accent-[#00F3FF]"
              style={{
                background: `linear-gradient(to right, ${activeTrack.color} 0%, ${activeTrack.color} ${((pitch - 0.65) / 0.7) * 100}%, #27272a ${((pitch - 0.65) / 0.7) * 100}%, #27272a 100%)`
              }}
            />
          </div>
          {/* Symmetrical markers */}
          <div className="flex justify-between text-[8px] font-mono text-zinc-650 px-0.5 mt-1.5">
            <span>-35%</span>
            <span className={pitch === 1.0 ? 'text-zinc-400 font-bold' : ''}>SYNC</span>
            <span>+35%</span>
          </div>
        </div>
      </div>

      {/* Persistence & Track Warehouse Box */}
      <div className="mt-5 pt-4 border-t border-[#222]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-widest text-[#00f3ff] font-bold uppercase">ALMACÉN DE PISTAS REALES</span>
          <label className="flex items-center gap-1 px-3 py-1 bg-[#050505] hover:bg-zinc-900 border border-[#222] rounded-xl text-[9px] font-mono text-zinc-300 font-bold tracking-wider cursor-pointer active:scale-95 transition-all text-center">
            <Upload className="w-3.5 h-3.5 text-[#00f3ff]" />
            {isDecoding ? 'DECODIFICANDO...' : 'SUBIR MP3 / WAV'}
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileUpload} 
              disabled={isDecoding}
              className="hidden" 
            />
          </label>
        </div>
        
        {localCustomTracks.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-1 bg-[#050505] p-2 border border-[#222] rounded-xl scrollbar-thin scrollbar-thumb-zinc-805">
            {localCustomTracks.map((t) => {
              const isCurrent = selectedTrackId === t.id;
              return (
                <div 
                  key={t.id} 
                  onClick={() => {
                    setSelectedTrackId(t.id);
                    GlobalDaftDJ.setDeckState(deckId, { currentTrackId: t.id });
                    onStateChange();
                  }}
                  className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg border text-[9px] font-mono cursor-pointer transition-all active:scale-[0.99] select-none ${
                    isCurrent 
                      ? 'bg-zinc-900 border-zinc-700 text-white font-bold' 
                      : 'bg-[#08080f]/40 border-[#222] text-zinc-400 hover:border-zinc-800 hover:text-zinc-250'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Disc className="w-3 h-3 animate-spin shrink-0" style={{ animationDuration: isCurrent && isPlaying ? '2s' : '0s', color: t.color }} />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteTrack(t.id, e)}
                    className="p-1 hover:bg-red-950/40 rounded-md text-zinc-600 hover:text-red-400 opacity-60 hover:opacity-100 transition-all shrink-0"
                    title="Borrar de la aplicación"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-2.5 px-3 bg-[#050505] border border-dashed border-[#222] rounded-xl text-center text-[9px] font-mono text-zinc-650 uppercase tracking-tight">
            No hay canciones reales guardadas. ¡Sube un archivo de audio para guardarlo aquí de forma permanente!
          </div>
        )}
      </div>

    </div>
  );
};
