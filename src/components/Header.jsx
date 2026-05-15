import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PlanBadge from './PlanBadge';
import LogoIcon from './LogoIcon';
import SkyToggle from './ui/sky-toggle';
import MotionButton from './ui/motion-button';

export default function Header({ user, usage, onSignIn, onSignOut, onStaffAccess }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  function handleLogoClick() {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      onStaffAccess?.();
    } else {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 2000);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/[0.10] bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16">

        {/* Logo — 5 rapid clicks opens staff dashboard */}
        <div onClick={handleLogoClick} className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer select-none">
          <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:glow-accent-sm transition-all flex-shrink-0" />
          <span className="font-display font-bold text-navy dark:text-white text-base sm:text-lg tracking-tight">
            Clear<span className="text-cyan-600 dark:text-accent">Voice</span>
            <span className="hidden sm:inline"> AI</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div style={{ transform: 'scale(0.55)', transformOrigin: 'center' }} className="flex-shrink-0">
            <SkyToggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>

          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white transition-colors hidden sm:block"
          >
            Pricing
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:block"><PlanBadge plan={usage.plan} used={usage.videosUsedThisMonth} /></span>
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full ring-2 ring-accent/30 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={onSignOut}
                aria-label="Sign out"
                className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-cyan-600 dark:bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
