export const FORMATS = {
  mp4: {
    id: 'mp4',
    label: 'MP4',
    description: 'H.264 + AAC',
    ext: 'mp4',
    flags: ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k'],
    videoOnly: false,
  },
  webm: {
    id: 'webm',
    label: 'WebM',
    description: 'VP9 + Opus',
    ext: 'webm',
    flags: ['-c:v', 'libvpx-vp9', '-c:a', 'libopus', '-b:a', '128k'],
    videoOnly: false,
  },
  mov: {
    id: 'mov',
    label: 'MOV',
    description: 'H.264 + AAC',
    ext: 'mov',
    flags: ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k'],
    videoOnly: false,
  },
  mkv: {
    id: 'mkv',
    label: 'MKV',
    description: 'H.264 + AAC',
    ext: 'mkv',
    flags: ['-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k'],
    videoOnly: false,
  },
  mp3: {
    id: 'mp3',
    label: 'MP3',
    description: 'Audio Only',
    ext: 'mp3',
    flags: ['-vn', '-c:a', 'libmp3lame', '-b:a', '320k'],
    videoOnly: true,
  },
  wav: {
    id: 'wav',
    label: 'WAV',
    description: 'Audio Only',
    ext: 'wav',
    flags: ['-vn', '-c:a', 'pcm_s16le'],
    videoOnly: true,
  },
};

export const QUALITY = {
  original: { label: 'Original Quality', flags: [] },
  high: { label: 'High', flags: ['-crf', '18'] },
  compressed: { label: 'Compressed', flags: ['-crf', '28'] },
};
