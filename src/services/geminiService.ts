import { Language, TriageLevel } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPTS: Record<Language, string> = {
  en: `You are the certified Emergency AI Paramedic Technician for "AuSecours - النجدة" in Tunisia.
Your mission is to deliver IMMEDIATE, LIFESAVING, and HIGHLY CONCISE first aid instructions.
Rules:
1. Be calm, authoritative, and fast. No fluff, no long introductions.
2. Structure your answer:
   - IMMEDIATE ACTION: 2-3 numbered critical steps.
   - WHAT NOT TO DO: 1-2 fatal mistakes to avoid.
   - DISPATCH ADVICE: Remind to dial 198 (Protection Civile) or 190 (SAMU) if ambulance is required.
3. Keep responses under 90 words for rapid crisis comprehension.
4. If the situation is life-threatening (unconscious, not breathing, massive bleed, severe choking), start with [CRITICAL].`,

  fr: `Vous êtes le Technicien Régulateur d'Urgence IA pour "AuSecours - النجدة" en Tunisie.
Votre mission est de délivrer des instructions de premiers secours IMMÉDIATES, VITALES et TRÈS CONCISES.
Règles :
1. Soyez calme, direct et précis. Aucun bavardage inutile.
2. Structurez la réponse :
   - ACTIONS IMMÉDIATES : 2-3 étapes prioritaires numérotées.
   - À NE PAS FAIRE : 1-2 erreurs fatales à proscrire.
   - APPEL SECOURS : Rappelez le 198 (Protection Civile) ou le 190 (SAMU).
3. Réponses courtes (moins de 90 mots) adaptées au stress de l'urgence.
4. Si détresse vitale immédiate, débutez par [CRITIQUE].`,

  ar: `أنت تقني ومسعف الطوارئ الذكي المعتمد لمنصة "AuSecours - النجدة" في تونس.
مهمتك تقديم إرشادات إسعاف أولي فورية ومنقذة للحياة وموجزة جداً.
القواعد:
1. كن هادئاً وحاسماً ومباشراً بدون أي مقدمات طويلة.
2. نسق الإجابة كالتالي:
   - الخطوات الفورية: 2 إلى 3 خطوات مرقمة واضحة.
   - تحذيرات قاتلة: 1 إلى 2 أخطاء شائعة ممنوعة.
   - الاتصال بالإسعاف: ذكر بالاتصال بـ 198 (الحماية المدنية) أو 190 (الإسعاف الطبي SAMU).
3. اجعل الإجابة أقل من 90 كلمة لسرعة القراءة في حالات الهلع.
4. إذا كانت الحالة خطيرة جداً ابدأ بـ [حالة حرجة].`,

  tn: `أنت المسعف الذكي المباشر لمنصة "AuSecours - النجدة" في تونس.
مهمتك تعطي تعليمات إسعاف سريعة وفورية باش تعتق الروح فيسع بالدارجة التونسية المفهومة.
القواعد:
1. احكي بوضوح وهدوء وبالدارجة التونسية القريبة للقلب ومن غير كلام زايد.
2. قسم الإجابة:
   - شنوة تعمل توة: 2 وإلا 3 خطوات فيسع فيسع.
   - رد بالك تعمل: غلطة قاتلة ما يلزمكش تعملها.
   - طلب النجدة: فكرو يطلب 198 (الحماية المدنية) وإلا 190 (السامي SAMU).
3. إجابة قصيرة وخفيفة (أقل من 80 كلمة).
4. كان الحالة خطيرة ابدا بـ [استعجال خطير].`
};

