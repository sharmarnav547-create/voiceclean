import os, shutil, tempfile, subprocess
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_demucs(inp: str, outdir: str) -> str:
    cmd = [
        "python", "-m", "demucs.separate",
        "--two-stems", "vocals",
        "-n", "htdemucs",
        "--out", outdir,
        inp,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-1000:])
    # Walk to find vocals.wav — Demucs nests it: outdir/htdemucs/<stem>/vocals.wav
    for root, _, files in os.walk(outdir):
        for fn in files:
            if fn == "vocals.wav":
                return os.path.join(root, fn)
    raise RuntimeError("vocals.wav not produced by Demucs")


@app.get("/health")
def health():
    try:
        subprocess.run(
            ["python", "-m", "demucs.separate", "--help"],
            capture_output=True, check=True, timeout=10
        )
        return {"status": "ok", "engine": "demucs"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/debug")
def debug():
    """Check every dependency and return what is/isn't working."""
    results = {}

    # Check demucs
    r = subprocess.run(["python", "-m", "demucs.separate", "--help"],
                       capture_output=True, text=True)
    results["demucs"] = "ok" if r.returncode == 0 else r.stderr[:300]

    # Check ffmpeg
    r2 = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
    results["ffmpeg"] = "ok" if r2.returncode == 0 else r2.stderr[:300]

    # Check python path
    import sys
    results["python"] = sys.executable

    return results


@app.post("/process")
async def process(file: UploadFile = File(...), plan: str = Form("free")):
    tmp = tempfile.mkdtemp(prefix="cv_")
    try:
        inp = os.path.join(tmp, "audio.wav")
        with open(inp, "wb") as f:
            f.write(await file.read())

        vocals_path = run_demucs(inp, tmp)

        # Light cleanup pass: highpass to remove sub-bass rumble, then optional loudnorm
        out = os.path.join(tmp, "out.wav")
        af = "highpass=f=80"
        if plan in ("plus", "pro"):
            af += ",loudnorm=I=-16:TP=-1.5:LRA=11"

        r = subprocess.run(
            ["ffmpeg", "-y", "-i", vocals_path, "-af", af, out],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            raise RuntimeError(f"FFmpeg post-process failed: {r.stderr[-500:]}")

        with open(out, "rb") as f:
            data = f.read()

        return Response(content=data, media_type="audio/wav")

    except Exception as e:
        import traceback
        msg = f"{type(e).__name__}: {e}"
        print("[ERROR]", msg)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=msg)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
