import React, { useState, useEffect } from 'react';
import { Language, EmergencyProtocol } from './types';
import { translations } from './i18n/translations';
import { emergencyProtocols } from './data/emergencyProtocols';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AIAssistantPage } from './components/AIAssistantPage';
import { HospitalMapPage } from './components/HospitalMapPage';
import { AwarenessPage } from './components/AwarenessPage';
import { EmergencyNumbersPage } from './components/EmergencyNumbersPage';
import { MentalHealthPage } from './components/MentalHealthPage';
import { TrainingPage } from './components/TrainingPage';
import { ReviewsSection } from './components/ReviewsSection';
import { LiquidGlassFooter } from './components/LiquidGlassFooter';
import { PhoneCall, Bot, Radio, HeartPulse } from 'lucide-react';
import { playWalkieTalkieChirp } from './services/voiceService';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync HTML dir attribute for RTL support
  useEffect(() => {
    const isRtl = currentLang === 'ar' || currentLang === 'tn';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }, [currentLang]);

  const handleSelectProtocol = (protocolId: string) => {
    setSelectedProtocolId(protocolId);
    setActiveTab('assistant');
    if (soundEnabled) playWalkieTalkieChirp('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col justify-between selection:bg-red-500/30 selection:text-red-200">
      
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenSosNumbers={() => handleTabChange('numbers')}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              currentLang={currentLang}
              onNavigateTab={handleTabChange}
              onSelectProtocol={handleSelectProtocol}
              emergencyProtocols={emergencyProtocols}
            />
            <ReviewsSection currentLang={currentLang} />
          </>
        )}

        {activeTab === 'assistant' && (
          <AIAssistantPage
            currentLang={currentLang}
            selectedProtocolId={selectedProtocolId}
            emergencyProtocols={emergencyProtocols}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'hospitals' && (
          <HospitalMapPage currentLang={currentLang} />
        )}

        {activeTab === 'awareness' && (
          <AwarenessPage currentLang={currentLang} />
        )}

        {activeTab === 'numbers' && (
          <EmergencyNumbersPage currentLang={currentLang} />
        )}

        {activeTab === 'mentalHealth' && (
          <MentalHealthPage currentLang={currentLang} />
        )}

        {activeTab === 'training' && (
          <TrainingPage currentLang={currentLang} />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection currentLang={currentLang} />
        )}
      </main>

      {/* Floating Bottom Quick Action Dispatch Trigger for Mobile & Desktop */}
      {activeTab !== 'assistant' && (
        <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-40 flex flex-col gap-3">
          <button
            onClick={() => {
              if (soundEnabled) playWalkieTalkieChirp('start');
              handleTabChange('assistant');
            }}
            className="p-4 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] border-2 border-white/30 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center group"
            title="Open Live AI Dispatcher"
          >
            <Bot className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Liquid Glass Footer */}
      <LiquidGlassFooter
        currentLang={currentLang}
        onNavigateTab={handleTabChange}
      />

    </div>
  );
}

export default App;
