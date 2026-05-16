import { motion } from 'framer-motion';
import { Upload, Sparkles, Download, CheckCircle, Volume2, Video, Zap, FileAudio, Shield, Mic, Waves, Clock } from 'lucide-react';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function MarketingSections() {
  return (
    <div className="w-full flex flex-col gap-16 sm:gap-24 lg:gap-32 py-8 sm:py-10 relative z-10">
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="text-cyan-600 dark:text-accent" size={26} />,
      step: '01',
      title: 'Upload Your Video',
      desc: 'Drag and drop any MP4, MOV, or MKV video directly into your browser. No account needed to start.',
    },
    {
      icon: <Sparkles className="text-purple" size={26} />,
      step: '02',
      title: 'AI Cleans the Audio',
      desc: 'Demucs v4 separates your voice from all background noise — wind, traffic, hum, echo — with studio precision.',
    },
    {
      icon: <Download className="text-cyan-600 dark:text-accent" size={26} />,
      step: '03',
      title: 'Download Instantly',
      desc: 'Your cleaned video downloads automatically to your device. Crystal-clear audio, ready to publish.',
    },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
      aria-labelledby="how-it-works-heading"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 dark:text-accent uppercase mb-3">Simple Process</span>
        <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">
          How Background Noise Removal Works
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
          Three steps to professional audio. No software to install, no account required.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i} variants={fadeInUp}
            className="relative bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-300 shadow-sm"
          >
            <span className="absolute top-5 right-5 text-5xl font-black text-slate-100 dark:text-white/[0.04] select-none leading-none">{step.step}</span>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-5">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">{step.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FeaturesSection() {
  const smallCards = [
    { icon: <Video size={22} className="text-cyan-600 dark:text-accent" />, title: 'HD Video Export', desc: 'Original video quality preserved, only audio is improved.' },
    { icon: <Clock size={22} className="text-purple" />, title: 'Fast Processing', desc: 'GPU-accelerated when available. Most videos done in under 3 minutes.' },
    { icon: <Shield size={22} className="text-cyan-600 dark:text-accent" />, title: '100% Private', desc: 'Nothing is uploaded. All AI runs locally in your browser.' },
    { icon: <CheckCircle size={22} className="text-purple" />, title: 'No Software Needed', desc: 'Works in Chrome and Edge. No installs, no extensions.' },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
      aria-labelledby="features-heading"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 dark:text-accent uppercase mb-3">What It Does</span>
        <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">
          Powered by Demucs v4 Neural Network
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          The same AI voice separation model used by professional audio engineers — now free in your browser.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* Large card 1 */}
        <motion.div variants={fadeInUp} className="md:col-span-2 relative overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />
          <Volume2 className="text-cyan-600 dark:text-accent mb-5" size={26} />
          <h3 className="text-xl font-bold mb-2 text-navy dark:text-white">AI Noise Removal</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Demucs v4 separates human speech from background noise at the frequency level. Wind, traffic, AC hum, crowd chatter, electrical buzz — all removed while keeping your voice intact.
          </p>
        </motion.div>

        {/* Large card 2 */}
        <motion.div variants={fadeInUp} className="md:col-span-2 relative overflow-hidden bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm group">
          <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500 pointer-events-none" />
          <Zap className="text-purple mb-5" size={26} />
          <h3 className="text-xl font-bold mb-2 text-navy dark:text-white">Runs Entirely in Your Browser</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            No server uploads. The 120 MB AI model downloads once to your device and processes everything locally via WebAssembly and ONNX Runtime. Your footage stays private.
          </p>
        </motion.div>

        {/* Large card 3 — spans more */}
        <motion.div variants={fadeInUp} className="md:col-span-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm">
          <FileAudio className="text-cyan-600 dark:text-accent mb-5" size={26} />
          <h3 className="text-xl font-bold mb-2 text-navy dark:text-white">Voice Boost & Volume Balancing</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Beyond noise removal, ClearVoice can boost your voice presence by up to +12 dB and apply dynamic volume balancing — making quiet parts louder and loud parts softer, so every word is heard clearly.
          </p>
        </motion.div>

        {/* Small card */}
        <motion.div variants={fadeInUp} className="md:col-span-1 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <Mic className="text-purple mb-4" size={22} />
          <h3 className="text-base font-bold mb-1 text-navy dark:text-white">Tonal Hum Removal</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Specifically targets 50/60 Hz electrical hum, fan drone, and mechanical resonance — not just broadband noise.</p>
        </motion.div>

        {/* 4 small feature cards */}
        {smallCards.map((c, i) => (
          <motion.div key={i} variants={fadeInUp} className="md:col-span-1 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 shadow-sm">
            <div className="mb-3">{c.icon}</div>
            <h3 className="text-sm font-bold mb-1 text-navy dark:text-white">{c.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function UseCasesSection() {
  const cases = [
    { emoji: '🎙️', title: 'Podcasters', desc: 'Record anywhere — remove room echo and background hum before publishing.' },
    { emoji: '🎬', title: 'YouTubers & Vloggers', desc: 'Fix outdoor recordings ruined by wind, traffic, or crowd noise.' },
    { emoji: '💼', title: 'Business Professionals', desc: 'Clean up Zoom recordings, webinars, and presentation videos.' },
    { emoji: '🎓', title: 'Educators', desc: 'Make online course videos sound studio-quality without expensive gear.' },
    { emoji: '📱', title: 'Social Media Creators', desc: 'Reels, Shorts, TikToks — clear audio gets more views and saves.' },
    { emoji: '🎵', title: 'Musicians', desc: 'Remove ambient noise from rehearsal recordings and home demos.' },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
      aria-labelledby="use-cases-heading"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 dark:text-accent uppercase mb-3">Who Uses It</span>
        <h2 id="use-cases-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 text-navy dark:text-white">
          Built for Everyone Who Records Video
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
          Whether you're a creator, educator, or professional — clear audio makes everything better.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {cases.map((c, i) => (
          <motion.div
            key={i} variants={fadeInUp}
            className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 hover:border-cyan-400/40 dark:hover:border-accent/30 transition-colors shadow-sm"
          >
            <span className="text-2xl mb-3 block">{c.emoji}</span>
            <h3 className="font-bold text-sm text-navy dark:text-white mb-1">{c.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function TrustSection() {
  const stats = [
    { value: '120 MB', label: 'AI model, downloaded once' },
    { value: '0 bytes', label: 'of your data sent to servers' },
    { value: 'Demucs v4', label: 'by Meta AI Research' },
    { value: '< 3 min', label: 'average processing time' },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
    >
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-br from-cyan-500/5 to-violet-500/5 border border-cyan-500/20 dark:border-white/[0.08] rounded-3xl p-7 sm:p-12"
      >
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-navy dark:text-white mb-2">
            Privacy-first. No servers. No compromise.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            ClearVoice AI processes your video entirely on your device. The AI model runs in your browser using WebAssembly — your footage is never transmitted anywhere.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <div className="text-xl sm:text-2xl font-display font-black text-cyan-600 dark:text-accent mb-1">{s.value}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

function TestimonialsSection() {
  const reviews = [
    {
      name: 'Sarah J.',
      role: 'YouTube Creator',
      stars: 5,
      text: 'ClearVoice saved a sponsored video that had terrible construction noise in the background. It sounds like magic — the voice came through crystal clear.',
    },
    {
      name: 'Mark D.',
      role: 'Podcast Host',
      stars: 5,
      text: "I cancelled my expensive audio software subscription. This browser tool does a better job in a fraction of the time, and my files never leave my computer.",
    },
    {
      name: 'Elena R.',
      role: 'Documentary Filmmaker',
      stars: 5,
      text: "The fact that it processes locally without uploading my unreleased footage is a game-changer. Finally a tool I can trust with sensitive projects.",
    },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
      aria-labelledby="testimonials-heading"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-14">
        <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 dark:text-accent uppercase mb-3">Reviews</span>
        <h2 id="testimonials-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 text-navy dark:text-white">
          Loved by Creators Worldwide
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
          Join thousands of professionals who upgraded their audio quality with ClearVoice AI.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={i} variants={fadeInUp}
            className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm"
            itemScope itemType="https://schema.org/Review"
          >
            <div>
              <div className="flex gap-0.5 mb-4" aria-label={`${r.stars} out of 5 stars`}>
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5 italic" itemProp="reviewBody">"{r.text}"</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {r.name[0]}
              </div>
              <div>
                <div className="font-semibold text-sm text-navy dark:text-white" itemProp="author">{r.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{r.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: 'Is my video safe? Does it get uploaded anywhere?',
      a: 'No. ClearVoice AI processes everything directly in your browser. Your video file never leaves your device and is never uploaded to any server. All AI computation happens locally using WebAssembly.',
    },
    {
      q: 'What types of background noise can it remove?',
      a: 'ClearVoice AI removes wind noise, traffic, HVAC/fan hum, crowd chatter, room echo, reverb, electrical hum (50/60 Hz), and mechanical drones. It uses Demucs v4 for voice separation followed by a Wiener filter for residual noise cleanup.',
    },
    {
      q: 'What video and audio formats are supported?',
      a: 'MP4 is fully supported on all plans. Paid plans (Creator and Pro) also support MOV, MKV, WebM, MP3, and WAV export.',
    },
    {
      q: 'How long does it take to process a video?',
      a: 'A 1–5 minute video typically processes in 1–3 minutes. If your device has a compatible GPU, WebGPU acceleration is used automatically and processing is significantly faster.',
    },
    {
      q: 'Does it work on mobile phones?',
      a: 'Yes. ClearVoice AI works on modern Android and iOS browsers including Chrome and Edge. Processing on mobile may be slower than desktop due to hardware differences, but it works.',
    },
    {
      q: 'What AI model powers ClearVoice AI?',
      a: 'ClearVoice AI uses Demucs v4 (htdemucs), a hybrid transformer model developed by Meta AI Research, running locally via ONNX Runtime Web. A secondary Wiener filter cleans up any residual noise after voice separation.',
    },
    {
      q: 'Will it remove my voice along with the noise?',
      a: 'No. The AI specifically identifies and preserves human speech while separating background noise. Voice harmonics in the 80–600 Hz range are handled with conservative suppression so your voice stays natural.',
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes. The free plan lets you process 1 video per month with no credit card required. Paid plans start at ₹49/month for 15 videos.',
    },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className="max-w-3xl mx-auto px-4 sm:px-6 w-full mb-12 sm:mb-20"
      aria-labelledby="faq-heading"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12">
        <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 dark:text-accent uppercase mb-3">FAQ</span>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-navy dark:text-white">
          Frequently Asked Questions
        </h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </motion.section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl overflow-hidden shadow-sm"
      itemScope itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 text-left flex justify-between items-center gap-3 font-semibold text-sm sm:text-base text-navy dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
        itemProp="name"
      >
        <span>{question}</span>
        <span className={`flex-shrink-0 w-5 h-5 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
        itemScope itemType="https://schema.org/Answer"
      >
        <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed" itemProp="text">{answer}</p>
      </motion.div>
    </div>
  );
}
