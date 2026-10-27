import { createClient } from '@supabase/supabase-js';
import { TrainingRegistration, Review } from '../types';

const SUPABASE_URL = "https://kXqH4VxJvG15imhqy7dwiw.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Safely initialize Supabase client only if a valid key is provided, otherwise null
export const supabase = SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEY_REGISTRATIONS = 'ausecours_registrations';
const STORAGE_KEY_REVIEWS = 'ausecours_reviews';

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Dr. Karim Ben Salah",
    rating: 5,
    comment: "Excellent platform! The 3D hospital radar and instant CPR instructions are crucial for saving lives during the critical golden hour in Tunisia.",
    location: "Tunis (Ariana)",
    date: "2026-08-28",
    verified: true
  },
  {
    id: "rev-2",
    userName: "Sarra Trabelsi",
    rating: 5,
    comment: "I attended Captain Louay Mansouri's First Aid training session in Sousse. The practical mannequin workshop and AED guidance gave me full confidence.",
    location: "Sousse (Sahloul)",
    date: "2026-08-24",
    verified: true
  },
  {
    id: "rev-3",
    userName: "Ahmed Mehiri",
    rating: 5,
    comment: "التطبيق ساعدني في إسعاف زميلي وقت اختناق مفاجئ في الملعب بفضل مناورة هيمليك المباشرة. شكراً للمؤطر لؤي المنصوري!",
    location: "Sfax",
    date: "2026-08-19",
    verified: true
  },
  {
    id: "rev-4",
    userName: "Yassine Gharbi",
    rating: 5,
    comment: "تطبيق متكامل وسريع برشة وفيه نومروات الحماية والسامي الكل بالوقت مع رادار السبيطارات. يعطيك الصحة لؤي!",
    location: "Bizerte",
    date: "2026-08-15",
    verified: true
  }
];

export async function saveTrainingRegistration(data: Omit<TrainingRegistration, 'id' | 'registeredAt' | 'status' | 'passCode'>): Promise<TrainingRegistration> {
  const newReg: TrainingRegistration = {
    ...data,
    id: 'REG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    registeredAt: new Date().toISOString(),
    status: 'confirmed',
    passCode: 'PASS-TN-' + Math.floor(100000 + Math.random() * 900000)
  };

  if (supabase) {
    try {
      await supabase.from('training_registrations').insert([newReg]);
    } catch (e) {
      console.warn("Supabase remote save fallback to localStorage:", e);
    }
  }

  // Local storage backup
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTRATIONS) || '[]');
  existing.unshift(newReg);
  localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(existing));

  return newReg;
}

export function getLocalRegistrations(): TrainingRegistration[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTRATIONS) || '[]');
}

export async function submitReview(review: Omit<Review, 'id' | 'date' | 'verified'>): Promise<Review> {
  const newReview: Review = {
    ...review,
    id: 'REV-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    verified: true
  };

  if (supabase) {
    try {
      await supabase.from('reviews').insert([newReview]);
    } catch (e) {
      console.warn("Supabase review submit fallback:", e);
    }
  }

  const existing = getReviews();
  existing.unshift(newReview);
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(existing));

  return newReview;
}

export function getReviews(): Review[] {
  const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_REVIEWS;
  }
}
