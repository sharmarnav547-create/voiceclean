import { useState } from 'react';
import { Download, Loader2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { FORMATS, QUALITY } from '../utils/formatUtils';

const FREE_FORMATS = ['mp4'];

export default function ExportPanel({ cleanedBlob, originalName, userPlan, onExport, onUpgradePrompt }) {
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('original');
  const [filename, setFilename] = useState(() => {
    const base = originalName?.replace(/\.mp4$/i, '') || 'video';
    return `${base}-cleaned`;
  });
  const [exporting, setExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isPlusOrPro = userPlan === 'plus' || userPlan === 'pro';
  const availableFormats = isPlusOrPro ? Object.values(FORMATS) : Object.values(FORMATS).filter(f => FREE_FORMATS.includes(f.id));

  async function handleExport() {
    if (!cleanedBlob) return;
    setExporting(true);
    try {
      await onExport({ format, quality, filename });
    } finally {
      setExporting(false);
    }
  }

  function handleFormatClick(fmtId) {
    if (!isPlusOrPro && !FREE_FORMATS.includes(fmtId)) {
      onUpgradePrompt('exportFormats');
      return;
    }
    setFormat(fmtId);
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6 glass-card p-6 sm:p-8 rounded-3xl"
    >
      <h2 className="font-display font-bold text-navy dark:text-white text-xl sm:text-2xl">Your Video is Ready</h2>

      {/* Advanced export options */}
      {showAdvanced && (
        <>
          {/* Format selector */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Format</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(FORMATS).map((f) => {
                const locked = !isPlusOrPro && !FREE_FORMATS.includes(f.id);
                const selected = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFormatClick(f.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      selected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20'
                        : locked
                        ? 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-500 border-slate-200 dark:border-white/[0.08] cursor-pointer hover:border-slate-300 dark:hover:border-white/[0.15]'
                        : 'bg-white/50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-accent hover:text-navy dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                    {!locked && <span className="ml-1.5 text-xs opacity-60 font-normal">{f.description}</span>}
                    {locked && <Lock size={12} className="inline ml-1.5 opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Quality</p>
            <div className="flex gap-2">
              {Object.entries(QUALITY).map(([key, q]) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                    quality === key
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-400/60 shadow-sm'
                      : 'bg-white/50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-navy dark:hover:text-white'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">File Name</p>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 shadow-inner">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 bg-transparent text-sm font-mono text-navy dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="filename"
              />
              <span className="text-slate-400 dark:text-slate-500 text-sm font-mono font-medium">.{FORMATS[format]?.ext}</span>
            </div>
          </div>
        </>
      )}

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(v => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {showAdvanced ? 'Hide Advanced Options' : 'Advanced Export Options'}
      </button>

      {/* Download */}
      <motion.button
        whileHover={{ scale: (!cleanedBlob || exporting) ? 1 : 1.02 }}
        whileTap={{ scale: (!cleanedBlob || exporting) ? 1 : 0.98 }}
        onClick={handleExport}
        disabled={!cleanedBlob || exporting}
        className={`w-full py-4 rounded-2xl font-display font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
          !cleanedBlob
            ? 'bg-slate-200 dark:bg-white/[0.06] text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            : exporting
            ? 'bg-accent/10 text-accent border border-accent/20 cursor-wait shadow-none'
            : 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 hover:shadow-lg'
        }`}
        aria-label="Download Video"
      >
        {exporting ? (
          <><Loader2 size={24} className="animate-spin" /> Preparing…</>
        ) : (
          <><Download size={24} /> Download Video</>
        )}
      </motion.button>
    </motion.section>
  );
}
