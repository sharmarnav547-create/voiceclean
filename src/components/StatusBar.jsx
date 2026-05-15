import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function StatusBar({ status, message, onDismiss }) {
  if (!message && status === 'idle') return null;

  const styles = {
    idle:       'bg-slate-100 dark:bg-[#12121c] border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300',
    loading:    'bg-accent/10 dark:bg-[#0d1a2a] border-accent/40 dark:border-accent/20 text-sky-700 dark:text-accent',
    processing: 'bg-accent/10 dark:bg-[#0d1a2a] border-accent/40 dark:border-accent/20 text-sky-700 dark:text-accent',
    done:       'bg-green-50 dark:bg-[#0d1f14] border-green-400 dark:border-green-700/40 text-green-800 dark:text-green-400',
    error:      'bg-red-50 dark:bg-[#1f0d0d] border-red-400 dark:border-red-700/40 text-red-700 dark:text-red-400',
  };

  const icons = {
    loading:    <Loader2 size={15} className="animate-spin flex-shrink-0" />,
    processing: <Loader2 size={15} className="animate-spin flex-shrink-0" />,
    done:       <CheckCircle2 size={15} className="flex-shrink-0" />,
    error:      <AlertCircle size={15} className="flex-shrink-0" />,
  };

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-lg text-sm font-medium max-w-[90vw] ${styles[status] || styles.idle}`}>
      {icons[status]}
      <span className="truncate">{message}</span>
      {onDismiss && status === 'error' && (
        <button onClick={onDismiss} aria-label="Dismiss" className="ml-1 flex-shrink-0 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
