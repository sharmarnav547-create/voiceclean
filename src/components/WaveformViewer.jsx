import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WaveformViewer({ originalBlob, cleanedBlob, noisePercent }) {
  const origContainerRef = useRef(null);
  const cleanContainerRef = useRef(null);
  const origWsRef = useRef(null);
  const cleanWsRef = useRef(null);
  const [origPlaying, setOrigPlaying] = useState(false);
  const [cleanPlaying, setCleanPlaying] = useState(false);

  useEffect(() => {
    if (!originalBlob || !origContainerRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const ws = WaveSurfer.create({
      container: origContainerRef.current,
      waveColor: isDark ? '#475569' : '#94a3b8',
      progressColor: '#00d4ff60',
      height: 64,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      interact: true,
      url: URL.createObjectURL(originalBlob),
    });
    ws.on('finish', () => setOrigPlaying(false));
    origWsRef.current = ws;
    return () => ws.destroy();
  }, [originalBlob]);

  useEffect(() => {
    if (!cleanedBlob || !cleanContainerRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const ws = WaveSurfer.create({
      container: cleanContainerRef.current,
      waveColor: isDark ? '#00d4ff40' : '#00d4ff60',
      progressColor: '#00d4ff',
      height: 64,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      interact: true,
      url: URL.createObjectURL(cleanedBlob),
    });
    ws.on('finish', () => setCleanPlaying(false));
    cleanWsRef.current = ws;
    return () => ws.destroy();
  }, [cleanedBlob]);

  function toggleOrig() {
    const ws = origWsRef.current;
    if (!ws) return;
    ws.playPause();
    setOrigPlaying(!origPlaying);
  }

  function toggleClean() {
    const ws = cleanWsRef.current;
    if (!ws) return;
    ws.playPause();
    setCleanPlaying(!cleanPlaying);
  }

  if (!originalBlob) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-navy dark:text-white text-2xl">Waveform Comparison</h2>
        {noisePercent > 0 && (
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:border dark:border-emerald-700/30 dark:text-emerald-400 font-medium">
            ~{noisePercent}% background removed — voice isolated
          </span>
        )}
      </div>

      <WaveCard
        label="Original Audio"
        containerRef={origContainerRef}
        playing={origPlaying}
        onToggle={toggleOrig}
        color="text-slate-400"
      />
      {cleanedBlob && (
        <WaveCard
          label="Cleaned Audio"
          containerRef={cleanContainerRef}
          playing={cleanPlaying}
          onToggle={toggleClean}
          color="text-accent"
        />
      )}
    </motion.section>
  );
}

function WaveCard({ label, containerRef, playing, onToggle, color }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onToggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-accent/20 flex items-center justify-center transition-colors shadow-sm border border-slate-200 dark:border-white/5"
        >
          {playing ? <Pause size={16} className="text-accent" /> : <Play size={16} className={color.replace('text-slate-400', 'text-slate-600 dark:text-slate-400')} />}
        </button>
        <span className={`text-sm font-semibold ${color.replace('text-slate-400', 'text-slate-700 dark:text-slate-300')}`}>{label}</span>
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
