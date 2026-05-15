import { useRef, useState } from 'react';
import { Film, Upload, X, Clock, HardDrive, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatFileSize(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  return (bytes / 1e3).toFixed(0) + ' KB';
}

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function UploadZone({ onFileSelected }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  function handleFile(file) {
    setError('');
    if (!file) return;
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      setError('Please upload a valid MP4 file.');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('Warning: File is larger than 500 MB. Processing may be slow.');
    }

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setPreview({ name: file.name, size: file.size, duration: video.duration, url });
      onFileSelected(file, url);
    };
    video.onerror = () => {
      setError('Could not read video metadata. Make sure the file is a valid MP4.');
    };
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function clearFile() {
    setPreview(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <section className="w-full max-w-2xl mx-auto relative z-20">
      <AnimatePresence mode="wait">
      {!preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
            dragging
              ? 'border-accent bg-accent/10 dark:bg-accent/5 glow-accent scale-[1.02]'
              : 'border-slate-300 dark:border-white/25 bg-white/70 dark:bg-white/[0.03] hover:border-accent/70 hover:bg-slate-50 dark:hover:bg-accent/[0.04] shadow-lg hover:shadow-xl dark:shadow-none'
          }`}
          role="button"
          aria-label="Upload MP4 file"
        >
          {dragging && (
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-purple/10 dark:from-accent/5 dark:to-purple/5 pointer-events-none"
             />
          )}

          <motion.div
            animate={{ y: dragging ? -10 : 0, scale: dragging ? 1.1 : 1 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm ${dragging ? 'bg-accent text-white shadow-accent/50' : 'bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300'}`}
          >
            {dragging ? <Upload size={36} /> : <Video size={36} />}
          </motion.div>
          <p className="text-navy dark:text-white font-semibold text-2xl mb-2 font-display">
            {dragging ? 'Drop your video to enhance' : 'Upload your video'}
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-base mb-6">
            Drag & drop or <span className="text-cyan-600 dark:text-accent hover:text-purple transition-colors font-medium">browse files</span>
          </p>
          <div className="flex gap-4">
             <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">MP4 Format</span>
             <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Max 500 MB</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,.mp4"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 flex items-start gap-5 shadow-xl"
        >
          <div className="relative group">
            <video
              src={preview.url}
              className="w-32 h-24 object-cover rounded-xl bg-black flex-shrink-0 border border-slate-200 dark:border-white/15"
              muted
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
               <Film className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-medium text-navy dark:text-white truncate mb-2">{preview.name}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5"><Clock size={14} />{formatDuration(preview.duration)}</span>
              <span className="flex items-center gap-1.5"><HardDrive size={14} />{formatFileSize(preview.size)}</span>
            </div>
          </div>
          <button onClick={clearFile} aria-label="Remove file" className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0 bg-slate-100 dark:bg-white/[0.08] hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg">
            <X size={18} />
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {error && (
        <p className="mt-3 text-red-600 dark:text-red-400 text-sm text-center" role="alert">{error}</p>
      )}
    </section>
  );
}
