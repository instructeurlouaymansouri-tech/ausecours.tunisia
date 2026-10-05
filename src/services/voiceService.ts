import { Language } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play Walkie-Talkie Radio Beep / Chirp
export function playWalkieTalkieChirp(type: 'start' | 'end' = 'start') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'start') {
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else {
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    }
  } catch (e) {
    console.warn("AudioContext chirp error:", e);
  }
}

// Play CPR Metronome Click
export function playCprBeep(isStrongBeat: boolean = false) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isStrongBeat ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isStrongBeat ? 880 : 520, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) {
    console.warn("Metronome click error:", e);
  }
}

// Speech Synthesis for AI Emergency Technician
export function speakEmergencyText(
  text: string,
  lang: Language = 'en',
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  // Clean Markdown tags
  const cleanText = text.replace(/\[CRITICAL\]|\[URGENT\]|\[حالة حرجة\]|\[استعجال خطير\]|\*\*|\*|#|_/g, '').trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05; // Urgent yet clear pacing
  utterance.pitch = 1.0;

  const langCodes: Record<Language, string> = {
    en: 'en-US',
    fr: 'fr-FR',
    ar: 'ar-TN',
    tn: 'ar-TN'
  };

  utterance.lang = langCodes[lang] || 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    playWalkieTalkieChirp('end');
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  playWalkieTalkieChirp('start');
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
