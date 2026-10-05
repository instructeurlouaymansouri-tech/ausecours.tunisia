import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Review } from '../types';
import { translations } from '../i18n/translations';
import { getReviews, submitReview } from '../services/supabaseService';
import { Star, MessageSquare, Plus, CheckCircle, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewsSectionProps {
  currentLang: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setReviewsList(getReviews());
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    const newRev = await submitReview({
      userName,
      location: location || 'Tunisia',
      rating,
      comment
    });

    setReviewsList(prev => [newRev, ...prev]);
    setSubmitted(true);
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setUserName('');
      setLocation('');
      setComment('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-black uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified User Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.reviewsPage.heading}
          </h2>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.reviewsPage.leaveReview}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviewsList.map((rev) => (
          <motion.div
            key={rev.id}
            whileHover={{ y: -4 }}
            className="glass-panel p-5 rounded-3xl border border-slate-700/80 hover:border-red-500/50 shadow-xl flex flex-col justify-between space-y-3 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic mb-3">
                "{rev.comment}"
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-xs">
              <div>
                <strong className="text-white block font-bold">{rev.userName}</strong>
                <span className="text-[10px] text-slate-400">{rev.location}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                ✓ Verified
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0c101c] border border-red-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    <span>{t.reviewsPage.leaveReview}</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.reviewsPage.yourName} *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.reviewsPage.yourLocation}</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Sousse, Tunis, Sfax"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.reviewsPage.rating}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setRating(num)}
                          className="p-1 text-amber-400 cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${num <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">{t.reviewsPage.comment} *</label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm shadow-xl hover:opacity-90 transition-all cursor-pointer"
                  >
                    {t.reviewsPage.submit}
                  </button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-black text-white">{t.reviewsPage.thankYou}</h4>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
