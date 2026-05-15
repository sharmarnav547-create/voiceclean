import { useState, useRef } from 'react';
import { X, QrCode, Upload, Check, Phone, AlertCircle } from 'lucide-react';
import { PLANS } from '../utils/planUtils';
import { UPI_QR_URL, UPI_ID } from '../config';
import { submitPaymentRequest } from '../utils/staffUtils';

export default function PaymentModal({ planId, onClose, user }) {
  const [step, setStep]           = useState('qr'); // qr | upload | done
  const [phone, setPhone]         = useState('');
  const [receiptFile, setFile]    = useState(null);
  const [preview, setPreview]     = useState('');
  const [busy, setBusy]           = useState(false);
  const [err, setErr]             = useState('');
  const fileRef = useRef(null);

  const plan = PLANS[planId];
  if (!plan) return null;

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) { setErr('Please select an image file.'); return; }
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setErr('');
  }

  async function handleSubmit() {
    setErr('');
    if (!receiptFile) { setErr('Please upload your payment receipt.'); return; }
    if (phone.replace(/\D/g, '').length !== 10) { setErr('Enter a valid 10-digit Indian mobile number.'); return; }
    setBusy(true);
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 30000)
      );
      await Promise.race([
        submitPaymentRequest({
          userId:    user?.uid   || 'guest',
          userEmail: user?.email || '',
          userPhone: `+91${phone.replace(/\D/g, '')}`,
          planId,
          planLabel: plan.label,
          amount:    plan.price,
          receiptFile,
        }),
        timeout,
      ]);
      setStep('done');
    } catch (e) {
      console.error(e);
      if (e.message === 'timeout') {
        setErr('Upload timed out. This is usually a Firebase Storage permissions issue — check your Storage rules in the Firebase console.');
      } else if (e.code === 'storage/unauthorized') {
        setErr('Firebase Storage is blocking the upload. Set Storage rules to allow writes in the Firebase console.');
      } else {
        setErr(`Submission failed: ${e.message || 'Check your connection and try again.'}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-white text-lg">
            {step === 'qr'     && `Upgrade to ${plan.label}`}
            {step === 'upload' && 'Upload Receipt'}
            {step === 'done'   && 'Request Submitted'}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* ── Step 1: QR Code ── */}
        {step === 'qr' && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1">Pay via UPI</p>
              <div className="text-3xl font-extrabold text-accent">
                ₹{plan.price}
                <span className="text-slate-500 text-base font-normal ml-1">/month</span>
              </div>
            </div>

            <div className="flex justify-center">
              {UPI_QR_URL ? (
                <img
                  src={UPI_QR_URL}
                  alt="UPI QR Code"
                  className="w-48 h-48 rounded-xl border border-white/10 object-contain bg-white p-1"
                />
              ) : (
                <div className="w-48 h-48 rounded-xl border-2 border-dashed border-white/20 bg-white/[0.03] flex flex-col items-center justify-center gap-2 text-slate-500">
                  <QrCode size={48} />
                  <p className="text-xs text-center px-4 leading-relaxed">Add your UPI QR URL in <code className="font-mono text-accent">config.js</code></p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-0.5">UPI ID</p>
              <p className="text-sm font-mono text-accent font-semibold">{UPI_ID}</p>
            </div>

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Scan the QR code or copy the UPI ID to pay <strong className="text-white">₹{plan.price}</strong>. After payment, click below to submit your receipt.
            </p>

            <button
              onClick={() => setStep('upload')}
              className="w-full py-3 rounded-xl bg-accent text-[#0a0a0f] font-bold text-sm hover:bg-accent/90 transition"
            >
              I Have Paid →
            </button>
          </div>
        )}

        {/* ── Step 2: Upload Receipt ── */}
        {step === 'upload' && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload your payment screenshot and enter your mobile number so our team can verify and activate your plan.
            </p>

            {/* Receipt drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 rounded-xl border-2 border-dashed border-white/15 hover:border-accent/40 bg-white/[0.03] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="Receipt preview" className="h-full w-full object-contain p-1" />
              ) : (
                <>
                  <Upload size={24} className="text-slate-500 group-hover:text-accent transition-colors" />
                  <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Click to upload receipt screenshot</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />

            {/* Phone number */}
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30 transition">
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5 flex-shrink-0">
                <Phone size={14} /> +91
              </span>
              <div className="w-px h-4 bg-white/15" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
              />
            </div>

            {err && (
              <div className="flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                {err}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep('qr')}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={busy}
                className="flex-1 py-2.5 rounded-xl bg-accent text-[#0a0a0f] font-bold text-sm hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 'done' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto">
              <Check size={32} className="text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-2">Request Submitted!</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our team will verify your payment and activate your <strong className="text-white">{plan.label}</strong> plan within 24 hours.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
