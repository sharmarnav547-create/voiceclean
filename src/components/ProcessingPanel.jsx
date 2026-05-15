import { useState } from 'react';
import { Lock, AlertTriangle, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessingPanel({
  hasFile,
  userPlan,
  canProcess,
  processing,
  done,
  progress,
  currentStage,
  stages = [],
  logs,
  onProcess,
  onUpgradePrompt,
  settings,
  onSettingsChange,
  hasGPU,
  modelDownload,
  totalModelMB,
}) {
  const [showLogs, setShowLogs] = useState(false);
  const isPlusOrPro = userPlan === 'plus' || userPlan === 'pro';
  const isDownloading = !!modelDownload;

  function toggle(key) {
    if ((key === 'boostVoice' || key === 'balanceVolume') && !isPlusOrPro) {
      onUpgradePrompt(key === 'boostVoice' ? 'voiceBoost' : 'volumeBalance');
      return;
    }
    onSettingsChange({ ...settings, [key]: !settings[key] });
  }

  function change(key, value) {
    onSettingsChange({ ...settings, [key]: value });
  }

  const isLocked = (key) => !isPlusOrPro && (key === 'boostVoice' || key === 'balanceVolume');

  const dlPercent = modelDownload
    ? Math.round((modelDownload.demucs + modelDownload.deepfilter) / 2)
    : 0;
  const dlMBDone = modelDownload ? Math.round((dlPercent / 100) * totalModelMB) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6 bg-white dark:bg-[#0a0a0f]/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/[0.10] shadow-lg dark:shadow-xl"
    >
      <h2 className="font-display font-bold text-navy dark:text-white text-2xl">Audio Enhancement Settings</h2>

      {/* GPU/CPU indicator */}
      {hasGPU !== null && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${
          hasGPU
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/30 text-green-800 dark:text-green-400'
            : 'bg-amber-50 dark:bg-yellow-900/20 border-amber-300 dark:border-yellow-700/30 text-amber-800 dark:text-yellow-400'
        }`}>
          {hasGPU ? '🟢 GPU detected — processing will be fast' : '🟡 No GPU — processing will take longer'}
        </div>
      )}

      {/* Model download progress */}
      {isDownloading && (
        <div className="bg-accent/5 border border-accent/25 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-navy dark:text-white">Downloading AI — First Time Only</p>
          {[
            { key: 'demucs',     name: 'Voice Separator', size: '120 MB', pct: modelDownload.demucs },
            { key: 'deepfilter', name: 'Audio Cleaner',    size:  '50 MB', pct: modelDownload.deepfilter },
          ].map((m) => (
            <div key={m.key} className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{m.name}</span>
                <span className="font-mono">
                  {m.size} · {m.pct === 100 ? '✓ Done' : m.pct === 0 ? 'Waiting…' : `${m.pct}%`}
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-600 dark:text-slate-500">{totalModelMB} MB total · Saved forever after this</p>
        </div>
      )}

      {/* Noise Reduction */}
      <Card title="Noise Reduction">
        <SettingRow label="Reduction Strength">
          <SegmentControl
            options={['light', 'medium', 'aggressive']}
            labels={['Light', 'Medium', 'Aggressive']}
            value={settings.noiseStrength}
            onChange={(v) => change('noiseStrength', v)}
          />
        </SettingRow>
        <SettingRow label="Enhance Voice Clarity">
          <Toggle checked={settings.enhanceSpeech} onChange={() => toggle('enhanceSpeech')} />
        </SettingRow>
        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">
          Demucs v4 separates vocals from everything else. DeepFilterNet3 removes any residual artifacts.
        </p>
      </Card>

      {/* Voice Boost */}
      <Card title="Voice Boost" locked={isLocked('boostVoice')} onLockClick={() => onUpgradePrompt('voiceBoost')}>
        <SettingRow label="Boost Voice">
          <Toggle
            checked={settings.boostVoice}
            onChange={() => toggle('boostVoice')}
            disabled={isLocked('boostVoice')}
          />
          {isLocked('boostVoice') && <Lock size={14} className="text-slate-500 dark:text-slate-400 ml-1" />}
        </SettingRow>
        {settings.boostVoice && isPlusOrPro && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Boost Amount</span>
              <span className="font-mono text-accent">+{settings.boostDb} dB</span>
            </div>
            <input
              type="range" min={1} max={12} step={1}
              value={settings.boostDb}
              onChange={(e) => change('boostDb', Number(e.target.value))}
              className="w-full accent-accent"
              style={{ background: `linear-gradient(to right, #00d4ff ${(settings.boostDb - 1) / 11 * 100}%, #2a2a3e ${(settings.boostDb - 1) / 11 * 100}%)` }}
            />
            {settings.boostDb > 9 && (
              <p className="flex items-center gap-1.5 text-amber-700 dark:text-yellow-400 text-xs">
                <AlertTriangle size={12} />
                High boost may cause clipping — Volume Balance recommended
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Volume Balance */}
      <Card title="Volume Balance" locked={isLocked('balanceVolume')} onLockClick={() => onUpgradePrompt('volumeBalance')}>
        <SettingRow label={
          <span className="flex items-center gap-1.5">
            Balance Volume
            <span title="Balances volume so quiet parts are louder and loud parts are softer." className="text-slate-500 cursor-help">ℹ️</span>
          </span>
        }>
          <Toggle
            checked={settings.balanceVolume}
            onChange={() => toggle('balanceVolume')}
            disabled={isLocked('balanceVolume')}
          />
          {isLocked('balanceVolume') && <Lock size={14} className="text-slate-500 dark:text-slate-400 ml-1" />}
        </SettingRow>
        {settings.balanceVolume && isPlusOrPro && (
          <div className="mt-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Balance Strength</p>
            <SegmentControl
              options={['gentle', 'normal', 'strong']}
              labels={['Gentle', 'Normal', 'Strong']}
              value={settings.balanceStrength}
              onChange={(v) => change('balanceStrength', v)}
            />
          </div>
        )}
      </Card>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: (hasFile && canProcess && !processing && !done) ? 1.02 : 1 }}
        whileTap={{ scale: (hasFile && canProcess && !processing && !done) ? 0.98 : 1 }}
        onClick={onProcess}
        disabled={!hasFile || processing || done || !canProcess}
        aria-label="Remove Noise"
        className={`relative w-full py-4 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3 shadow-lg ${
          done
            ? 'btn-done-gradient cursor-default'
            : !hasFile || !canProcess
            ? 'bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400 border-2 border-slate-300 dark:border-white/[0.08] cursor-not-allowed shadow-none'
            : processing
            ? 'bg-accent/10 text-accent border border-accent/30 cursor-wait shadow-none'
            : 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 hover:shadow-lg'
        }`}
      >
        {done ? (
          <span className="done-text flex items-center gap-3"><CheckCircle2 size={24} /> ✓ Done — Download Ready</span>
        ) : isDownloading ? (
          <><Loader2 size={24} className="animate-spin" /> Downloading AI — {dlMBDone} / {totalModelMB} MB</>
        ) : processing ? (
          <><Loader2 size={24} className="animate-spin" /> Processing — {progress}%</>
        ) : !canProcess ? (
          'Monthly limit reached — Upgrade to continue'
        ) : (
          'Remove Noise with AI'
        )}
      </motion.button>

      {/* Progress bar */}
      {processing && (
        <div className="space-y-3">
          <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {stages.map((s, i) => (
              <span
                key={s}
                className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                  i < currentStage
                    ? 'bg-accent/20 text-accent'
                    : i === currentStage
                    ? 'bg-accent text-white dark:text-[#0a0a0f] font-semibold'
                    : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-500'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FFmpeg Logs */}
      {logs.length > 0 && (
        <div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            FFmpeg logs ({logs.length} lines)
          </button>
          {showLogs && (
            <pre className="mt-2 p-3 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-400 max-h-32 overflow-y-auto scrollbar-thin whitespace-pre-wrap">
              {logs.slice(-50).join('\n')}
            </pre>
          )}
        </div>
      )}
    </motion.section>
  );
}

function Card({ title, children, locked, onLockClick }) {
  return (
    <div
      className={`bg-white dark:bg-white/[0.03] border rounded-2xl p-5 transition-colors shadow-sm dark:shadow-none ${
        locked
          ? 'border-slate-300 dark:border-white/[0.08] cursor-pointer hover:border-slate-400 dark:hover:border-white/[0.15]'
          : 'border-slate-300 dark:border-white/[0.08]'
      }`}
      onClick={locked ? onLockClick : undefined}
    >
      <h3 className="font-display font-semibold text-navy dark:text-white text-base mb-4 flex items-center gap-2">
        {title}
        {locked && <Lock size={14} className="text-slate-500 dark:text-slate-400" />}
      </h3>
      {children}
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 border ${
        checked && !disabled
          ? 'bg-accent border-accent'
          : 'bg-slate-200 dark:bg-white/[0.08] border-slate-300 dark:border-white/[0.15]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

function SegmentControl({ options, labels, value, onChange }) {
  return (
    <div className="flex rounded-xl border border-slate-300 dark:border-white/[0.10] bg-slate-100 dark:bg-white/[0.05] p-1 gap-1">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
            value === opt
              ? 'bg-cyan-600 dark:bg-accent text-white dark:text-[#0a0a0f] shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
          }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}
