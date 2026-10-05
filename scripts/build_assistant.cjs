const fs = require('fs');

const assistantCode = `import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Language, EmergencyProtocol, ChatMessage } from '../types';
import { translations } from '../i18n/translations';
import { askGeminiEmergencyAssistant } from '../services/geminiService';
import { speakEmergencyText, stopSpeaking, playWalkieTalkieChirp, playCprBeep } from '../services/voiceService';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  PhoneCall, 
  AlertTriangle, 
  HeartPulse, 
  Play, 
  Pause, 
  RotateCcw, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  Radio
} from 'lucide-react';

interface AIAssistantPageProps {
  currentLang: Language;
  selectedProtocolId?: string | null;
  emergencyProtocols: EmergencyProtocol[];
  soundEnabled: boolean;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  currentLang,
  selectedProtocolId,
  emergencyProtocols,
  soundEnabled
}) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<EmergencyProtocol | null>(null);

  // CPR Metronome State
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const metronomeIntervalRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (selectedProtocolId) {
      const found = emergencyProtocols.find(p => p.id === selectedProtocolId);
      if (found) {
        setActiveProtocol(found);
      }
    } else {
      setActiveProtocol(emergencyProtocols[0] || null);
    }
  }, [selectedProtocolId, emergencyProtocols]);

  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      sender: 'assistant',
      text: currentLang === 'ar' 
        ? "مرحباً، أنا تقني الطوارئ ومسعف الذكاء الاصطناعي لمنصة النجدة. ما هي حالة الطوارئ لديك؟ تحدث أو اكتب فوراً وسأوجهك خطوة بخطوة."
        : currentLang === 'tn'
        ? "أهلاً بيك، أنا مسعفك الذكي في تونس. شنوة واقع توة بالظبط؟ انزل وتكلم وإلا اكتب باش نسلكوها فيسع خطوة بخطوة."
        : currentLang === 'fr'
        ? "Bonjour, je suis votre Technicien Régulateur d'Urgence IA. Quelle est votre urgence ? Parlez ou écrivez immédiatement pour des instructions vitales."
        : "Hello, I am your certified AI Emergency Paramedic Dispatcher. What is your emergency? Speak or type immediately for life-saving triage.",
      timestamp: new Date(),
      triageLevel: 'urgent'
    };
    setMessages([welcomeMsg]);
  }, [currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isMetronomeActive) {
      metronomeIntervalRef.current = setInterval(() => {
        setCompressionCount(prev => {
          const next = prev + 1;
          if (soundEnabled) {
            playCprBeep(next % 30 === 1);
          }
          return next;
        });
      }, 545);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    }
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomeActive, soundEnabled]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your emergency message.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<Language, string> = {
        en: 'en-US',
        fr: 'fr-FR',
        ar: 'ar-TN',
        tn: 'ar-TN'
      };
      recognition.lang = langMap[currentLang];

      recognition.onstart = () => {
        setIsListening(true);
        if (soundEnabled) playWalkieTalkieChirp('start');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript, true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (soundEnabled) playWalkieTalkieChirp('end');
    }
  };

  const handleSendMessage = async (textToSend?: string, isVoice: boolean = false) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
      isVoiceInput: isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askGeminiEmergencyAssistant(query, currentLang);
      
      const assistantMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date(),
        triageLevel: response.triageLevel
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      setIsSpeaking(true);
      speakEmergencyText(response.text, currentLang, () => {
        setIsSpeaking(false);
      });

      if (response.text.toLowerCase().includes('cpr') || query.toLowerCase().includes('cpr') || query.includes('ماساج')) {
        const cprProto = emergencyProtocols.find(p => p.id === 'proto-cpr');
        if (cprProto) setActiveProtocol(cprProto);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/40 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider">
          <Bot className="w-4 h-4 text-red-400 animate-pulse" />
          <span>{t.assistantPage.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.assistantPage.heading}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-medium">
          {t.assistantPage.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 flex flex-col glass-panel rounded-3xl border border-red-500/30 overflow-hidden shadow-2xl">
          
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/assets/assistant-avatar.jpg" 
                  alt="AI Emergency Paramedic - Louay Mansouri"
                  className={\`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover border-2 \${
                    isSpeaking ? 'border-red-400 ring-4 ring-red-500/40' : 'border-slate-700'
                  } transition-all\`}
                />
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>Louay Mansouri AI</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-[10px] text-red-300 font-bold">
                    DISPATCH
                  </span>
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isSpeaking ? t.assistantPage.speaking : "Connected to Gemini Live Engine"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsSpeaking(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-600/30 border border-red-500/50 text-red-200 text-xs font-bold flex items-center gap-1 hover:bg-red-600/50 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </button>
              )}
              <a
                href="tel:198"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-lg cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>198</span>
              </a>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[440px] min-h-[350px]">
            {messages.map((msg) => {
              const isAi = msg.sender === 'assistant';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={\`flex gap-3 \${isAi ? 'justify-start' : 'justify-end'}\`}
                >
                  {isAi && (
                    <div className="h-8 w-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={\`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-medium leading-relaxed shadow-lg \${
                      isAi
                        ? msg.triageLevel === 'critical'
                          ? 'bg-red-950/80 border border-red-500/60 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                          : 'bg-slate-900/90 border border-slate-700/80 text-slate-100'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-br-none'
                    }\`}
                  >
                    {isAi && msg.triageLevel === 'critical' && (
                      <div className="flex items-center gap-1 text-red-400 font-black text-xs mb-1.5 uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                        <span>CRITICAL EMERGENCY PROTOCOL</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[10px] opacity-60 mt-1.5 block text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center text-slate-400 text-xs">
                <div className="h-8 w-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 animate-spin">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="animate-pulse">Analyzing emergency triage with Gemini AI...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              Quick Scenarios:
            </span>
            {t.assistantPage.quickQuestions.map((q: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white hover:border-red-500/60 whitespace-nowrap cursor-pointer transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800/90 space-y-3">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.assistantPage.inputPlaceholder}
                className="flex-1 bg-slate-900/90 border border-slate-700 focus:border-red-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
              />

              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={\`p-3.5 rounded-2xl text-white font-bold transition-all shadow-lg cursor-pointer \${
                  isListening
                    ? 'bg-red-600 animate-pulse ring-4 ring-red-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200'
                }\`}
                title={isListening ? t.assistantPage.stopListening : t.assistantPage.pushToTalk}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-red-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-lg cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-bold text-red-400">
                🚨 {t.assistantPage.emergencyCallNotice}
              </span>
            </div>
          </div>

        </div>

        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-5 rounded-3xl border border-red-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-red-500 animate-heartbeat" />
                <h3 className="text-base font-black text-white">
                  {t.assistantPage.cprMetronomeTitle}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 font-mono text-xs font-bold">
                110 BPM
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              {t.assistantPage.cprMetronomeSub}
            </p>

            <div className="flex items-center justify-center py-4">
              <div className={\`relative h-28 w-28 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-100 \${
                isMetronomeActive 
                  ? 'border-red-500 bg-red-950/60 shadow-[0_0_40px_rgba(239,68,68,0.7)] scale-105' 
                  : 'border-slate-700 bg-slate-900/60'
              }\`}>
                <span className="text-3xl font-black text-white font-mono">
                  {compressionCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-red-400">
                  {t.assistantPage.compressions}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={\`flex-1 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer \${
                  isMetronomeActive
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                }\`}
              >
                {isMetronomeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isMetronomeActive ? t.assistantPage.cprStop : t.assistantPage.cprStart}</span>
              </button>

              <button
                onClick={() => {
                  setCompressionCount(0);
                  setIsMetronomeActive(false);
                }}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                title="Reset Counter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeProtocol && (
            <div className="glass-panel p-5 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-red-400">
                    Active Lifesaving Protocol
                  </span>
                  <h4 className="text-base font-black text-white">
                    {activeProtocol.title[currentLang]}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[11px] font-black">
                  CALL {activeProtocol.emergencyCallNumber}
                </span>
              </div>

              <div className="space-y-2.5">
                {activeProtocol.steps.map((step) => (
                  <div key={step.stepNumber} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex gap-3 items-start">
                    <span className="h-6 w-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-0.5 text-xs">
                      <h5 className="font-bold text-slate-100">{step.title[currentLang]}</h5>
                      <p className="text-slate-300 leading-relaxed">{step.instruction[currentLang]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.assistantPage.dosTitle}</span>
                  </div>
                  <ul className="text-[11px] text-emerald-200/90 space-y-1 list-disc list-inside">
                    {activeProtocol.dos[currentLang].map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <XCircle className="w-4 h-4" />
                    <span>{t.assistantPage.dontsTitle}</span>
                  </div>
                  <ul className="text-[11px] text-rose-200/90 space-y-1 list-disc list-inside">
                    {activeProtocol.donts[currentLang].map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
`;

fs.writeFileSync('src/components/AIAssistantPage.tsx', assistantCode, 'utf8');
console.log('AIAssistantPage.tsx created!');
