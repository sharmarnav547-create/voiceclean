import { useRef, useEffect, useState } from 'react';
import { Play, Pause, LayoutPanelLeft, Columns2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoPreview({ originalUrl, cleanedUrl, userPlan }) {
  const origRef = useRef(null);
  const cleanRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState('side');
  const [showing, setShowing] = useState('original');

  function syncPlayPause() {
    const orig = origRef.current;
    const clean = cleanRef.current;
    if (!orig) return;

    if (playing) {
      orig.pause();
      clean?.pause();
      setPlaying(false);
    } else {
      orig.play().catch(() => {});
      if (cleanedUrl && clean) clean.play().catch(() => {});
      setPlaying(true);
    }
  }

  useEffect(() => {
    const orig = origRef.current;
    if (!orig) return;
    const onEnd = () => setPlaying(false);
    orig.addEventListener('ended', onEnd);
    return () => orig.removeEventListener('ended', onEnd);
  }, []);

  if (!originalUrl) return null;

  const isWatermarked = ['free', 'starter'].includes(userPlan || 'free');

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-navy dark:text-white text-2xl">Video Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('side')}
            className={`p-2 rounded-lg transition-colors ${mode === 'side' ? 'bg-accent/15 dark:bg-accent/20 text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
            aria-label="Side by side"
          >
            <Columns2 size={16} />
          </button>
          <button
            onClick={() => setMode('toggle')}
            className={`p-2 rounded-lg transition-colors ${mode === 'toggle' ? 'bg-accent/15 dark:bg-accent/20 text-accent' : 'text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}
            aria-label="Toggle view"
          >
            <LayoutPanelLeft size={16} />
          </button>
        </div>
      </div>

      {mode === 'side' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VideoCard label="Original" videoRef={origRef} src={originalUrl} isWatermarked={isWatermarked} />
          <VideoCard label="Cleaned" videoRef={cleanRef} src={cleanedUrl} placeholder isWatermarked={isWatermarked} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            {['original', 'cleaned'].map((v) => (
              <button
                key={v}
                onClick={() => setShowing(v)}
                disabled={v === 'cleaned' && !cleanedUrl}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  showing === v
                    ? 'bg-accent text-white'
                    : 'bg-slate-200 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-navy dark:hover:text-white'
                }`}
              >
                {v === 'original' ? 'Original' : 'Cleaned'}
              </button>
            ))}
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">
            <video
              src={showing === 'original' ? originalUrl : cleanedUrl}
              controls
              className="w-full max-h-64 object-contain"
            />
            {isWatermarked && (
              <div className="absolute bottom-12 right-2 md:bottom-2 md:right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 pointer-events-none z-10 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">ClearVoice AI</span>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === 'side' && cleanedUrl && (
        <div className="flex justify-center mt-4">
          <button
            onClick={syncPlayPause}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/15 border border-accent/40 text-accent text-sm font-medium hover:bg-accent/25 transition-all shadow-sm"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Pause Both' : 'Play Both'}
          </button>
        </div>
      )}
    </motion.section>
  );
}

function VideoCard({ label, videoRef, src, placeholder, isWatermarked }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03]">
        <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{label}</span>
      </div>
      <div className="bg-slate-100 dark:bg-black/50 flex-1 relative flex items-center justify-center">
        {src ? (
          <>
            <video ref={videoRef} src={src} controls className="w-full max-h-52 object-contain" />
            {isWatermarked && (
              <div className="absolute bottom-10 right-2 md:bottom-2 md:right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 pointer-events-none z-10 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">ClearVoice AI</span>
              </div>
            )}
          </>
        ) : (
          <div className="h-52 flex items-center justify-center text-slate-500 dark:text-slate-500 text-sm italic">
            Cleaned video will appear here
          </div>
        )}
      </div>
    </div>
  );
}
