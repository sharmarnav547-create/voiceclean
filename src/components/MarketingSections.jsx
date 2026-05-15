import { motion } from 'framer-motion';
import { Upload, Sparkles, Download, CheckCircle, Volume2, Video, Zap, FileAudio, Play } from 'lucide-react';
import { useState } from 'react';

// Common animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function MarketingSections() {
  return (
    <div className="w-full flex flex-col gap-16 sm:gap-24 lg:gap-32 py-8 sm:py-10 relative z-10">
      <HowItWorksSection />
      <FeaturesSection />
      <VideoShowcaseSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="text-cyan-600 dark:text-accent" size={28} />,
      title: "1. Upload Your Video",
      desc: "Drag and drop any MP4 video directly into your browser. No software installation needed."
    },
    {
      icon: <Sparkles className="text-purple" size={28} />,
      title: "2. AI Cleans the Audio",
      desc: "Our neural network separates human voices from background noise with studio-level precision."
    },
    {
      icon: <Download className="text-cyan-600 dark:text-accent" size={28} />,
      title: "3. Download & Share",
      desc: "Export your crystal-clear video instantly in high quality, ready for your audience."
    }
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">How It Works</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">Three simple steps to professional-grade audio.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i} variants={fadeInUp}
            className="glass-card rounded-2xl p-5 sm:p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {step.icon}
            </div>
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{step.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FeaturesSection() {
  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">Powered by Advanced AI</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">Everything you need to create perfect audio for your videos, all in one place.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-5 sm:p-8 md:col-span-2 sm:col-span-2 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all duration-500"></div>
          <Volume2 className="text-cyan-600 dark:text-accent mb-4 sm:mb-6" size={28} />
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-navy dark:text-white">AI Noise Removal</h3>
          <p className="text-slate-600 dark:text-slate-400">Our deep learning model isolates speech and removes wind, traffic, hums, and crowd noise instantly.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-5 sm:p-8 md:col-span-2 sm:col-span-2 relative overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple/20 rounded-full blur-3xl group-hover:bg-purple/30 transition-all duration-500"></div>
          <Zap className="text-purple mb-4 sm:mb-6" size={28} />
          <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-navy dark:text-white">Browser-based Processing</h3>
          <p className="text-slate-600 dark:text-slate-400">Everything runs locally in your browser. No server uploads means absolute privacy and blazing fast speeds.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-5 sm:p-8 md:col-span-1">
          <Video className="text-cyan-600 dark:text-accent mb-4" size={28} />
          <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">HD Export</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Maintains original video quality while upgrading audio.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-5 sm:p-8 md:col-span-2 sm:col-span-2 bg-gradient-to-br from-bg-light to-slate-200 dark:from-bg-dark dark:to-slate-900 border-accent/20">
          <FileAudio className="text-cyan-600 dark:text-accent mb-4" size={28} />
          <h3 className="text-xl font-bold mb-2 text-navy dark:text-white">Studio Voice Enhancement</h3>
          <p className="text-slate-600 dark:text-slate-400">Adds presence, EQ, and subtle compression to make voices sound like they were recorded in a professional studio.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-5 sm:p-8 md:col-span-1">
          <CheckCircle className="text-purple mb-4" size={28} />
          <h3 className="text-lg font-bold mb-2 text-navy dark:text-white">One-Click Fix</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">No complex audio engineering needed. Just upload and done.</p>
        </motion.div>
      </div>
    </motion.section>
  );
}

function VideoShowcaseSection() {
  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">Hear The Difference</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">See how ClearVoice AI rescues bad audio.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <motion.div variants={fadeInUp} className="glass-card rounded-3xl overflow-hidden flex flex-col group cursor-pointer">
          <div className="h-36 sm:h-48 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
             <Play className="text-white z-20 opacity-80 group-hover:scale-110 transition-transform" size={40} />
             <div className="absolute bottom-3 left-3 z-20 text-white text-sm font-medium">Outdoor Vlog</div>
             <div className="absolute bottom-3 right-3 z-20 flex gap-2">
                <span className="text-[10px] uppercase font-bold bg-red-500/80 px-2 py-1 rounded">Wind Noise</span>
             </div>
          </div>
          <div className="p-4 sm:p-6">
            <h4 className="font-bold mb-2 text-navy dark:text-white">Vlog Wind Reduction</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Completely removed strong wind gusts from a beach vlog while preserving the speaker's natural tone.</p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-3xl overflow-hidden flex flex-col group cursor-pointer">
          <div className="h-36 sm:h-48 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
             <Play className="text-white z-20 opacity-80 group-hover:scale-110 transition-transform" size={40} />
             <div className="absolute bottom-3 left-3 z-20 text-white text-sm font-medium">Podcast Interview</div>
             <div className="absolute bottom-3 right-3 z-20 flex gap-2">
                <span className="text-[10px] uppercase font-bold bg-orange-500/80 px-2 py-1 rounded">Room Echo</span>
             </div>
          </div>
          <div className="p-4 sm:p-6">
            <h4 className="font-bold mb-2 text-navy dark:text-white">Echo & Reverb Cleanup</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Eliminated severe room reflection from an untreated office, making it sound like a treated studio.</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function TestimonialsSection() {
  const reviews = [
    { name: "Sarah J.", role: "Content Creator", text: "ClearVoice saved a sponsored video that had terrible background construction noise. It literally sounds like magic." },
    { name: "Mark D.", role: "Podcaster", text: "I've cancelled my expensive audio software subscriptions. This browser tool does a better job in half the time." },
    { name: "Elena R.", role: "Filmmaker", text: "The fact that it processes locally in my browser without uploading my unreleased footage to a server is a game-changer." }
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full"
    >
      <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">Loved by Creators</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">Join thousands of professionals upgrading their audio.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {reviews.map((r, i) => (
          <motion.div key={i} variants={fadeInUp} className="glass-card p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple flex items-center justify-center text-white font-bold">
                {r.name[0]}
              </div>
              <div>
                <div className="font-bold text-sm text-navy dark:text-white">{r.name}</div>
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
    { q: "Is my data secure?", a: "Yes. All AI processing happens directly within your browser. Your files are never uploaded to any external server." },
    { q: "What formats do you support?", a: "Currently, we support MP4 files. The tool extracts the audio, cleans it, and losslessly merges it back into your original video." },
    { q: "Is it really free?", a: "We offer a generous free tier for standard users. Professionals needing higher limits can upgrade to our Pro or Studio plans." },
    { q: "How long does it take?", a: "Processing speed depends on your device's hardware. On a modern laptop, a 1-minute video typically takes 10-20 seconds to process." }
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-3xl mx-auto px-4 sm:px-6 w-full mb-12 sm:mb-20"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-3 sm:mb-4 text-navy dark:text-white">Frequently Asked Questions</h2>
      </motion.div>

      <div className="space-y-4">
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
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left flex justify-between items-center font-semibold text-navy dark:text-white"
      >
        {question}
        <span className={`transform transition-transform text-slate-500 dark:text-slate-400 ${open ? 'rotate-180' : ''}`}>↓</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-slate-600 dark:text-slate-400">{answer}</p>
      </motion.div>
    </div>
  );
}
