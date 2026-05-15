import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanBadge from './PlanBadge';
import LogoIcon from './LogoIcon';
import SkyToggle from './ui/sky-toggle';

export default function Header({ user, usage, onSignIn, onSignOut, onStaffAccess }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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

  function handleMenuSignIn() {
    setMenuOpen(false);
    onSignIn();
  }

  function handleMenuPricing() {
    setMenuOpen(false);
    navigate('/pricing');
  }

  function handleMenuSignOut() {
    setMenuOpen(false);
    onSignOut();
  }

  const menuItemVariants = {
    hidden:  { opacity: 0, x: 40 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' } }),
    exit:    { opacity: 0, x: 40, transition: { duration: 0.15 } },
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/[0.10] bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <div onClick={handleLogoClick} className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer select-none">
            <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:glow-accent-sm transition-all flex-shrink-0" />
            <span className="font-display font-bold text-navy dark:text-white text-base sm:text-lg tracking-tight">
              Clear<span className="text-cyan-600 dark:text-accent">Voice</span>
              <span className="hidden sm:inline"> AI</span>
            </span>
          </div>

          {/* Desktop right side */}
          <div className="hidden sm:flex items-center gap-4">
            <div style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
              <SkyToggle checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white transition-colors">
              Pricing
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <PlanBadge plan={usage.plan} used={usage.videosUsedThisMonth} />
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-accent/30" referrerPolicy="no-referrer" />
                <button onClick={onSignOut} aria-label="Sign out" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={onSignIn} className="text-sm font-semibold px-4 py-2 rounded-xl bg-cyan-600 dark:bg-accent text-white hover:opacity-90 transition-opacity">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex sm:hidden items-center gap-2">
            <div style={{ transform: 'scale(0.52)', transformOrigin: 'center' }} className="flex-shrink-0">
              <SkyToggle checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            {user && (
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-accent/30 flex-shrink-0" referrerPolicy="no-referrer" />
            )}
            {/* Hamburger / X button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex-shrink-0"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block w-4.5 h-[2px] bg-slate-700 dark:bg-white rounded-full origin-center"
                style={{ width: '18px' }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block h-[2px] bg-slate-700 dark:bg-white rounded-full"
                style={{ width: '18px' }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-[2px] bg-slate-700 dark:bg-white rounded-full origin-center"
                style={{ width: '18px' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-[#0a0a0f] border-l border-slate-200 dark:border-white/10 flex flex-col sm:hidden shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 dark:border-white/[0.08]">
                <span className="font-display font-bold text-navy dark:text-white text-base">
                  Clear<span className="text-cyan-600 dark:text-accent">Voice</span> AI
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                >
                  ✕
                </button>
              </div>

              {/* Menu items */}
              <div className="flex-1 flex flex-col gap-3 px-5 pt-8">
                {user ? (
                  <>
                    {/* Logged in: user info */}
                    <motion.div custom={0} variants={menuItemVariants} initial="hidden" animate="visible" exit="exit"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] mb-2"
                    >
                      <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full ring-2 ring-accent/30" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy dark:text-white truncate">{user.displayName}</p>
                        <PlanBadge plan={usage.plan} used={usage.videosUsedThisMonth} />
                      </div>
                    </motion.div>

                    <motion.button custom={1} variants={menuItemVariants} initial="hidden" animate="visible" exit="exit"
                      onClick={handleMenuPricing}
                      className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      Pricing
                    </motion.button>

                    <motion.button custom={2} variants={menuItemVariants} initial="hidden" animate="visible" exit="exit"
                      onClick={handleMenuSignOut}
                      className="w-full py-3.5 rounded-2xl border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={15} /> Sign Out
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button custom={0} variants={menuItemVariants} initial="hidden" animate="visible" exit="exit"
                      onClick={handleMenuPricing}
                      className="w-full py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      Pricing
                    </motion.button>

                    <motion.button custom={1} variants={menuItemVariants} initial="hidden" animate="visible" exit="exit"
                      onClick={handleMenuSignIn}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Sign In with Google
                    </motion.button>
                  </>
                )}
              </div>

              {/* Bottom theme toggle */}
              <div className="px-5 pb-8 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </span>
                <div style={{ transform: 'scale(0.65)', transformOrigin: 'right center' }}>
                  <SkyToggle checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
