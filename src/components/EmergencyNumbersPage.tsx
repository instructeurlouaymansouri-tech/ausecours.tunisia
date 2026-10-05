import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Language, EmergencyNumber } from '../types';
import { translations } from '../i18n/translations';
import { emergencyNumbersData } from '../data/emergencyNumbersData';
import { 
  PhoneCall, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Radio, 
  Send, 
  MapPin, 
  HeartHandshake,
  Share2
} from 'lucide-react';
import { playWalkieTalkieChirp } from '../services/voiceService';

interface EmergencyNumbersPageProps {
  currentLang: Language;
}

export const EmergencyNumbersPage: React.FC<EmergencyNumbersPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sirenActive, setSirenActive] = useState(true);
  const [sosGenerated, setSosGenerated] = useState(false);

  const handleCopyNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    playWalkieTalkieChirp('start');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateSosSms = () => {
    const lat = 36.8065;
    const lng = 10.1815;
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    
    const message = currentLang === 'ar' || currentLang === 'tn'
      ? `نداء استغاثة طارئ عاجل من تطبيق AuSecours!
أنا في حالة طوارئ وأحتاج للمساعدة فوراً.
موقعي الجغرافي على الخريطة: ${mapsLink}`
      : currentLang === 'fr'
      ? `ALERTE URGENCE SOS AuSecours !
Je suis en situation d'urgence vitale et j'ai besoin de secours immédiatement.
Ma position GPS : ${mapsLink}`
      : `EMERGENCY SOS ALERT via AuSecours!
I am in an emergency and need immediate assistance.
My GPS location: ${mapsLink}`;

    navigator.clipboard.writeText(message);
    setSosGenerated(true);
    playWalkieTalkieChirp('start');

    // Open WhatsApp or SMS
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setTimeout(() => setSosGenerated(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Gyrophare & Emergency Beacon Header */}
      <div className="text-center space-y-4">
        
        {/* Animated Strobe Gyrophare */}
        <div className="relative inline-flex items-center justify-center">
          {sirenActive && (
            <>
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-rose-500 to-blue-600 rounded-full blur-2xl opacity-70 animate-pulse" />
              <div className="absolute -inset-8 bg-red-600/30 rounded-full blur-3xl animate-ping" />
            </>
          )}

          <div className="relative h-24 w-24 rounded-full bg-slate-950 border-4 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)] flex items-center justify-center overflow-hidden">
            <div className={`h-16 w-16 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center text-white ${
              sirenActive ? 'animate-gyrophare shadow-[0_0_30px_#ef4444]' : ''
            }`}>
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Headline text */}
        <div className="space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-black uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{t.numbersPage.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t.numbersPage.heading}
          </h1>

          <p className="text-red-400 font-extrabold text-sm sm:text-lg bg-red-950/30 border border-red-500/30 py-2.5 px-4 rounded-2xl">
            🚨 {t.numbersPage.headlineText}
          </p>
        </div>

        {/* Gyrophare Strobe Toggle */}
        <div>
          <button
            onClick={() => setSirenActive(!sirenActive)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            {sirenActive ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{sirenActive ? t.numbersPage.sirenOn : t.numbersPage.sirenOff}</span>
          </button>
        </div>

      </div>

      {/* Grid of Tunisian Emergency Hotlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {emergencyNumbersData.map((num) => {
          const isCopied = copiedId === num.id;
          return (
            <motion.div
              key={num.id}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-700/80 hover:border-red-500/60 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase text-white bg-red-600/30 border border-red-500/40">
                    {num.badge}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight group-hover:text-red-400 transition-colors">
                    {num.number}
                  </span>
                </div>

                <h3 className="text-base font-black text-white mb-1.5">
                  {num.name[currentLang]}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {num.description[currentLang]}
                </p>
              </div>

              {/* Action Buttons: Direct Dial & Copy */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${num.number.replace(/\s+/g, '')}`}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>{t.numbersPage.directCall} ({num.number})</span>
                </a>

                <button
                  onClick={() => handleCopyNumber(num.id, num.number)}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title={t.numbersPage.copyNumber}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* One-Click GPS SOS SMS Broadcast Generator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/40 shadow-2xl space-y-4 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-red-400">
          <MapPin className="w-6 h-6 animate-bounce" />
          <h2 className="text-lg sm:text-xl font-black text-white">
            {t.numbersPage.sosSmsTitle}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {t.numbersPage.sosSmsDesc}
        </p>

        <button
          onClick={handleGenerateSosSms}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 mx-auto shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:scale-105 transition-all cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>{t.numbersPage.generateSosBtn}</span>
        </button>

        {sosGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold"
          >
            ✓ {t.numbersPage.sosGenerated}
          </motion.div>
        )}
      </div>

    </div>
  );
};
