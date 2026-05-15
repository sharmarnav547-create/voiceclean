import { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchFile } from '@ffmpeg/util';
import { motion } from 'framer-motion';

import Header from './components/Header';
import UploadZone from './components/UploadZone';
import VideoPreview from './components/VideoPreview';
import ProcessingPanel from './components/ProcessingPanel';
import WaveformViewer from './components/WaveformViewer';
import ResultPanel from './components/ResultPanel';
import ExportPanel from './components/ExportPanel';
import StatusBar from './components/StatusBar';
import AuthModal from './components/AuthModal';
import PricingPage from './components/PricingPage';
import UpgradePrompt from './components/UpgradePrompt';
import PaymentModal from './components/PaymentModal';
import StaffModal from './components/StaffModal';
import MarketingSections from './components/MarketingSections';
import Footer from './components/Footer';
import CustomAuthDemo from './components/ui/demo';
import { CreativePricingDemo } from './components/ui/creative-pricing-demo';

import { useAuth } from './hooks/useAuth';
import { useUsage } from './hooks/useUsage';
import { useFFmpeg } from './hooks/useFFmpeg';
import { useAudioProcessor } from './hooks/useAudioProcessor';
import { buildFinalAudioFilters, estimateNoiseReduction, decodeAudioFromBlob } from './utils/audioUtils';
import { FORMATS, QUALITY } from './utils/formatUtils';
import { canProcess } from './utils/planUtils';

const DEFAULT_SETTINGS = {
  noiseStrength: 'medium',
  enhanceSpeech: true,
  boostVoice: false,
  boostDb: 6,
  balanceVolume: true,
  balanceStrength: 'normal',
};

const STAGES = [
  'Load Engine',
  'Extract Audio',
  'Separating Voice',
  'Cleaning Audio',
  'Applying Settings',
  'Rebuild Video',
];