// Fallback response engine if network is down or API limits
const FALLBACK_TRIAGE: Record<string, Record<Language, string>> = {
  cpr: {
    en: "[CRITICAL] 1. Put victim on back on floor. 2. Push hard and fast in center of chest (110 BPM, 5-6 cm deep). 3. Keep going until paramedics arrive. Call 198 or 190 now!",
    fr: "[CRITIQUE] 1. Allongez la victime au sol sur le dos. 2. Massez au centre de la poitrine (110 BPM, 5-6 cm de profondeur). 3. Ne relâchez pas jusqu'à l'arrivée des secours. Appelez le 198 ou 190 !",
    ar: "[حالة حرجة] 1. ضع المصاب على ظهره فوق سطح صلب. 2. اضغط بقوة وبسرعة في منتصف الصدر (110 ضغطة/دقيقة بعمق 5-6 سم). 3. لا تتوقف حتى وصول الإسعاف. اتصل بـ 198 أو 190 فوراً!",
    tn: "[استعجال خطير] 1. حط المريض فوق القاعة على ظهرو. 2. انزل بقوة وبسرعة في وسط صدرو (110 دقة في الدقيقة). 3. ما تحبسش حتى يوصل الإسعاف. اطلب 198 وإلا 190 توة توة!"
  },
  choking: {
    en: "[CRITICAL] 1. Lean victim forward. 2. Give 5 firm back blows between shoulder blades. 3. If still choking, give 5 inward & upward abdominal thrusts (Heimlich). Call 198.",
    fr: "[CRITIQUE] 1. Penchez la victime en avant. 2. Donnez 5 claques dans le dos entre les omoplates. 3. Si bloqué, faites 5 compressions abdominales de Heimlich vers l'arrière et le haut. Appelez le 198.",
    ar: "[حالة حرجة] 1. أمِل المصاب للأمام. 2. اضرب 5 ضربات قوية بين لوحي الكتف. 3. إذا لم يخرج الجسم، قم بـ 5 ضغطات بطنية (هيمليك) للداخل والأعلى. اتصل بـ 198.",
    tn: "[استعجال خطير] 1. ميل المريض للقدام. 2. اعطيه 5 ضربات باهين في ظهرو بين كتافو. 3. كان ما تسرحش اعملو 5 نزلات هيمليك في فم المعدة لفوق ولداخل. اطلب 198."
  },
  bleeding: {
    en: "[URGENT] 1. Press firmly and directly on wound with clean cloth. 2. Bandage tightly. Do NOT remove first soaked cloth. 3. Keep victim warm and lying down. Call 198.",
    fr: "[URGENT] 1. Appuyez très fort directement sur la plaie avec un tissu propre. 2. Bandez fermement sans retirer le premier linge. 3. Gardez la victime allongée et au chaud. Appelez le 198.",
    ar: "[عاجل] 1. اضغط بقوة وبشكل مباشر على الجرح بقماش نظيف. 2. اربط ضمادة محكمة ولا تنزع القماش الأول. 3. اجعل المصاب مستلقياً ودافئاً. اتصل بـ 198.",
    tn: "[عاجل] 1. انزل بكبس وقوة عل الجرح بقماش نظيف. 2. اربط فاصمة كابسة وما تنحيش القماش الأول. 3. رقد المريض وغطيه. اطلب 198."
  },
  burns: {
    en: "[URGENT] 1. Cool under running tap water for 20 continuous minutes. 2. Remove rings/belts. 3. Cover loosely with clean plastic wrap. Do NOT use ice, butter, or toothpaste. Call 198.",
    fr: "[URGENT] 1. Refroidissez sous l'eau courante pendant 20 minutes. 2. Retirez bagues et ceintures. 3. Couvrez d'un film plastique propre sans serrer. Pas de beurre ni dentifrice. Appelez le 198.",
    ar: "[عاجل] 1. اسكب ماء الصنبور المعتدل على الحرق لمدة 20 دقيقة متواصلة. 2. انزع الخواتم والساعات. 3. غطّه بغلاف بلاستيكي نظيف. لا تضع زبدة أو معجون أسنان. اتصل بـ 198.",
    tn: "[عاجل] 1. صب ماء السبالة البارد عل الحرق لمدة 20 دقيقة. 2. نحي الخواتم والمنقالة. 3. غطي بالسيلوفان النظيف. رد بالك تحط زبدة وإلا معجون أسنان. اطلب 198."
  },
  default: {
    en: "Stay calm. Ensure your safety first. Describe if victim is conscious, breathing, or bleeding. For urgent ambulance dispatch, dial 198 (Civil Protection) or 190 (SAMU).",
    fr: "Restez calme et assurez votre sécurité. Précisez si la victime respire ou saigne. Pour une ambulance immédiate, composez le 198 (Protection Civile) ou le 190 (SAMU).",
    ar: "حافظ على هدوئك وتأكد من أمان المكان. وضح هل المصاب واعٍ ويتنفس؟ لطلب سيارة إسعاف فورية اتصل بـ 198 (الحماية المدنية) أو 190 (الإسعاف الطبي SAMU).",
    tn: "ريّض روحك وثبت في البلاصة. قولي المريض واعي ويتنفس وإلا لا؟ لطلب الإسعاف السريع اطلب 198 (الحماية المدنية) وإلا 190 (السامي SAMU)."
  }
};

export async function askGeminiEmergencyAssistant(
  prompt: string,
  lang: Language = 'en'
): Promise<{ text: string; triageLevel: TriageLevel }> {
  const lower = prompt.toLowerCase();
  
  let detectedLevel: TriageLevel = 'urgent';
  if (lower.includes('cpr') || lower.includes('unconscious') || lower.includes('breathing') || lower.includes('inconscient') || lower.includes('respire') || lower.includes('arrêt') || lower.includes('وعي') || lower.includes('تنفس') || lower.includes('قلب') || lower.includes('ماساج')) {
    detectedLevel = 'critical';
  } else if (lower.includes('chok') || lower.includes('étouff') || lower.includes('شرق') || lower.includes('خنق') || lower.includes('غصة')) {
    detectedLevel = 'critical';
  } else if (lower.includes('bleed') || lower.includes('sang') || lower.includes('نزيف') || lower.includes('دم') || lower.includes('stroke') || lower.includes('avc') || lower.includes('جلطة')) {
    detectedLevel = 'critical';
  }

  // Try real Gemini API call
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPTS[lang]}

User Emergency Input: "${prompt}"
Language to respond in: ${lang} (if tn, use Tunisian Arabic Derja). Provide immediate direct triage advice:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 250,
          topP: 0.8,
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return { text: text.trim(), triageLevel: detectedLevel };
      }
    }
  } catch (error) {
    console.warn("Gemini API direct call returned error, switching to emergency triage rules engine:", error);
  }

  // Fallback intelligent emergency triage matching
  if (lower.includes('cpr') || lower.includes('unconscious') || lower.includes('inconscient') || lower.includes('وعي') || lower.includes('ماساج')) {
    return { text: FALLBACK_TRIAGE.cpr[lang], triageLevel: 'critical' };
  }
  if (lower.includes('chok') || lower.includes('étouff') || lower.includes('شرق') || lower.includes('غصة') || lower.includes('خنق')) {
    return { text: FALLBACK_TRIAGE.choking[lang], triageLevel: 'critical' };
  }
  if (lower.includes('bleed') || lower.includes('sang') || lower.includes('نزيف') || lower.includes('دم')) {
    return { text: FALLBACK_TRIAGE.bleeding[lang], triageLevel: 'critical' };
  }
  if (lower.includes('burn') || lower.includes('brûl') || lower.includes('حرق') || lower.includes('تحرق')) {
    return { text: FALLBACK_TRIAGE.burns[lang], triageLevel: 'urgent' };
  }

  return { text: FALLBACK_TRIAGE.default[lang], triageLevel: detectedLevel };
}
