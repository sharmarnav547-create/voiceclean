import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const ffmpegRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load(onProgress) {
    if (loaded) return ffmpegRef.current;
    setLoading(true);
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setLoaded(true);
      setLoading(false);
      return ffmpeg;
    } catch (e) {
      setLoading(false);
      throw new Error(`Failed to load FFmpeg: ${e.message}`);
    }
  }

  async function run(args, onLog) {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) throw new Error('FFmpeg not loaded');

    if (onLog) {
      ffmpeg.on('log', ({ message }) => onLog(message));
    }

    const code = await ffmpeg.exec(args);
    if (code !== 0) throw new Error(`FFmpeg failed (exit ${code}) — check logs`);
  }

  async function writeFile(name, data) {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    await ffmpeg.writeFile(name, data);
  }

  async function readFile(name) {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) throw new Error('FFmpeg not loaded');
    return ffmpeg.readFile(name);
  }

  async function deleteFile(name) {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) return;
    try {
      await ffmpeg.deleteFile(name);
    } catch (_) {}
  }

  return { load, run, writeFile, readFile, deleteFile, loaded, loading };
}
