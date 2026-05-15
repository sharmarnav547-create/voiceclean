import { useState, useEffect, useCallback } from 'react';
import { X, Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Clock, Phone, Calendar, LogOut, ShieldCheck } from 'lucide-react';
import { verifyStaffPassword, isStaffLoggedIn, staffLogout, getAllRequests, approveRequest, rejectRequest } from '../utils/staffUtils';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'  },
  approved: { label: 'Approved', color: 'bg-green-500/15 text-green-400 border-green-500/30'    },
  rejected: { label: 'Rejected', color: 'bg-red-500/15 text-red-400 border-red-500/30'          },
};

function fmt(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function StaffModal({ onClose }) {
  const [authed, setAuthed] = useState(isStaffLoggedIn);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-3 py-4">
      {authed
        ? <Dashboard onClose={onClose} onLogout={() => { staffLogout(); setAuthed(false); }} />
        : <PasswordPrompt onSuccess={() => setAuthed(true)} onClose={onClose} />
      }
    </div>
  );
}

/* ─── Password prompt ─────────────────────────────────────────── */
function PasswordPrompt({ onSuccess, onClose }) {
  const [pw, setPw]       = useState('');
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const ok = await verifyStaffPassword(pw).catch(() => false);
    setBusy(false);
    if (ok) onSuccess();
    else setErr('Incorrect password. Try again.');
  }

  return (
    <div className="w-full max-w-sm bg-[#0f1117] border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-accent" />
          <h2 className="font-display font-bold text-white text-lg">Staff Access</h2>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
      </div>

      <p className="text-slate-400 text-sm mb-6">Enter your staff password to access the dashboard.</p>

      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Staff password"
            autoFocus
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 text-sm outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition"
          />
          <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {err && <p className="text-red-400 text-xs">{err}</p>}

        <button
          type="submit"
          disabled={busy || !pw}
          className="w-full py-3 rounded-xl bg-accent text-[#0a0a0f] font-bold text-sm hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? 'Verifying…' : 'Enter Dashboard'}
        </button>
      </form>
    </div>
  );
}

/* ─── Staff dashboard ─────────────────────────────────────────── */
function Dashboard({ onClose, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [preview, setPreview]   = useState(null); // receipt image preview

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllRequests().catch(() => []);
    setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const counts   = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  async function handleApprove(req) {
    await approveRequest(req.id, req.userId, req.planId);
    load();
  }

  async function handleReject(req) {
    await rejectRequest(req.id);
    load();
  }

  return (
    <div className="w-full max-w-5xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-accent" />
          <h2 className="font-display font-bold text-white text-lg">Staff Dashboard</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 font-medium">
            {counts.pending} pending
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium">
            <LogOut size={13} /> Logout
          </button>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-3 flex-shrink-0">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-accent text-[#0a0a0f]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {f} <span className="opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-500 text-sm">Loading requests…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex items-center justify-center py-16 text-slate-500 text-sm">No {filter === 'all' ? '' : filter} requests yet.</div>
        )}
        {filtered.map(req => (
          <RequestCard
            key={req.id}
            req={req}
            onApprove={() => handleApprove(req)}
            onReject={() => handleReject(req)}
            onPreview={() => req.receiptBase64 && setPreview(req.receiptBase64)}
          />
        ))}
      </div>

      {/* Receipt image lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="Receipt" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-2 hover:bg-white/20"><X size={20} /></button>
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, onApprove, onReject, onPreview }) {
  const [busy, setBusy] = useState('');
  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;

  async function act(fn, label) {
    setBusy(label);
    await fn().catch(console.error);
    setBusy('');
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row gap-4">

      {/* Receipt thumbnail */}
      <button onClick={onPreview} className="flex-shrink-0 w-full sm:w-20 h-24 sm:h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 transition-colors group">
        {req.receiptBase64
          ? <img src={req.receiptBase64} alt="Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
        }
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="font-bold text-white text-sm">{req.planLabel}</span>
            <span className="ml-2 text-accent font-semibold text-sm">₹{req.amount}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sc.color}`}>
            {sc.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Phone size={11} /> {req.userPhone || '—'}</span>
          <span className="flex items-center gap-1 truncate max-w-[220px]">{req.userEmail || 'Guest'}</span>
          <span className="flex items-center gap-1"><Calendar size={11} /> {fmt(req.submittedAt)}</span>
        </div>

        {req.status === 'approved' && req.expiresAt && (
          <p className="text-xs text-green-400 flex items-center gap-1">
            <Clock size={11} /> Active until {fmt(req.expiresAt)}
          </p>
        )}
        {req.status === 'rejected' && (
          <p className="text-xs text-red-400">Rejected · Contact: {req.userPhone}</p>
        )}
      </div>

      {/* Action buttons */}
      {req.status === 'pending' && (
        <div className="flex sm:flex-col gap-2 sm:justify-center flex-shrink-0">
          <button
            onClick={() => act(onApprove, 'approve')}
            disabled={!!busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30 text-xs font-semibold hover:bg-green-500/25 transition disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            {busy === 'approve' ? '…' : 'Approve'}
          </button>
          <button
            onClick={() => act(onReject, 'reject')}
            disabled={!!busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/25 transition disabled:opacity-50"
          >
            <XCircle size={14} />
            {busy === 'reject' ? '…' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
}
