import { useNavigate } from 'react-router-dom';
import { X, Lock } from 'lucide-react';

export default function UpgradePrompt({ feature, onClose }) {
  const navigate = useNavigate();

  const messages = {
    voiceBoost: { title: 'Voice Boost', benefit: 'Amplify your voice by up to +12 dB for crystal-clear audio.' },
    volumeBalance: { title: 'Volume Balance', benefit: 'Automatically even out loud and quiet parts throughout your video.' },
    exportFormats: { title: 'All Export Formats', benefit: 'Export to WebM, MOV, MKV, MP3, or WAV — your choice.' },
    limit: { title: 'Monthly Limit Reached', benefit: 'Upgrade to process up to 50 or 100 videos per month.' },
  };

  const info = messages[feature] || messages.limit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#12121c] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="float-right text-slate-500 hover:text-white transition-colors" aria-label="Close">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center">
            <Lock size={18} className="text-purple-400" />
          </div>
          <h3 className="font-display font-bold text-white text-lg">{info.title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-2">This feature is available on Plus and Pro.</p>
        <p className="text-slate-300 text-sm mb-5">
          {info.benefit} Included in Plus at just ₹100/month.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { navigate('/pricing'); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-accent text-[#0a0a0f] font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            See Plans
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
