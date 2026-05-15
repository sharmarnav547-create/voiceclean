import { PLANS } from '../utils/planUtils';
import { TEST_MODE } from '../config';

export default function PlanBadge({ plan = 'free', used = 0 }) {
  if (TEST_MODE) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-100 dark:bg-yellow-900/30 border-amber-400 dark:border-yellow-600/40 text-amber-800 dark:text-yellow-400">
        🧪 TEST MODE — All Features Unlocked
      </span>
    );
  }

  const planInfo = PLANS[plan] || PLANS.free;
  const limit = planInfo.videosPerMonth;
  const remaining = Math.max(0, limit - used);

  const colors = {
    free:   'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600',
    plus:   'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/40',
    pro:    'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700/40',
  };

  return (
    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[plan] || colors.free}`}>
      {planInfo.label} · {remaining}/{limit} left
    </span>
  );
}
