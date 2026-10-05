export type Language = 'en' | 'fr' | 'ar' | 'tn';

export type TriageLevel = 'critical' | 'urgent' | 'moderate' | 'minor';

export interface EmergencyProtocol {
  id: string;
  category: 'cpr' | 'bleeding' | 'choking' | 'burns' | 'poison' | 'stroke' | 'heart_attack' | 'fracture' | 'seizure' | 'drowning';
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  severity: TriageLevel;
  iconName: string;
  steps: Array<{
    stepNumber: number;
    title: Record<Language, string>;
    instruction: Record<Language, string>;
    warning?: Record<Language, string>;
  }>;
  dos: Record<Language, string[]>;
  donts: Record<Language, string[]>;
  metronomeBpm?: number;
  emergencyCallNumber: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  type: 'CHU' | 'Regional' | 'Private' | 'Specialized' | 'Military';
  lat: number;
  lng: number;
  is24_7: boolean;
  hasPediatricEmergency: boolean;
  hasBurnUnit?: boolean;
  hasCardioUnit?: boolean;
  waitTimeEstimateMin: number;
  distanceKm?: number;
}

export interface AwarenessTip {
  id: string;
  category: 'weather' | 'home' | 'road' | 'health' | 'heatwave' | 'flooding';
  title: Record<Language, string>;
  content: Record<Language, string>;
  colorTheme: 'yellow' | 'cyan' | 'pink' | 'emerald' | 'amber';
  icon: string;
  weatherCondition?: string;
}

export interface TrueFalseTrivia {
  id: string;
  statement: Record<Language, string>;
  isTrue: boolean;
  explanation: Record<Language, string>;
  category: string;
}

export interface EmergencyNumber {
  id: string;
  name: Record<Language, string>;
  number: string;
  description: Record<Language, string>;
  category: 'medical' | 'security' | 'civil_defense' | 'specialized';
  color: string;
  badge: string;
  icon: string;
}

export interface TrainingRegistration {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  governorate: string;
  municipality: string;
  email: string;
  phone: string;
  hasExperience: boolean;
  questions: string;
  registeredAt: string;
  status: 'confirmed' | 'pending';
  passCode: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  triageLevel?: TriageLevel;
  suggestedActions?: string[];
  isVoiceInput?: boolean;
}
