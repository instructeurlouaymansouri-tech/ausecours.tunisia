const fs = require('fs');

// 1. LetterMorph.tsx
const letterMorphCode = `import React from 'react';
import { motion } from 'framer-motion';

interface LetterMorphProps {
  text: string;
  className?: string;
}

export const LetterMorph: React.FC<LetterMorphProps> = ({ text, className = "" }) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(6px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={\`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 \${className}\`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-hidden">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={letterIndex}
              variants={childVariants}
              className="inline-block bg-gradient-to-r from-red-500 via-rose-300 to-white bg-clip-text text-transparent font-black tracking-tight"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};
`;
fs.writeFileSync('src/components/LetterMorph.tsx', letterMorphCode, 'utf8');
console.log('LetterMorph.tsx created!');

// 2. Navbar.tsx
const navbarCode = `import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  PhoneCall, 
  Menu, 
  X, 
  Globe, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Activity, 
  Bot, 
  MapPin, 
  GraduationCap, 
  HeartHandshake,
  FileCheck
} from 'lucide-react';
import { playWalkieTalkieChirp } from '../services/voiceService';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSosNumbers: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLangChange,
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  onOpenSosNumbers
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇹🇳' },
    { code: 'tn', label: 'تونسي', flag: '🇹🇳' }
  ];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Activity },
    { id: 'assistant', label: t.nav.assistant, icon: Bot, highlight: true },
    { id: 'hospitals', label: t.nav.hospitals, icon: MapPin },
    { id: 'awareness', label: t.nav.awareness, icon: ShieldAlert },
    { id: 'numbers', label: t.nav.numbers, icon: PhoneCall },
    { id: 'mentalHealth', label: t.nav.mentalHealth, icon: HeartHandshake },
    { id: 'training', label: t.nav.training, icon: GraduationCap },
    { id: 'reviews', label: t.nav.reviews, icon: FileCheck }
  ];

  const handleNavClick = (tabId: string) => {
    if (soundEnabled) playWalkieTalkieChirp('start');
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07090e]/85 border-b border-red-500/20 shadow-2xl transition-all duration-300">
      {/* Top Emergency Fast Strip */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white text-xs font-semibold py-1 px-4 text-center flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 mx-auto animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
          <span>🚨 24/7 National Emergency Dispatch: <strong>198 (Protection Civile)</strong> | <strong>190 (SAMU)</strong></span>
        </div>
        <button 
          onClick={onOpenSosNumbers}
          className="hidden md:flex items-center gap-1.5 bg-black/40 hover:bg-black/60 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/30 transition-all cursor-pointer"
        >
          <PhoneCall className="w-3 h-3 text-red-300" />
          <span>Quick SOS</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <img 
                src="/assets/ausecours-logo.png" 
                alt="AuSecours Logo" 
                className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#07090e]"></span>
              </span>
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                AuSecours <span className="text-red-500 font-extrabold">النجدة</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={\`relative px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer \${
                    isActive
                      ? 'text-white bg-red-600/20 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                      : item.highlight
                      ? 'text-red-400 hover:text-white hover:bg-white/5 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }\`}
                >
                  <Icon className={\`w-4 h-4 \${isActive ? 'text-red-400' : 'text-slate-400'}\`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-red-500 to-rose-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Sound, Instant SOS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Effects Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? "Mute Sounds" : "Enable Emergency Audio"}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 text-xs font-bold hover:border-slate-500 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-red-400" />
                <span>{languages.find(l => l.code === currentLang)?.label}</span>
              </button>
              
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 w-36 py-1.5 bg-[#0e1322] border border-slate-700/80 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLangChange(l.code)}
                    className={\`w-full px-3 py-2 text-left rtl:text-right text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer \${
                      currentLang === l.code
                        ? 'bg-red-600/20 text-red-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }\`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instant SOS Call Button */}
            <a
              href="tel:198"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] hover:scale-105 active:scale-95 transition-all border border-red-400/40 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>SOS 198</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-[#090d18] border-b border-red-500/30 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={\`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left rtl:text-right cursor-pointer \${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                  }\`}
                >
                  <Icon className="w-4 h-4 text-red-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-bold">Quick Emergency:</span>
            <div className="flex gap-2">
              <a 
                href="tel:198" 
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-black flex items-center gap-1 shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 198
              </a>
              <a 
                href="tel:190" 
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center gap-1 shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 190
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
`;
fs.writeFileSync('src/components/Navbar.tsx', navbarCode, 'utf8');
console.log('Navbar.tsx created!');

// 3. HeroSection.tsx
const heroSectionCode = `import React from 'react';
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
  Play,
  ShieldCheck,
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

  return (
    <section className="relative overflow-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Interactive Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/15 via-rose-600/10 to-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-600/10 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto text-center space-y-8">
        
        {/* Top Emergency Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>{t.heroBadge}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
          <span className="text-white font-mono font-black">24/7 TUNISIA</span>
        </motion.div>

        {/* Video Player Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-red-500/40 via-slate-800/60 to-slate-900/90 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.35)] overflow-hidden group"
        >
          <div className="relative rounded-[22px] overflow-hidden bg-black/90 aspect-video flex items-center justify-center">
            {/* Google Drive Preview Video */}
            <iframe
              src="https://drive.google.com/file/d/1k5GtxAvm6LUT_sLIWlgg4Y-vxmTizMXf/preview"
              title="AuSecours Emergency Assistant Overview"
              allow="autoplay; encrypted-media; fullscreen"
              className="w-full h-full border-0 absolute inset-0 rounded-[22px]"
            />
            {/* Gradient Overlay edge protection */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[22px]" />
          </div>
        </motion.div>

        {/* Morphing Kinetic Typography Text Below Video */}
        <div className="pt-4 pb-2">
          <LetterMorph 
            text={t.heroHeading} 
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-center"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed"
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
            <div className="absolute -inset-3 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full p-1.5 bg-gradient-to-b from-red-500 via-red-700 to-black shadow-2xl overflow-hidden border-2 border-red-400">
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
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-base sm:text-lg shadow-[0_0_35px_rgba(239,68,68,0.6)] border border-red-400/50 flex items-center gap-3 cursor-pointer group"
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
            className="glass-button-fluid px-6 py-3.5 rounded-2xl text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>{t.findHospitalsBtn}</span>
          </button>

          <button
            onClick={() => onNavigateTab('training')}
            className="glass-button-fluid px-6 py-3.5 rounded-2xl text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>{t.exploreTraining}</span>
          </button>

          <a
            href="tel:198"
            className="px-6 py-3.5 rounded-2xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 text-red-400 animate-pulse" />
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
                  className="glass-panel p-4 rounded-2xl border border-slate-700/60 hover:border-red-500/60 cursor-pointer flex flex-col items-center text-center gap-2.5 transition-all group"
                >
                  <div className={\`p-3 rounded-xl bg-gradient-to-br \${proto.color} text-white shadow-lg group-hover:scale-110 transition-transform\`}>
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
`;
fs.writeFileSync('src/components/HeroSection.tsx', heroSectionCode, 'utf8');
console.log('HeroSection.tsx created!');
