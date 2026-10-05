import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  HeartHandshake, 
  MessageCircle, 
  Wind, 
  Play, 
  Pause, 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  Smile,
  Sun
} from 'lucide-react';
import { playWalkieTalkieChirp } from '../services/voiceService';

interface MentalHealthPageProps {
  currentLang: Language;
}

export const MentalHealthPage: React.FC<MentalHealthPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  // 4-7-8 Breathing Guide State (4s inhale, 7s hold, 8s exhale = 19s cycle)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSeconds(prev => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              setBreathPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleWhatsAppRedirect = () => {
    playWalkieTalkieChirp('start');
    const msg = encodeURIComponent("Bonjour / عسلامة، نحس روحي مانيش لباس وحاجتي بمساعدة ودعم نفسي مع فريق AuSecours.");
    window.open(`https://wa.me/21622426714?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>{t.mentalHealthPage.badge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.mentalHealthPage.heading}
        </h1>

        {/* Big Heartfelt Slogan */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-purple-950/40 border border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.2)] space-y-4">
          <p className="text-lg sm:text-2xl font-black text-rose-200 leading-relaxed flex items-center justify-center gap-2">
            <span>{t.mentalHealthPage.mainQuote}</span>
          </p>

          {/* Animated WhatsApp Bridge Button */}
          <div>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppRedirect}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-base sm:text-lg shadow-[0_0_35px_rgba(16,185,129,0.5)] border border-emerald-400/40 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 animate-bounce" />
              <span>{t.mentalHealthPage.notOkayBtn}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 4-7-8 Breathing Circle Tool */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-cyan-400">
          <Wind className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-black text-white">
            {t.mentalHealthPage.breathingTitle}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          {t.mentalHealthPage.breathingSub}
        </p>

        {/* Breathing Animation Bubble */}
        <div className="flex items-center justify-center py-6">
          <motion.div
            animate={{
              scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1.0,
            }}
            transition={{
              duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0.1 : 8,
              ease: 'easeInOut'
            }}
            className={`relative h-44 w-44 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-colors ${
              breathPhase === 'inhale'
                ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_50px_rgba(6,182,212,0.6)]'
                : breathPhase === 'hold'
                ? 'border-amber-400 bg-amber-950/60 shadow-[0_0_50px_rgba(245,158,11,0.6)]'
                : 'border-purple-400 bg-purple-950/60 shadow-[0_0_50px_rgba(168,85,247,0.6)]'
            }`}
          >
            <span className="text-4xl font-black text-white font-mono">
              {breathSeconds}s
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider mt-1 text-slate-200">
              {breathPhase === 'inhale'
                ? t.mentalHealthPage.inhale
                : breathPhase === 'hold'
                ? t.mentalHealthPage.hold
                : t.mentalHealthPage.exhale}
            </span>
          </motion.div>
        </div>

        {/* Start / Pause Breathing */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isBreathingActive
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isBreathingActive ? t.mentalHealthPage.stopBreathing : t.mentalHealthPage.startBreathing}</span>
          </button>
        </div>
      </div>

      {/* Psychological Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-400 w-fit">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Compassionate Care</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.mentalHealthPage.crisisAdvise1}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="p-2.5 rounded-xl bg-cyan-600/30 text-cyan-400 w-fit">
            <Sun className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">One Moment at a Time</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.mentalHealthPage.crisisAdvise2}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-600/30 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Safe & Confidential</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.mentalHealthPage.crisisAdvise3}
          </p>
        </div>
      </div>

    </div>
  );
};
