import { motion } from 'framer-motion';

const REMOVED_ITEMS = [
  'Background noise & fan sounds',
  'Background voices',
  'Music & other sounds',
  'Hiss, hum & static',
];

export default function ResultPanel({ hasGPU }) {
  const modeColor = hasGPU ? 'text-green-600 dark:text-green-400' : 'text-amber-700 dark:text-yellow-400';
  const modeLabel = hasGPU ? '🟢 GPU' : '🟡 CPU';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <h2 className="font-display font-bold text-navy dark:text-white text-2xl">✓ Noise Removal Complete</h2>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Removed from your audio:</p>
        <ul className="space-y-3">
          {REMOVED_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-emerald-500 dark:text-emerald-400 text-lg">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="pt-4 border-t border-slate-200 dark:border-white/10">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Processing mode: <span className={modeColor}>{modeLabel}</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
