import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TrainingRegistration } from '../types';
import { translations } from '../i18n/translations';
import { saveTrainingRegistration, getLocalRegistrations } from '../services/supabaseService';
import { 
  GraduationCap, 
  Award, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  QrCode, 
  Download, 
  X, 
  Sparkles,
  Trophy,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrainingPageProps {
  currentLang: Language;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [modalOpen, setModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<TrainingRegistration | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    governorate: 'Tunis',
    municipality: '',
    email: '',
    phone: '',
    hasExperience: false,
    questions: ''
  });

  const governoratesList = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
    'Beja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax',
    'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  // Gallery Photos
  const galleryPhotos = [
    {
      url: '/assets/training-cpr.jpg',
      title: 'Practical CPR & AED Mannequin Training Session',
      desc: 'Hands-on chest compressions and airway management practice.'
    },
    {
      url: '/assets/training-sportif.jpg',
      title: 'Youth & Sports First Aid Workshop (Sportif Field)',
      desc: 'Lead Instructor Louay Mansouri with young athletes & coaches.'
    },
    {
      url: '/assets/training-cert.jpg',
      title: 'Certified First Aid Academy Graduation Ceremony',
      desc: 'Distribution of official CPR & Emergency certificates to participants.'
    }
  ];

  // Google Drive Video Workshops
  const trainingVideos = [
    {
      id: 'vid-1',
      url: 'https://drive.google.com/file/d/17H8RoBZYvkfyoilaOUq-UVtre_1QsYin/preview',
      title: 'Session 1: Hands-on CPR Protocol & Rapid Chest Compressions'
    },
    {
      id: 'vid-2',
      url: 'https://drive.google.com/file/d/1IkNFUCqxbr0FbiL2XTZfLnFw2cSPi2Du/preview',
      title: 'Session 2: Choking & Pediatric Emergency Airway Maneuvers'
    },
    {
      id: 'vid-3',
      url: 'https://drive.google.com/file/d/1lT0YUT6KxfSPxNlqn-ZGhuUbJ1_HF_lv/preview',
      title: 'Session 3: Severe Hemorrhage Tourniquet & Pressure Bandages'
    },
    {
      id: 'vid-4',
      url: 'https://drive.google.com/file/d/1n2kmGLn73tjAlNCyGSVEl5hbDG12fYj9/preview',
      title: 'Session 4: Sports Injuries, Spinal Trauma & Field Extraction'
    }
  ];

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("Please fill in the required fields: Name, Surname, Phone.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = await saveTrainingRegistration(formData);
      setGeneratedPass(reg);
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Hero Section with Cover */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>{t.trainingPage.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.trainingPage.heading}
            </h1>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 shrink-0">
                <img src="/assets/assistant-avatar.jpg" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{t.trainingPage.instructorName}</h4>
                <p className="text-xs text-amber-400 font-bold">{t.trainingPage.instructorBadge}</p>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.trainingPage.subheading}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.trainingPage.joinSessionBtn}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl aspect-[4/3] group">
              <img 
                src="/assets/training-cpr.jpg" 
                alt="First Aid Training Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-black text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20">
                  Live Practical Workshops in Tunisia
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Definition & Sports First Aid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Definition Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-black text-base">
            <Award className="w-5 h-5" />
            <h3>{t.trainingPage.definitionTitle}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.trainingPage.definitionText}
          </p>
        </div>

        {/* Sports First Aid Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-red-400 font-black text-base">
            <Activity className="w-5 h-5" />
            <h3>{t.trainingPage.sportsSectionTitle}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.trainingPage.sportsSectionText}
          </p>
        </div>

      </div>

      {/* Interactive Photo Carousel Gallery */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h2>{t.trainingPage.liveGalleryTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePhotoIndex(i => (i === 0 ? galleryPhotos.length - 1 : i - 1))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePhotoIndex(i => (i + 1) % galleryPhotos.length)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-black border border-slate-700/60 shadow-2xl">
          <img 
            src={galleryPhotos[activePhotoIndex].url}
            alt={galleryPhotos[activePhotoIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-base sm:text-xl font-black text-white">
              {galleryPhotos[activePhotoIndex].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {galleryPhotos[activePhotoIndex].desc}
            </p>
          </div>
        </div>

        {/* Thumbnail selector */}
        <div className="grid grid-cols-3 gap-3">
          {galleryPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setActivePhotoIndex(index)}
              className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                activePhotoIndex === index ? 'border-amber-400 ring-4 ring-amber-500/30' : 'border-slate-800 opacity-60'
              }`}
            >
              <img src={photo.url} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Playing Video Workshops Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 text-white font-black text-lg">
          <Video className="w-5 h-5 text-red-500" />
          <h2>{t.trainingPage.videoWorkshopsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainingVideos.map((video, idx) => (
            <div key={video.id} className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 space-y-3 p-3 shadow-xl">
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="autoplay; encrypted-media; fullscreen"
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 px-1">
                {video.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal / Pass Output */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0b0f19] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => {
                  setModalOpen(false);
                  setGeneratedPass(null);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!generatedPass ? (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-lg border-b border-slate-800 pb-3">
                    <GraduationCap className="w-6 h-6" />
                    <h3>{t.trainingPage.formTitle}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.firstName} *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.lastName} *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.dob}</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.gov} *</label>
                      <select
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {governoratesList.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.mun}</label>
                      <input
                        type="text"
                        value={formData.municipality}
                        onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.phone} *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+216 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.experience}</label>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="radio"
                          name="exp"
                          checked={formData.hasExperience === true}
                          onChange={() => setFormData({ ...formData, hasExperience: true })}
                        />
                        <span>{t.trainingPage.yes}</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="radio"
                          name="exp"
                          checked={formData.hasExperience === false}
                          onChange={() => setFormData({ ...formData, hasExperience: false })}
                        />
                        <span>{t.trainingPage.no}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.trainingPage.queries}</label>
                    <textarea
                      rows={2}
                      value={formData.questions}
                      onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-sm shadow-xl hover:opacity-90 transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Generating Official Pass..." : t.trainingPage.submitReg}
                  </button>
                </form>
              ) : (
                /* Generated Digital Pass Voucher */
                <div className="space-y-6 text-center">
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.3)] space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="text-left rtl:text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                          {t.trainingPage.passTitle}
                        </span>
                        <h3 className="text-base font-black text-white">
                          AuSecours Academy Tunisia
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 text-[10px] font-black uppercase">
                        ✓ CONFIRMED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left rtl:text-right text-xs py-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Candidate:</span>
                        <strong className="text-white text-sm">{generatedPass.firstName} {generatedPass.lastName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Governorate:</span>
                        <strong className="text-white">{generatedPass.governorate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pass Code:</span>
                        <strong className="text-amber-400 font-mono">{generatedPass.passCode}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Instructor:</span>
                        <strong className="text-white">Louay Mansouri</strong>
                      </div>
                    </div>

                    {/* QR Code Mockup */}
                    <div className="p-4 rounded-2xl bg-white text-black max-w-[160px] mx-auto flex flex-col items-center">
                      <QrCode className="w-24 h-24" />
                      <span className="text-[10px] font-mono font-bold mt-1">{generatedPass.passCode}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Pass</span>
                    </button>
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        setGeneratedPass(null);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
