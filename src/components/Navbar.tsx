import React, { useState } from 'react';
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
                  className={`relative px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-white bg-red-600/20 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                      : item.highlight
                      ? 'text-red-400 hover:text-white hover:bg-white/5 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
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
                    className={`w-full px-3 py-2 text-left rtl:text-right text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-red-600/20 text-red-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
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
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left rtl:text-right cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                  }`}
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
