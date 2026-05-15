import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, ArrowLeft, Zap, Shield, ArrowRight } from 'lucide-react';

const PLANS_DATA = [
  {
    id: 'free',
    label: 'Free',
    price: '0',
    description: 'Test the power of AI audio cleaning.',
    icon: <Sparkles size={18} />,
    bgImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=700&q=80',
    accentFrom: '#94a3b8',
    accentTo: '#64748b',
    features: [
      { name: '1 video / month',       included: true  },
      { name: 'Basic preview only',    included: true  },
      { name: 'Watermarked preview',   included: true  },
      { name: 'Export enabled',        included: false },
      { name: 'Voice boost',           included: false },
      { name: 'Volume balance',        included: false },
    ],
    ctaLabel: 'Try Free',
    highlighted: false,
  },
  {
    id: 'starter',
    label: 'Starter',
    price: '49',
    description: 'For casual creators who mean business.',
    icon: <Zap size={18} />,
    bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
    accentFrom: '#3b82f6',
    accentTo: '#06b6d4',
    features: [
      { name: '15 videos / month',  included: true },
      { name: 'Export enabled',     included: true },
      { name: '720p export',        included: true },
      { name: 'MP4 export only',    included: true },
      { name: 'Fast processing',    included: true },
      { name: 'Voice boost',        included: false },
    ],
    ctaLabel: 'Get Starter',
    highlighted: false,
  },
  {
    id: 'creator',
    label: 'Creator',
    price: '99',
    description: 'Full-power AI tools for daily workflows.',
    icon: <Sparkles size={18} />,
    bgImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=700&q=80',
    accentFrom: '#00d4ff',
    accentTo: '#7c3aed',
    features: [
      { name: '40 videos / month',       included: true },
      { name: '1080p export',            included: true },
      { name: 'Voice boost',             included: true },
      { name: 'Volume balancing',        included: true },
      { name: 'MP4, MOV, MKV export',   included: true },
      { name: 'Faster AI processing',    included: true },
    ],
    ctaLabel: 'Get Creator',
    highlighted: true,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '199',
    description: 'Uncapped power for professionals.',
    icon: <Shield size={18} />,
    bgImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=700&q=80',
    accentFrom: '#7c3aed',
    accentTo: '#ec4899',
    features: [
      { name: 'Unlimited videos',        included: true },
      { name: 'Original quality export', included: true },
      { name: 'All formats supported',   included: true },
      { name: 'Voice boost',             included: true },
      { name: 'Volume balancing',        included: true },
      { name: 'Priority AI servers',     included: true },
      { name: 'Ultra-fast rendering',    included: true },
      { name: 'Advanced enhancement',    included: true },
    ],
    ctaLabel: 'Go Pro',
    highlighted: false,
  },
];

export default function PricingPage({ currentPlan, user, onSignIn, onUpgrade }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#050816] overflow-hidden">

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-accent/[0.07] dark:bg-[#00d4ff]/6 blur-[140px] animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[700px] rounded-full bg-purple/[0.06] dark:bg-[#7c3aed]/8 blur-[160px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[400px] rounded-full bg-accent/[0.05] dark:bg-cyan-500/6 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white text-sm font-medium mb-6 sm:mb-10 transition-colors duration-200 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to App
          </button>

          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-[0.15em] uppercase backdrop-blur-md shadow-sm">
              <Sparkles size={12} className="text-accent" />
              Transparent Pricing
            </div>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-[3.75rem] text-navy dark:text-white leading-tight tracking-tight mb-4 sm:mb-5">
            Simple Pricing For{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#38bdf8] to-[#7c3aed]">
              Powerful Audio Cleanup
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl max-w-xl mx-auto font-medium leading-relaxed">
            Choose the perfect plan for your content workflow.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-start">
          {PLANS_DATA.map((plan, idx) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlan === plan.id}
              user={user}
              onSignIn={onSignIn}
              onUpgrade={onUpgrade}
              delay={idx * 120}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-500 dark:text-slate-600 text-sm mt-14">
          All plans include end-to-end encryption · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PlanCard — DestinationCard visual treatment
───────────────────────────────────────────────────────────── */
function PlanCard({ plan, isCurrentPlan, user, onSignIn, onUpgrade, delay }) {
  function handleCTA() {
    if (plan.id === 'free') {
      window.location.href = '/';
      return;
    }
    if (!user) {
      onSignIn();
      return;
    }
    onUpgrade(plan.id);
  }

  const ctaLabel = isCurrentPlan ? 'Current Plan' : plan.ctaLabel;

  return (
    <div
      className="pricing-fade-in group relative w-full rounded-[22px] overflow-hidden
                 transition-all duration-500 ease-in-out
                 hover:scale-[1.03] hover:-translate-y-2"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: `0 0 40px -15px ${plan.accentFrom}55`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 70px -8px ${plan.accentFrom}99`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 40px -15px ${plan.accentFrom}55`; }}
    >
      {/* Background Image — parallax zoom on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{ backgroundImage: `url(${plan.bgImage})` }}
      />

      {/* Dark base layer so content is always legible */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Colored gradient overlay — bottom-heavy for text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top,
            ${plan.accentFrom}ee 0%,
            ${plan.accentFrom}99 35%,
            ${plan.accentFrom}44 60%,
            transparent 100%)`,
        }}
      />

      {/* Most Popular badge */}
      {plan.highlighted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-[10px] font-extrabold tracking-[0.18em] uppercase shadow-lg shadow-cyan-500/40">
            <Sparkles size={10} />
            Most Popular
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col h-full p-6 text-white">

        {/* Plan icon + name */}
        <div className={`flex items-center gap-3 ${plan.highlighted ? 'mt-8' : 'mt-0'} mb-5`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/20 flex-shrink-0">
            <span className="text-white">{plan.icon}</span>
          </div>
          <h3 className="font-display font-bold text-base tracking-wide uppercase text-white">
            {plan.label}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-2">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
            ₹{plan.price}
          </span>
          {plan.price !== '0' && (
            <span className="text-white/70 text-sm font-medium ml-1">/ month</span>
          )}
        </div>

        <p className="text-sm text-white/80 leading-relaxed mb-5 min-h-[40px]">
          {plan.description}
        </p>

        <div className="h-px bg-white/20 mb-5" />

        {/* Feature list */}
        <ul className="flex-1 space-y-2.5 mb-6">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              {f.included ? (
                <span className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full bg-green-400/30 border border-green-400/40 flex items-center justify-center">
                  <Check size={11} strokeWidth={3} className="text-green-300" />
                </span>
              ) : (
                <span className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center">
                  <X size={10} strokeWidth={2.5} className="text-white/40" />
                </span>
              )}
              <span className={`leading-snug font-medium ${
                f.included ? 'text-white' : 'text-white/40 line-through decoration-white/30'
              }`}>
                {f.name}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA — "Explore Now" bar style */}
        <button
          onClick={handleCTA}
          disabled={isCurrentPlan}
          className="w-full flex items-center justify-between
                     bg-white/15 backdrop-blur-md border border-white/25
                     rounded-xl px-4 py-3.5
                     transition-all duration-300
                     hover:bg-white/25 hover:border-white/40
                     disabled:opacity-40 disabled:cursor-default"
        >
          <span className="text-sm font-bold text-white tracking-wide">{ctaLabel}</span>
          <ArrowRight className="h-4 w-4 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
