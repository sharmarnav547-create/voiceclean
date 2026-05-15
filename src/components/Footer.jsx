import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';
import LogoIcon from './LogoIcon';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/[0.10] bg-bg-light dark:bg-bg-dark py-10 sm:py-12 mt-12 sm:mt-20 relative z-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-2 group">
          <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:glow-accent-sm transition-all" />
          <span className="font-display font-bold text-navy dark:text-white text-base sm:text-lg tracking-tight">
            Clear<span className="text-accent">Voice</span> AI
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-accent dark:hover:text-accent transition-colors">Home</Link>
          <Link to="/pricing" className="hover:text-accent dark:hover:text-accent transition-colors">Pricing</Link>
          <a href="#" className="hover:text-accent dark:hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent dark:hover:text-accent transition-colors">Terms of Service</a>
        </div>

        <div className="flex gap-5">
          <a href="#" aria-label="Chat" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors p-2"><MessageCircle size={20} /></a>
          <a href="#" aria-label="Website" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors p-2"><Globe size={20} /></a>
          <a href="#" aria-label="Email" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors p-2"><Mail size={20} /></a>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-4">
        &copy; {new Date().getFullYear()} ClearVoice AI. All rights reserved.
      </div>
    </footer>
  );
}
