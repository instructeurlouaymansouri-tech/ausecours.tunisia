const fs = require('fs');

const awarenessCode = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, AwarenessTip, TrueFalseTrivia } from '../types';
import { translations } from '../i18n/translations';
import { awarenessTipsData, trueFalseTriviaData } from '../data/awarenessData';
import { 
  ShieldAlert, 
  Sun, 
  CloudRain, 
  Car, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  RotateCw, 
  Trophy,
  Flame,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AwarenessPageProps {
  currentLang: Language;
}

export const AwarenessPage: React.FC<AwarenessPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Trivia State
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // 30-second Auto Rotation for Safety Tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setCurrentTipIndex(idx => (idx + 1) % awarenessTipsData.length);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTip = awarenessTipsData[currentTipIndex];
  const currentTrivia = trueFalseTriviaData[currentTriviaIndex];

  const handleTriviaAnswer = (answer: boolean) => {
    if (hasAnswered) return;
    setUserChoice(answer);
    setHasAnswered(true);

    if (answer === currentTrivia.isTrue) {
      setScore(s => s + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleNextTrivia = () => {
    setUserChoice(null);
    setHasAnswered(false);
    setCurrentTriviaIndex(i => (i + 1) % trueFalseTriviaData.length);
  };

  const getTipIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      case 'CloudRain': return <CloudRain className="w-6 h-6 text-cyan-500" />;
      case 'Car': return <Car className="w-6 h-6 text-rose-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 text-xs font-black uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span>{t.awarenessPage.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.awarenessPage.heading}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-medium">
          {t.awarenessPage.subheading}
        </p>
      </div>

      {/* Auto-Rotating 3D Sticky Note Section with 30s Countdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>{t.awarenessPage.stickyNotesTitle}</span>
          </h2>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>{t.awarenessPage.tipsCountdown}: <strong className="text-yellow-400">{timerSeconds}s</strong></span>
          </div>
        </div>

        {/* 3D Draggable Sticky Note Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {awarenessTipsData.map((tip, idx) => {
            const isCurrent = idx === currentTipIndex;
            const themeClass = 
              tip.colorTheme === 'yellow' ? 'sticky-note-yellow' :
              tip.colorTheme === 'cyan' ? 'sticky-note-cyan' :
              tip.colorTheme === 'pink' ? 'sticky-note-pink' :
              'sticky-note-yellow';

            return (
              <motion.div
                key={tip.id}
                drag
                dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className={\`\${themeClass} p-5 rounded-2xl cursor-grab active:cursor-grabbing select-none flex flex-col justify-between min-h-[220px] transition-all \${
                  isCurrent ? 'ring-4 ring-red-500 shadow-2xl scale-[1.03]' : 'opacity-90'
                }\`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-black/10 pb-2">
                    <div className="p-2 rounded-xl bg-black/10">
                      {getTipIcon(tip.icon)}
                    </div>
                    {tip.weatherCondition && (
                      <span className="text-[10px] uppercase font-black tracking-wider bg-black/15 px-2 py-0.5 rounded-full">
                        {tip.weatherCondition}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-sm mb-2 text-slate-900 leading-tight">
                    {tip.title[currentLang]}
                  </h3>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {tip.content[currentLang]}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-[10px] font-bold opacity-75">
                  <span>#AuSecoursSafety</span>
                  <span>Drag me ✦</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* True or False First Aid Myth-Busting Interactive Game */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500/40 text-red-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-red-400 tracking-wider">
                Myth-Busting Academy
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {t.awarenessPage.triviaTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-2xl">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">{t.awarenessPage.triviaScore}:</span>
            <span className="text-base font-black text-amber-400 font-mono">{score}</span>
          </div>
        </div>

        {/* Trivia Statement Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-red-400 text-xs font-mono font-bold">
            Question #{currentTriviaIndex + 1} of {trueFalseTriviaData.length}
          </span>
          <p className="text-base sm:text-xl font-black text-white leading-relaxed max-w-2xl mx-auto">
            "{currentTrivia.statement[currentLang]}"
          </p>

          {/* True / False Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleTriviaAnswer(true)}
              disabled={hasAnswered}
              className={\`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer \${
                hasAnswered && currentTrivia.isTrue === true
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-400 shadow-lg'
                  : hasAnswered && userChoice === true && currentTrivia.isTrue === false
                  ? 'bg-rose-600 text-white opacity-50'
                  : 'bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white'
              }\`}
            >
              <Check className="w-5 h-5" />
              <span>TRUE (صحيح)</span>
            </button>

            <button
              onClick={() => handleTriviaAnswer(false)}
              disabled={hasAnswered}
              className={\`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer \${
                hasAnswered && currentTrivia.isTrue === false
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-400 shadow-lg'
                  : hasAnswered && userChoice === false && currentTrivia.isTrue === true
                  ? 'bg-rose-600 text-white opacity-50'
                  : 'bg-rose-600/30 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white'
              }\`}
            >
              <X className="w-5 h-5" />
              <span>FALSE (غالط)</span>
            </button>
          </div>

          {/* Explanation Output */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={\`p-4 sm:p-5 rounded-2xl border text-left rtl:text-right mt-4 space-y-2 \${
                  userChoice === currentTrivia.isTrue
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-100'
                }\`}
              >
                <div className="flex items-center gap-2 font-black text-sm">
                  {userChoice === currentTrivia.isTrue ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <X className="w-5 h-5 text-rose-400" />
                  )}
                  <span>
                    {userChoice === currentTrivia.isTrue
                      ? t.awarenessPage.correct
                      : t.awarenessPage.wrong}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                  {currentTrivia.explanation[currentLang]}
                </p>

                <div className="pt-2 text-right rtl:text-left">
                  <button
                    onClick={handleNextTrivia}
                    className="px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black transition-all cursor-pointer"
                  >
                    {t.awarenessPage.nextQuestion} →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
`;

fs.writeFileSync('src/components/AwarenessPage.tsx', awarenessCode, 'utf8');
console.log('AwarenessPage.tsx created!');
