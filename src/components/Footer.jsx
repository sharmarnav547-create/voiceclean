import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import LogoIcon from './LogoIcon';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f] py-10 sm:py-14 mt-12 sm:mt-20 relative z-10"
      aria-label="Site footer"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link to="/" className="flex items-center gap-2 group w-fit" aria-label="ClearVoice AI home">
              <LogoIcon className="w-7 h-7 group-hover:glow-accent-sm transition-all flex-shrink-0" />
              <span className="font-display font-bold text-navy dark:text-white text-base tracking-tight">
                Clear<span className="text-cyan-600 dark:text-accent">Voice</span> AI
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-powered background noise removal that runs entirely in your browser. Your files never leave your device.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-10 gap-y-5 text-sm">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product</span>
              <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white transition-colors">Home</Link>
              <Link to="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white transition-colors">Pricing</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Legal</span>
              <span className="text-slate-400 dark:text-slate-600 text-sm">Privacy Policy</span>
              <span className="text-slate-400 dark:text-slate-600 text-sm">Terms of Service</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact</span>
              <a
                href="mailto:sharmarnav547@gmail.com"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white transition-colors"
              >
                <Mail size={13} /> Email us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {year} ClearVoice AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            Powered by Demucs v4 &middot; 100% browser-based processing
          </p>
        </div>
      </div>
    </footer>
  );
}