function MainApp({ user, usage, onSignIn }) {
  const ffmpeg = useFFmpeg();
  const { hasGPU, modelDownload, processAudio, TOTAL_MB } = useAudioProcessor();
  const processingPanelRef = useRef(null);
  const waveformRef = useRef(null);
  const exportRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [cleanedUrl, setCleanedUrl] = useState('');
  const [originalAudioBlob, setOriginalAudioBlob] = useState(null);
  const [cleanedAudioBlob, setCleanedAudioBlob] = useState(null);
  const [noisePercent, setNoisePercent] = useState(null);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState([]);

  const [statusMsg, setStatusMsg] = useState('');
  const [statusKind, setStatusKind] = useState('idle');
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [payPlan, setPayPlan] = useState(null);

  const userCanProcess = canProcess(usage.plan, usage.videosUsedThisMonth);

  function setStatus(kind, msg) { setStatusKind(kind); setStatusMsg(msg); }
  function addLog(msg) { setLogs((prev) => [...prev, msg]); }

  function handleFileSelected(file, url) {
    setVideoFile(file);
    setOriginalUrl(url);
    setCleanedUrl('');
    setCleanedAudioBlob(null);
    setOriginalAudioBlob(null);
    setNoisePercent(null);
    setDone(false);
    setProgress(0);
    setLogs([]);
    setTimeout(() => processingPanelRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  }

  async function handleProcess() {
    if (!videoFile) return;

    setProcessing(true);
    setDone(false);
    setProgress(0);
    setLogs([]);

    try {
      // Stage 0: Load FFmpeg engine
      setCurrentStage(0);
      setStatus('processing', 'Loading FFmpeg engine…');
      await ffmpeg.load();
      setProgress(8);

      // Stage 1: Extract raw audio as WAV
      setCurrentStage(1);
      setStatus('processing', 'Extracting audio…');
      const inputData = await fetchFile(videoFile);
      await ffmpeg.writeFile('input.mp4', inputData);
      await ffmpeg.run(['-i', 'input.mp4', '-vn', '-ar', '44100', '-ac', '2', 'raw_audio.wav'], addLog);
      const rawWav = await ffmpeg.readFile('raw_audio.wav');
      const rawBlob = new Blob([rawWav], { type: 'audio/wav' });
      setOriginalAudioBlob(rawBlob);
      setProgress(18);

      // Stage 2–3: AI processing in Web Worker (Demucs + DeepFilterNet3)
      setCurrentStage(2);
      setStatus('processing', 'Separating voice from noise…');

      const cleanedBlob = await processAudio(rawBlob, (pct, stage) => {
        if (pct <= 70) {
          setCurrentStage(2);
        } else {
          setCurrentStage(3);
        }
        setProgress(18 + Math.round(pct * 0.55)); // 18% → 73%
        if (stage) setStatus('processing', stage);
      });
      setProgress(73);

      // Stage 4: FFmpeg final cleanup — afftdn + highpass + lowpass + optional boost/balance
      setCurrentStage(4);
      setStatus('processing', 'Final audio polish…');
      const cleanedWavData = new Uint8Array(await cleanedBlob.arrayBuffer());
      await ffmpeg.writeFile('ai_cleaned.wav', cleanedWavData);

      // buildFinalAudioFilters always returns filters (afftdn is always included)
      const boostArgs = buildFinalAudioFilters(
        settings.boostVoice ? settings.boostDb : 0,
        settings.balanceVolume,
        settings.balanceStrength
      );
      await ffmpeg.run(['-i', 'ai_cleaned.wav', ...boostArgs, 'boosted.wav'], addLog);
      const finalWavFile = 'boosted.wav';

      const finalWav = await ffmpeg.readFile(finalWavFile);
      const finalBlob = new Blob([finalWav], { type: 'audio/wav' });
      setCleanedAudioBlob(finalBlob);

      // Estimate noise reduction for waveform viewer
      const origFloat = await decodeAudioFromBlob(rawBlob);
      const cleanFloat = await decodeAudioFromBlob(finalBlob);
      setNoisePercent(estimateNoiseReduction(origFloat, cleanFloat));
      setProgress(82);

      // Stage 5: Merge clean audio back into original video
      setCurrentStage(5);
      setStatus('processing', 'Rebuilding video…');
      await ffmpeg.run(
        ['-i', 'input.mp4', '-i', finalWavFile, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-map', '0:v:0', '-map', '1:a:0', 'output.mp4'],
        addLog
      );
      const outputData = await ffmpeg.readFile('output.mp4');
      const outputBlob = new Blob([outputData], { type: 'video/mp4' });
      if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
      setCleanedUrl(URL.createObjectURL(outputBlob));
      setProgress(100);
      setCurrentStage(STAGES.length);
      setDone(true);
      setStatus('done', 'Noise removed! Download your video below.');
      await usage.incrementUsage();

      for (const f of ['input.mp4', 'raw_audio.wav', 'ai_cleaned.wav', 'boosted.wav', 'output.mp4']) {
        await ffmpeg.deleteFile(f).catch(() => {});
      }

      setTimeout(() => waveformRef.current?.scrollIntoView({ behavior: 'smooth' }), 400);
      setTimeout(() => exportRef.current?.scrollIntoView({ behavior: 'smooth' }), 1400);

    } catch (err) {
      console.error(err);
      setStatus('error', `Something went wrong: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleExport({ format, quality, filename }) {
    const fmtInfo = FORMATS[format];
    const qualInfo = QUALITY[quality];
    if (!cleanedUrl) return;

    try {
      setStatus('processing', `Exporting as ${fmtInfo.label}…`);
      const response = await fetch(cleanedUrl);
      const cleanedData = new Uint8Array(await response.arrayBuffer());
      await ffmpeg.writeFile('cleaned.mp4', cleanedData);

      const outFile = `${filename}.${fmtInfo.ext}`;
      await ffmpeg.run(['-i', 'cleaned.mp4', ...fmtInfo.flags, ...qualInfo.flags, outFile], addLog);
      const outData = await ffmpeg.readFile(outFile);

      const mimeMap = { mp3: 'audio/mpeg', wav: 'audio/wav', webm: 'video/webm' };
      const blob = new Blob([outData], { type: mimeMap[fmtInfo.ext] || 'video/mp4' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = outFile;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);

      await ffmpeg.deleteFile('cleaned.mp4').catch(() => {});
      await ffmpeg.deleteFile(outFile).catch(() => {});
      setStatus('done', 'Export complete!');
    } catch (err) {
      setStatus('error', `Export failed: ${err.message}`);
    }
  }

  return (
    <div className="w-full relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple/10 blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.02]" />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-20 pb-10 space-y-8 sm:space-y-12 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-4 sm:space-y-6 py-4 sm:py-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-cyan-600 dark:text-accent text-xs sm:text-sm font-medium mb-2 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            AI Audio Engine v4.0 Active
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-navy dark:text-white leading-tight tracking-tight">
            Remove background noise.<br />
            <span className="text-gradient">Enhance voice clarity.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Upload any video and instantly get studio-quality audio. Our AI separates voices from wind, traffic, and echo—directly in your browser.
          </p>
        </motion.div>

      {typeof SharedArrayBuffer === 'undefined' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/40 rounded-2xl p-5 text-red-700 dark:text-red-400 text-sm">
          <strong>Browser not supported:</strong> This app requires SharedArrayBuffer, available in Chrome and Edge.
        </div>
      )}

      <UploadZone onFileSelected={handleFileSelected} />

      {originalUrl && <VideoPreview originalUrl={originalUrl} cleanedUrl={cleanedUrl} userPlan={usage.plan} />}

      {videoFile && (
        <div ref={processingPanelRef}>
          <ProcessingPanel
            hasFile={!!videoFile}
            userPlan={usage.plan}
            canProcess={userCanProcess}
            processing={processing}
            done={done}
            progress={progress}
            currentStage={currentStage}
            stages={STAGES}
            logs={logs}
            onProcess={handleProcess}
            onUpgradePrompt={(f) => setUpgradeFeature(f)}
            settings={settings}
            onSettingsChange={setSettings}
            hasGPU={hasGPU}
            modelDownload={modelDownload}
            totalModelMB={TOTAL_MB}
          />
        </div>
      )}

      {originalAudioBlob && (
        <div ref={waveformRef}>
          <WaveformViewer
            originalBlob={originalAudioBlob}
            cleanedBlob={cleanedAudioBlob}
            noisePercent={noisePercent ?? 0}
          />
        </div>
      )}

      {done && <ResultPanel hasGPU={hasGPU} />}

      {done && (
        <div ref={exportRef}>
          <ExportPanel
            cleanedBlob={cleanedUrl ? true : null}
            originalName={videoFile?.name}
            userPlan={usage.plan}
            onExport={handleExport}
            onUpgradePrompt={(f) => setUpgradeFeature(f)}
          />
        </div>
      )}

      <StatusBar status={statusKind} message={statusMsg} onDismiss={() => setStatus('idle', '')} />

      {upgradeFeature && <UpgradePrompt feature={upgradeFeature} onClose={() => setUpgradeFeature(null)} />}
      {payPlan && (
        <PaymentModal
          planId={payPlan}
          user={user}
          onClose={() => setPayPlan(null)}
        />
      )}
      </div>

      {!videoFile && <MarketingSections />}
    </div>
  );
}

export default function App() {
  const { user, loading, signInWithGoogle, renderGISButton, signOut } = useAuth();
  const usage = useUsage(user);
  const [showAuthModal, setShowAuthModal]   = useState(false);
  const [payPlan, setPayPlan]               = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);

  function handleSignIn() { return signInWithGoogle(); }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 dark:border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} usage={usage} onSignIn={() => setShowAuthModal(true)} onSignOut={signOut} onStaffAccess={() => setShowStaffModal(true)} />
      <Routes>
        <Route path="/" element={<MainApp user={user} usage={usage} onSignIn={handleSignIn} />} />
        <Route path="/signup" element={<CustomAuthDemo />} />
        <Route path="/creative-pricing" element={<CreativePricingDemo />} />
        <Route
          path="/pricing"
          element={
            <PricingPage
              currentPlan={usage.plan}
              user={user}
              onSignIn={handleSignIn}
              onUpgrade={(planId) => setPayPlan(planId)}
            />
          }
        />
      </Routes>

      {showAuthModal && (
        <AuthModal
          user={user}
          onSignIn={handleSignIn}
          onRenderGISButton={renderGISButton}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      {payPlan && (
        <PaymentModal
          planId={payPlan}
          user={user}
          onClose={() => setPayPlan(null)}
        />
      )}
      {showStaffModal && <StaffModal onClose={() => setShowStaffModal(false)} />}
      <Footer />
    </div>
  );
}
