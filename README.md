# ClearVoice AI

**AI-powered background noise removal that runs entirely in your browser.**

Upload any video, and the AI removes wind, traffic, echo, hum, and crowd noise — keeping your voice crystal clear. No server uploads. Your files never leave your device.

**Live:** https://voiceclean.vercel.app

---

## Features

- Demucs v4 voice separation — state-of-the-art neural network by Meta AI Research
- Wiener filter post-pass — catches residual tonal noise (hum, drone, electrical buzz)
- 100% browser-based — WebAssembly + ONNX Runtime Web, no server uploads
- GPU acceleration — WebGPU used automatically when available
- Voice Boost — amplify voice presence up to +12 dB (paid plans)
- Volume Balancing — dynamic normalization for consistent loudness (paid plans)
- MP4 export — clean video with original quality preserved
- Dark and light mode — system preference + manual toggle
- Mobile responsive — works on Android Chrome and iOS Safari

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3 |
| Animation | Framer Motion 12 |
| AI Inference | ONNX Runtime Web, Demucs v4 (htdemucs.onnx) |
| Audio/Video | FFmpeg WASM (@ffmpeg/ffmpeg) |
| Auth | Firebase (Google Sign-In via GIS / FedCM) |
| Payments | Cashfree / UPI QR |
| Database | Firebase Firestore |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore and Google Auth enabled
- Google OAuth client ID

### Installation

```bash
git clone https://github.com/sharmarnav547-create/voiceclean.git
cd voiceclean
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Development

```bash
npm run dev
# App runs at http://localhost:5173
```

> The AI model (120 MB Demucs ONNX) is served from `/public/models/`. It downloads once and is cached in the browser Cache API.

### Production Build

```bash
npm run build
```

---

## Deployment (Vercel)

Push to `main` — Vercel auto-deploys.

`vercel.json` configures:
- SPA rewrite rule for React Router
- `Cross-Origin-Opener-Policy: same-origin` — required for SharedArrayBuffer (FFmpeg WASM)
- `Cross-Origin-Embedder-Policy: credentialless` — enables COOP without breaking Google Sign-In

Add all `.env` vars in Vercel → Settings → Environment Variables.

Add your Vercel domain to Authorized JavaScript Origins in Google Cloud Console:
```
https://your-project.vercel.app
```

---

## AI Processing Pipeline

```
Input Video (MP4)
    ↓  FFmpeg WASM — extract audio (WAV 44.1kHz mono)
    ↓  Demucs v4 (htdemucs.onnx, runs locally, 120 MB)
    ↓  Wiener Filter (post-pass, targets 100–600 Hz hum)
    ↓  FFmpeg WASM — merge clean audio + original video
    ↓  Auto-download MP4 to device
```

---

## Project Structure

```
clearvoice/
├── public/
│   ├── models/htdemucs.onnx       # Demucs v4 AI model (120 MB)
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/                # React UI components
│   ├── hooks/                     # useAuth, useFFmpeg, useAudioProcessor
│   ├── workers/audioProcessor.worker.js
│   ├── utils/                     # audioUtils, planUtils, formatUtils
│   └── App.jsx
├── index.html                     # SEO meta, JSON-LD, OG tags
└── vercel.json
```

---

## Pricing (INR)

| Plan | Price | Videos/mo | Highlights |
|------|-------|-----------|-----------|
| Free | ₹0 | 1 | Basic noise removal |
| Starter | ₹49 | 15 | Export enabled |
| Creator | ₹99 | 40 | Voice boost, volume balance |
| Pro | ₹199 | Unlimited | All features |

---

## License

Private — All rights reserved. © 2025 ClearVoice AI.
