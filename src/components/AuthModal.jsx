import { useEffect, useRef, useState } from 'react';
import { X, Loader2, Sparkles, Shield, Zap, Check } from 'lucide-react';

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 14.015 17.64 11.707 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const FEATURES = [
  { icon: <Zap size={15} />,     text: 'AI-powered noise removal in seconds'   },
  { icon: <Sparkles size={15} />,text: 'Demucs v4 voice separation technology'  },
  { icon: <Shield size={15} />,  text: 'Runs entirely in your browser — private' },
  { icon: <Check size={15} />,   text: 'Free to start, no credit card required'  },
];

export default function AuthModal({ user, onSignIn, onRenderGISButton, onClose }) {
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [mode, setMode]               = useState('signin');
  const [showGISButton, setShowGISButton] = useState(false);
  const gisContainerRef               = useRef(null);

  // Close as soon as Firebase confirms the user is signed in
  useEffect(() => {
    if (user) onClose();
  }, [user, onClose]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Mount GIS rendered button when fallback is requested
  useEffect(() => {
    if (showGISButton && gisContainerRef.current) {
      onRenderGISButton?.(gisContainerRef.current);
    }
  }, [showGISButton, onRenderGISButton]);

  async function handleSignIn() {
    setError('');
    setLoading(true);
    try {
      await onSignIn();
    } catch (e) {
      if (e.code === 'auth/one-tap-unavailable') {
        // One Tap / FedCM not available → fall back to Google's rendered button
        setShowGISButton(true);
        setLoading(false);
        return;
      }
      if (e.code === 'auth/missing-client-id') {
        setError('Configuration error: VITE_GOOGLE_CLIENT_ID is not set in .env.local');
        setLoading(false);
        return;
      }
      const msgs = {
        'auth/unauthorized-domain': 'This domain isn\'t authorised — add it in Firebase Console → Authentication → Settings → Authorised domains.',
        'auth/popup-blocked':       'Popup blocked by browser — please allow popups and try again.',
      };
      setError(msgs[e.code] || `Sign-in failed: ${e.message}`);
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/90 backdrop-blur-xl px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#00d4ff]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#7c3aed]/10 blur-[120px]" />
      </div>

      {/* Modal container */}
      <div className="relative w-full max-w-[900px] bg-[#0a0f1e]/95 border border-white/10 rounded-[28px] shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* ── LEFT — branding panel ── */}
        <div className="relative hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#7c3aed]/15" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-100" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#00d4ff]/8 blur-[80px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-14">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </div>
              <span className="font-display font-extrabold text-white text-lg tracking-tight">ClearVoice</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl text-white leading-tight mb-4">
              Crystal clear audio.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]">
                Every time.
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">
              AI-powered voice separation and noise removal — running entirely inside your browser.
            </p>

            <ul className="space-y-4">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00d4ff] flex-shrink-0">
                    {f.icon}
                  </span>
                  <span className="text-slate-300 text-sm font-medium">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-10">
            <div className="flex items-end gap-[3px] h-12 opacity-30">
              {[4,7,12,18,14,8,20,15,10,6,16,22,18,12,8,14,20,16,10,6,12,18,14,9,5].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-[#00d4ff] to-[#7c3aed]"
                  style={{ height: `${h * 2}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* ── RIGHT — auth panel ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12">

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-8 w-fit">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setShowGISButton(false); }}
                className={`px-5 py-2 rounded-[10px] text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to access your videos, settings, and plan.'
                : 'Join ClearVoice and start cleaning audio for free.'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          {/* Primary Google button (shows while One Tap is available or loading) */}
          {!showGISButton && (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-white/10 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-slate-500" />
              ) : (
                GOOGLE_ICON
              )}
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>
          )}

          {/* GIS rendered button fallback — shown when One Tap/FedCM can't display */}
          {showGISButton && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs text-center mb-3">
                Choose your Google account to continue:
              </p>
              {/* GIS mounts its button here */}
              <div ref={gisContainerRef} className="flex justify-center" />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.15]" />
            <span className="text-slate-400 text-xs font-medium">One click, no password needed</span>
            <div className="flex-1 h-px bg-white/[0.15]" />
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.12]">
            <Shield size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              We use your Google account only to save your plan and usage. Your audio never leaves your device — all processing happens locally in your browser.
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-slate-400 text-center mt-6">
            By continuing you agree to our{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
