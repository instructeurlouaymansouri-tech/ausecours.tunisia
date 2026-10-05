import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Language, EmergencyProtocol } from '../types';
import { translations } from '../i18n/translations';
import { LetterMorph } from './LetterMorph';
import { 
  Bot, 
  MapPin, 
  GraduationCap, 
  PhoneCall, 
  HeartPulse, 
  Wind, 
  Droplet, 
  Flame, 
  Activity, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import { playWalkieTalkieChirp } from '../services/voiceService';

interface HeroSectionProps {
  currentLang: Language;
  onNavigateTab: (tab: string) => void;
  onSelectProtocol: (protocolId: string) => void;
  emergencyProtocols: EmergencyProtocol[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onNavigateTab,
  onSelectProtocol,
  emergencyProtocols
}) => {
  const t = translations[currentLang];

  const quickProtocols = [
    { id: 'proto-cpr', label: t.cprTitle, icon: HeartPulse, color: 'from-red-500 to-rose-600' },
    { id: 'proto-choking', label: t.chokingTitle, icon: Wind, color: 'from-amber-500 to-orange-600' },
    { id: 'proto-bleeding', label: t.bleedingTitle, icon: Droplet, color: 'from-red-600 to-red-800' },
    { id: 'proto-burns', label: t.burnsTitle, icon: Flame, color: 'from-orange-500 to-amber-600' },
    { id: 'proto-stroke', label: t.strokeTitle, icon: Activity, color: 'from-cyan-500 to-blue-600' },
  ];

  // Mute the background iframe video as soon as it loads
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const tryMute = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;
        // Try to access inner video element and mute it
        const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (innerDoc) {
          const videos = innerDoc.querySelectorAll('video');
          videos.forEach((v: HTMLVideoElement) => {
            v.muted = true;
            v.volume = 0;
          });
        }
      } catch (_) {
        // Cross-origin restriction — Drive iframe will block this.
        // We handle this gracefully; the video still displays.
      }
    };
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', tryMute);
      // Also attempt immediately in case already loaded
      setTimeout(tryMute, 1500);
    }
    return () => {
      iframe?.removeEventListener('load', tryMute);
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/*
        Background Video Layer — z-0:
        Sits ABOVE the page background color but BELOW all content (which is at z-10).
        No borders, no frame. Opacity 50%.
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">

        {/* Drive iframe — cinematic full-fill, centered, cropped */}
        <iframe
          ref={iframeRef}
          src="https://drive.google.com/file/d/1k5GtxAvm6LUT_sLIWlgg4Y-vxmTizMXf/preview?autoplay=1&rm=minimal"
          title="AuSecours Background Emergency Stream"
          allow="autoplay; encrypted-media; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          className="absolute border-0"
          style={{
            width: '177.78vh',
            minWidth: '100%',
            height: '56.25vw',
            minHeight: '100%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.12)',
            opacity: 0.50,
            pointerEvents: 'none',
          }}
        />

        {/* Soft edge vignette — blends video into the dark page edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/40 via-transparent to-[#05070d]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/35 via-transparent to-[#05070d]/35 pointer-events-none" />
      </div>

      {/* Ambient glowing orbs — sit behind video (-z-10) for depth layering */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-red-600/20 via-rose-600/15 to-blue-600/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-600/15 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />


      <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Top Emergency Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(239,68,68,0.3)] backdrop-blur-md"
        >
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>{t.heroBadge}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
          <span className="text-white font-mono font-black">24/7 TUNISIA</span>
        </motion.div>

        {/* Morphing Kinetic Typography Text */}
        <div className="pt-2 pb-2">
          <LetterMorph 
            text={t.heroHeading} 
            className="text-3xl sm:text-5xl lg:text-7xl font-black text-center drop-shadow-[0_0_35px_rgba(239,68,68,0.4)]"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md"
          >
            {t.heroSub}
          </motion.p>
        </div>

        {/* 3D Animated Rescue Paramedic Character Entrance */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, type: 'spring' }}
          className="relative py-4 max-w-md mx-auto flex flex-col items-center"
        >
          {/* Avatar Station with Red Glowing Beacon Ring */}
          <div className="relative cursor-pointer group" onClick={() => onNavigateTab('assistant')}>
            <div className="absolute -inset-3 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full p-1.5 bg-gradient-to-b from-red-500 via-red-700 to-black shadow-[0_0_50px_rgba(239,68,68,0.7)] overflow-hidden border-2 border-red-400">
              <img 
                src="/assets/assistant-avatar.jpg" 
                alt="AI Paramedic Technician Avatar - Louay Mansouri"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-2 bg-red-600 text-white font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full border border-white/40 shadow-xl flex items-center gap-1 animate-bounce">
              <Bot className="w-3.5 h-3.5" />
              <span>LIVE AI DISPATCH</span>
            </div>
          </div>

          {/* Press to Talk Animated Radar Button Under Avatar */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playWalkieTalkieChirp('start');
                onNavigateTab('assistant');
              }}
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-base sm:text-lg shadow-[0_0_40px_rgba(239,68,68,0.7)] border border-red-400/50 flex items-center gap-3 cursor-pointer group"
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
              <span>{t.talkToAi}</span>
              <Radio className="w-5 h-5 text-red-200 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Secondary Fluid Glass Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigateTab('hospitals')}
            className="glass-button-fluid px-6 py-3.5 rounded-2xl text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer backdrop-blur-xl"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>{t.findHospitalsBtn}</span>
          </button>

          <button
            onClick={() => onNavigateTab('training')}
            className="glass-button-fluid px-6 py-3.5 rounded-2xl text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer backdrop-blur-xl"
          >
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>{t.exploreTraining}</span>
          </button>

          <a
            href="tel:198"
            className="px-6 py-3.5 rounded-2xl bg-red-600/40 hover:bg-red-600/60 border border-red-500/60 text-red-100 font-black text-sm sm:text-base flex items-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all cursor-pointer backdrop-blur-xl"
          >
            <PhoneCall className="w-5 h-5 text-red-300 animate-pulse" />
            <span>{t.callSosNow}</span>
          </a>
        </div>

        {/* Quick Triage Action Protocols Grid */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-black tracking-wide text-slate-300 uppercase">
              {t.quickActionsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickProtocols.map((proto) => {
              const Icon = proto.icon;
              return (
                <motion.div
                  key={proto.id}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectProtocol(proto.id)}
                  className="glass-panel p-4 rounded-2xl border border-slate-700/60 hover:border-red-500/60 cursor-pointer flex flex-col items-center text-center gap-2.5 transition-all group backdrop-blur-xl bg-[#0a0e1a]/80"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${proto.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white">
                    {proto.label}
                  </span>
                  <span className="text-[10px] text-red-400 font-extrabold tracking-wider uppercase">
                    Immediate Guide →
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
