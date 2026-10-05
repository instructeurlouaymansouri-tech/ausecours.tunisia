import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Phone, Mail, MessageCircle, Heart, ArrowUp } from 'lucide-react';



interface LiquidGlassFooterProps {
  currentLang: Language;
  onNavigateTab: (tab: string) => void;
}

export const LiquidGlassFooter: React.FC<LiquidGlassFooterProps> = ({ currentLang, onNavigateTab }) => {
  const t = translations[currentLang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-red-500/20 bg-gradient-to-b from-[#07090e] via-[#090d18] to-[#04060a] text-slate-300 overflow-hidden">
      
      {/* Liquid Ambient Backlight Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-red-600/10 via-rose-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        
        {/* Top Callout Strip: "We're here for you" */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-4 text-center md:text-left rtl:md:text-right">
            <div className="h-14 w-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <Heart className="w-7 h-7 animate-heartbeat" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t.contact.weAreHere} ❤️
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                24/7 Rapid AI Emergency Guidance & First Aid Assistance Across All Tunisia.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+21622426714"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>+216 22 426 714</span>
            </a>

            <a
              href="https://wa.me/21622426714"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* 4 Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/ausecours-logo.png" alt="AuSecours" className="h-10 w-auto" />
              <div>
                <span className="text-lg font-black text-white block">AuSecours النجدة</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Tunisie Urgences</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading the digital transformation of emergency medical guidance in Tunisia. Connecting citizens with certified first aid protocols, 3D hospital radar, and life-saving AI dispatch.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-white uppercase tracking-wider text-sm border-b border-slate-800 pb-2">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('assistant')} className="hover:text-red-400 transition-colors cursor-pointer">
                  → AI Emergency Dispatcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('hospitals')} className="hover:text-red-400 transition-colors cursor-pointer">
                  → 3D Tunisian Hospitals Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('awareness')} className="hover:text-red-400 transition-colors cursor-pointer">
                  → Safety Radar & Trivia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('numbers')} className="hover:text-red-400 transition-colors cursor-pointer">
                  → Tunisian SOS Hotlines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('training')} className="hover:text-red-400 transition-colors cursor-pointer">
                  → First Aid Academy Signup
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contacts */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-white uppercase tracking-wider text-sm border-b border-slate-800 pb-2">
              Direct Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <a href="tel:+21622426714" className="hover:text-white transition-colors">+216 22 426 714</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:instructeurlouaymansouri@gmail.com" className="hover:text-white transition-colors truncate">
                  instructeurlouaymansouri@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <a href="https://wa.me/21622426714" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: +216 22 426 714
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <a href="https://www.instagram.com/whoslouay" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  @whoslouay
                </a>
              </li>

            </ul>
          </div>

          {/* Col 4: Lead Instructor Bio Badge */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <img src="/assets/assistant-avatar.jpg" className="h-10 w-10 rounded-xl object-cover border border-red-500/40" />
              <div>
                <strong className="text-white block font-black">Louay Mansouri</strong>
                <span className="text-[10px] text-amber-400 font-bold">First Aid Lead Instructor</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Founder & Chief Emergency Trainer. Certified in field trauma response, sports rescue, and community CPR education in Tunisia.
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-center sm:text-left rtl:sm:text-right">
            <p className="font-black text-white text-sm">
              {t.contact.copyright}
            </p>
            <p className="text-slate-500 text-[11px]">
              {t.contact.rights}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
