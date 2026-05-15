import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle } from 'lucide-react';
import LogoIcon from './LogoIcon';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/[0.10] bg-bg-light dark:bg-bg-dark py-12 mt-20 relative z-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 group">
          <LogoIcon className="w-8 h-8 group-hover:glow-accent-sm transition-all" />
          <span className="font-display font-bold text-navy dark:text-white text-lg tracking-tight">
            Clear<span className="text-accent">Voice</span> AI
          </span>
        </div>

        <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-accent dark:hover:text-accent transition-colors">Home</Link>
          <Link to="/pricing" className="hover:text-accent dark:hover:text-accent transition-colors">Pricing</Link>
          <a href="#" className="hover:text-accent dark:hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent dark:hover:text-accent transition-colors">Terms of Service</a>
        </div>

        <div className="flex gap-4">
          <a href="#" aria-label="Chat" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"><MessageCircle size={20} /></a>
          <a href="#" aria-label="Website" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"><Globe size={20} /></a>
          <a href="#" aria-label="Email" className="text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"><Mail size={20} /></a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} ClearVoice AI. All rights reserved.
      </div>
    </footer>
  );
}
