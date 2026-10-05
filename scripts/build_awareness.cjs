const fs = require('fs');

const awarenessTips = [
  {
    id: "tip-heatwave",
    category: "heatwave",
    colorTheme: "yellow",
    icon: "Sun",
    weatherCondition: "High Heat & Sirocco (Chhili)",
    title: {
      en: "Tunisian Heatwave & Sirocco (Chhili) Alert",
      fr: "Alerte Canicule et Sirocco (Chhili)",
      ar: "تحذير موجة الحر الشديدة والشهيلي في تونس",
      tn: "رد بالك من الشهيلي وسخانة الصيف"
    },
    content: {
      en: "Drink at least 2.5L water daily. Keep vulnerable elderly & infants indoors between 11 AM and 5 PM. If someone stops sweating with red hot skin, cool them immediately and call 198.",
      fr: "Hydratez-vous (2,5L d'eau/jour). Gardez les personnes fragiles à l'abri entre 11h et 17h. En cas de coup de chaleur (peau sèche et brûlante), refroidissez et appelez le 198.",
      ar: "اشرب ما لا يقل عن 2.5 لتر ماء يومياً. تجنب خروج كبار السن والأطفال بين 11 صباحاً و 5 مساءً. في حال ظهور أعراض ضربة الشمس (احمرار وتوقف التعرق)، برّد المصاب واتصل بـ 198.",
      tn: "اشرب برشة ماء (2.5 لتر في النهار). ما تخرجش الكبار والصغار في القايلة بين الـ 11 والـ 5. كان حد حس بضربة شمس بدنو سخن برشة صب عليه ماء واطلب 198."
    }
  },
  {
    id: "tip-floods",
    category: "flooding",
    colorTheme: "cyan",
    icon: "CloudRain",
    weatherCondition: "Severe Rain & Wadi Flooding",
    title: {
      en: "Flash Flood & Wadi Precautions",
      fr: "Crues des Oueds et Pluies Torrentielles",
      ar: "احتياطات فيضان الأودية والأمطار الغزيرة",
      tn: "رد بالك من فيضان الوديان وقت المطر القوية"
    },
    content: {
      en: "Never attempt to drive or walk across flooded wadi crossings (Majerda, Meliane, etc.). Just 30cm of moving water can sweep away a car. Stay on high ground and monitor civil protection warnings.",
      fr: "Ne traversez JAMAIS un oued en crue en voiture ou à pied. 30 cm d'eau en mouvement suffisent pour emporter un véhicule. Restez en hauteur et suivez la Protection Civile.",
      ar: "إياك ومحاولة عبور مجاري الأودية المغمورة بالمياه بالسيارة أو سيراً على الأقدام. 30 سم من المياه الجارية تكفي لجرف سيارة كاملة. الزم الأماكن المرتفعة وتابع تنبيهات الحماية المدنية.",
      tn: "رد بالك تقص واد معبي بالماء بكرهبتك وإلا على ساقيك. راهو 30 صانتي ماء يجرف كرهبة كاملة. ابقى في بلاصة عالية وتبع بلاغات الحماية المدنية."
    }
  },
  {
    id: "tip-road",
    category: "road",
    colorTheme: "pink",
    icon: "Car",
    title: {
      en: "Highway & Road Accident Protocol (PAS)",
      fr: "Accident de la Route : Règle P.A.S.",
      ar: "حوادث الطرق: قاعدة الحماية والإبلاغ والإسعاف (P.A.S)",
      tn: "شنوة تعمل كي تشوف حادث كرهبة في الطريق"
    },
    content: {
      en: "1. Protect (Turn on hazard lights, wear vest, place triangle 100m away). 2. Alert (Call 198 or 193 with highway marker). 3. Succor (Never remove helmet of motorcyclist unless not breathing).",
      fr: "1. Protéger (Feux de détresse, gilet, triangle à 100m). 2. Alerter (Appelez le 198 ou 193 avec point kilométrique). 3. Secourir (Ne retirez JAMAIS le casque d'un motard).",
      ar: "1. الحماية (تشغيل أضواء الخطر، ارتداء السترة العاكسة، وضع مثلث التحذير). 2. الإبلاغ (الاتصال بـ 198 أو 193 وتحديد الموقع). 3. الإسعاف (لا تنزع خوذة سائق الدراجة إلا إذا كان لا يتنفس).",
      tn: "1. احمي البلاصة (خدم الـ Detresse وحط المثلث على 100 متر). 2. اطلب النجدة (198 وإلا 193 مع النمرة متاع الأوتوروت). 3. عاون (رد بالك تنحي كاسك متاع موتور كانو يتنفس)."
    }
  },
  {
    id: "tip-gas",
    category: "home",
    colorTheme: "amber",
    icon: "AlertTriangle",
    title: {
      en: "Carbon Monoxide & Gas Leak Safety",
      fr: "Intoxication au Monoxyde de Carbone (Kanoun / Gaz)",
      ar: "الوقاية من القاتل الصامت (الكانون وأول أكسيد الكربون)",
      tn: "رد بالك من غاز الكانون والشوديار (القاتل الصامت)"
    },
    content: {
      en: "Never use traditional charcoal braziers (Kanoun) inside sealed bedrooms. Ensure proper bathroom heater ventilation. In case of headache/dizziness: ventilate room immediately and move to fresh air.",
      fr: "N'utilisez jamais de Kanoun dans des pièces fermées. Assurez une aération permanente des chauffe-eaux. En cas de vertiges : aérez et sortez immédiatement à l'air libre.",
      ar: "لا تشعل الكانون داخل غرف النوم المغلقة أبداً. تأكد من تهوية سخانات الغاز في الحمامات. عند الشعور بدوار أو صداع: افتح النوافذ فوراً واخرج للهواء الطلق.",
      tn: "رد بالك تدخل كانون شاعل لبيت النوم مسكرة. ديما خلي شباك الحمام منفس للشوديار. كان حسيت بدوخة وإلا وجيعة راس حل الشبابك واخرج للهواء النقي فيسع."
    }
  }
];

const trueFalseTrivia = [
  {
    id: "tf-1",
    isTrue: false,
    category: "burns",
    statement: {
      en: "You should apply butter, oil, or toothpaste to soothe a severe burn.",
      fr: "Il faut appliquer du beurre, de l'huile ou du dentifrice sur une brûlure grave.",
      ar: "يجب وضع الزبدة، الزيت أو معجون الأسنان لتهدئة الحروق الشديدة.",
      tn: "لازم تحط زبدة، زيت وإلا معجون أسنان باش تداوي حرق قوي."
    },
    explanation: {
      en: "FALSE! Butter, oil, and toothpaste trap heat in the skin, severely deepen tissue destruction, and cause life-threatening bacterial infections. Only use clean, cool running water.",
      fr: "FAUX ! Ces substances emprisonnent la chaleur, aggravent la brûlure et provoquent de graves surinfections. Seule l'eau courante fraîche est efficace.",
      ar: "خطأ فادح! هذه المواد تحبس الحرارة داخل الجلد وتزيد من عمق تلف الأنسجة وتسبب تلوثاً بكتيرياً خطيراً. العلاج الصحيح الوحيد هو الماء الجاري المعتدل لمدة 20 دقيقة.",
      tn: "غالط ورد بالك! الزبدة والمعجون يحصرو السخانة في وسط اللحم ويزيدو يعفنو الحرق. الصحيح تصب ماء عادي متاع سبالة بارد لمدة 20 دقيقة."
    }
  },
  {
    id: "tf-2",
    isTrue: false,
    category: "nosebleed",
    statement: {
      en: "When a person has a nosebleed, they should tilt their head backward.",
      fr: "En cas de saignement de nez, il faut pencher la tête en arrière.",
      ar: "عند حدوث نزيف في الأنف (الرعاف)، يجب إرجاع الرأس للخلف.",
      tn: "كي يبدا خشمك ينزف بالدم، لازم ترجع راسك لتالي."
    },
    explanation: {
      en: "FALSE! Tilting head back causes blood to flow down the throat into the stomach or airways, leading to choking and vomiting. Lean slightly FORWARD and pinch the soft part of the nose for 10 minutes.",
      fr: "FAUX ! Pencher la tête en arrière fait couler le sang dans la gorge et l'estomac, risquant l'étouffement. Penchez-vous en AVANT et pincez le nez 10 minutes.",
      ar: "خطأ شائع! إرجاع الرأس للخلف يجعل الدم يتدفق إلى البلعوم والمعدة مما قد يسبب الاختناق أو القيء. الصحيح هو إمالة الرأس للأمام والضغط على جانبي الأنف لمدة 10 دقائق متواصلة.",
      tn: "غالط! كي ترجع راسك لتالي الدم يهبط في قرجومتك ومعدتك وتنجم تتقيا وتتشرق. الصحيح ميل راسك للقدام واكبس على خشمك لمدة 10 دقائق."
    }
  },
  {
    id: "tf-3",
    isTrue: true,
    category: "cpr",
    statement: {
      en: "Hands-Only CPR (continuous chest compressions without rescue breaths) saves lives for adult cardiac arrest.",
      fr: "Le massage cardiaque seul (sans bouche-à-bouche) est extrêmement efficace pour sauver un adulte en arrêt cardiaque.",
      ar: "الضغطات الصدرية المستمرة وحدها (بدون تنفس صناعي) كافية لإنقاذ حياة البالغين عند توقف القلب.",
      tn: "تدليك القلب والضغطات الصدرية وحدها من غير فم لفم تسلك الروح في توقف القلب."
    },
    explanation: {
      en: "TRUE! Compressions keep oxygenated blood circulating to the brain. Hands-Only CPR is the modern standard for untrained bystanders and avoids deadly interruptions.",
      fr: "VRAI ! Les compressions continues maintiennent la circulation du sang oxygéné vers le cerveau. C'est la priorité absolue recommandée.",
      ar: "صحيح تماماً! الضغطات الصدرية المستمرة تحافظ على تدفق الدم المشبع بالأكسجين إلى الدماغ وهي التوصية العالمية الأولى للمسعفين غير المتخصصين.",
      tn: "صحيح 100%! النزلات المتواصلة على الصدر تخلي الدم يوصل للمخ وتمنع الموت الدماغي وهي أهم خطوة في الإسعاف."
    }
  },
  {
    id: "tf-4",
    isTrue: false,
    category: "seizure",
    statement: {
      en: "You should put a spoon or hard object in the mouth of a person having an epileptic seizure to prevent them swallowing their tongue.",
      fr: "Il faut mettre une cuillère ou un objet dans la bouche d'une personne en crise d'épilepsie pour qu'elle n'avale pas sa langue.",
      ar: "يجب وضع ملعقة أو جسم صلب داخل فم مريض الصرع أثناء النوبة لمنعه من بلع لسانه.",
      tn: "لازم تحط مغرفة وإلا حاجة في فم مريض الصرع باش ما يبلعش لسانو."
    },
    explanation: {
      en: "FALSE & DANGEROUS! It is anatomically impossible to swallow one's tongue. Inserting objects can break teeth, cause jaw fractures, and block the airway. Simply protect the head and turn them on their side (PLS) after seizures stop.",
      fr: "FAUX ET DANGEREUX ! On ne peut pas avaler sa langue. Insérer un objet peut briser les dents et étouffer la victime. Protégez simplement sa tête et mettez-la en PLS après la crise.",
      ar: "خطأ خطير جداً! من المستحيل تشريحياً بلع اللسان. وضع أي جسم في الفم قد يكسر الأسنان ويسد مجرى التنفس. الصحيح هو حماية الرأس بوسادة ووضع المصاب في وضعية الإفاقة الجانبية (PLS) بعد انتهاء التشنج.",
      tn: "غالط وخطير برشة! ما فماش حاجة اسمها بلعان لسان، وكي تحط مغرفة تنجم تكسرلو سنيه وتخنقو. الصحيح حط مخدة تحت راسو وكي توفى النوبة دورو على جنبو في وضع الإفاقة."
    }
  }
];

const emergencyNumbers = [
  {
    id: "num-198",
    number: "198",
    category: "civil_defense",
    color: "#EF4444",
    badge: "Protection Civile",
    icon: "ShieldAlert",
    name: {
      en: "Civil Protection (Ambulance & Fire)",
      fr: "Protection Civile (Ambulance & Incendie)",
      ar: "الحماية المدنية (الإسعاف والإنقاذ والإطفاء)",
      tn: "الحماية المدنية (آمبيلونس وحرايق)"
    },
    description: {
      en: "National rescue corps for medical emergencies, traffic collisions, fires, natural disasters, and drowning rescue.",
      fr: "Corps national de secours pour urgences médicales, accidents de la route, incendies et sauvetage.",
      ar: "جهاز الإنقاذ الوطني للإسعاف الطبي، حوادث الطرق، الحرائق، الكوارث الطبيعية والإنقاذ البحري.",
      tn: "سلك النجدة الأول في تونس لحوادث الكراهب، الحرائق، الحالات الاستعجالية والإنقاذ."
    }
  },
  {
    id: "num-190",
    number: "190",
    category: "medical",
    color: "#10B981",
    badge: "SAMU 190",
    icon: "HeartPulse",
    name: {
      en: "SAMU Emergency Medical Assistance",
      fr: "SAMU (Service d'Aide Médicale Urgente)",
      ar: "الإسعاف الطبي الاستعجالي (SAMU)",
      tn: "السامي (الإسعاف الطبي السريع SAMU)"
    },
    description: {
      en: "Doctor-staffed mobile intensive care units (SMUR) for acute cardiac arrest, strokes, respiratory failure, and severe trauma.",
      fr: "Unités mobiles de réanimation (SMUR) avec médecin urgentiste pour arrêts cardiaques, AVC et détresses vitales.",
      ar: "سيارات الإنعاش الطبي المجهزة بطواقم وأطباء طوارئ للسكتات القلبية، الجلطات الدماغية والإصابات الحرجة.",
      tn: "سيارات إنعاش طبي مجهزة بطبيب استعجالي للأزمات القلبية والجلطات والحالات الخطيرة."
    }
  },
  {
    id: "num-197",
    number: "197",
    category: "security",
    color: "#3B82F6",
    badge: "Police Secours",
    icon: "ShieldCheck",
    name: {
      en: "Police Secours (Urban Security)",
      fr: "Police Secours (Zones Urbaines)",
      ar: "شرطة النجدة (المناطق الحضرية والمدن)",
      tn: "شرطة النجدة (في المدن والبلديات)"
    },
    description: {
      en: "Urban emergency police response, assault intervention, road traffic safety, and urgent public protection.",
      fr: "Intervention d'urgence en milieu urbain, agressions, sécurité routière et maintien de l'ordre.",
      ar: "التدخل الأمني العاجل في المدن، مكافحة الجريمة، حماية المواطنين وحوادث السير.",
      tn: "التدخل الأمني السريع في المدن، النجدة من الاعتداءات وحماية العباد."
    }
  },
  {
    id: "num-193",
    number: "193",
    category: "security",
    color: "#8B5CF6",
    badge: "Garde Nationale",
    icon: "Shield",
    name: {
      en: "National Guard (Highways & Rural Areas)",
      fr: "Garde Nationale (Autoroutes & Zones Rurales)",
      ar: "الحرس الوطني (الطرق السيارة والمناطق الريفية والحدودية)",
      tn: "الحرس الوطني (الأوتوروت والريف والولايات)"
    },
    description: {
      en: "Security and emergency response for highways, rural districts, mountain regions, and inter-city transport routes.",
      fr: "Sécurité et secours sur les autoroutes, routes nationales, zones rurales et côtières.",
      ar: "الاستجابة للطوارئ وحوادث الطرق السيارة، المناطق الريفية، الجبلية والشريط الساحلي والحدودي.",
      tn: "الأمن والنجدة في الأوتوروت، الطرقات الوطنية والمناطق الريفية والحدودية."
    }
  },
  {
    id: "num-poison",
    number: "+216 71 574 544",
    category: "specialized",
    color: "#F59E0B",
    badge: "Centre Anti-Poisons",
    icon: "FlaskConical",
    name: {
      en: "Centre Anti-Poisons Tunisie (Toxicology)",
      fr: "Centre Anti-Poisons de Tunis (CAMU)",
      ar: "مركز المساعدة الطبية ومكافحة التسمم (Anti-Poisons)",
      tn: "مركز التسممات والسموم تونس (Anti-Poisons)"
    },
    description: {
      en: "Expert medical toxicologists for chemical ingestion, snake/scorpion venom, drug overdose, and toxic gas exposure.",
      fr: "Assistance médicale spécialisée pour ingestions de produits chimiques, piqûres de scorpion, morsures et intoxications.",
      ar: "استشارات طبية متخصصة للتسمم الدوائي والكيميائي، لدغات العقارب والأفاعي، واستنشاق الغازات السامة.",
      tn: "استشارات طبية سريعة وقت شرب مواد كيميائية، لدغات العقارب، والأدوية والغازات السامة."
    }
  },
  {
    id: "num-sos-medecins",
    number: "+216 71 744 222",
    category: "medical",
    color: "#06B6D4",
    badge: "SOS Médecins",
    icon: "Stethoscope",
    name: {
      en: "SOS Médecins Tunisie (24/7 Home ER)",
      fr: "SOS Médecins Tunisie (24/7 Visite à Domicile)",
      ar: "إس أو إس أطباء تونس (طبيب استعجالي إلى المنزل 24/7)",
      tn: "SOS Médecins (طبيب استعجالي للدار 24/7)"
    },
    description: {
      en: "24/7 on-call emergency physicians dispatching directly to homes and hotels across Greater Tunis and major hubs.",
      fr: "Médecins urgentistes de garde se déplaçant 24h/24 à domicile et en urgence sur le Grand Tunis.",
      ar: "أطباء طوارئ تحت الطلب على مدار 24 ساعة للزيارات المنزلية العاجلة في تونس الكبرى والمناطق الكبرى.",
      tn: "أطباء استعجالي يجوك للدار 24 ساعة في تونس الكبرى والمناطق المجاورة."
    }
  }
];

fs.writeFileSync('src/data/awarenessData.ts', `import { AwarenessTip, TrueFalseTrivia } from '../types';\n\nexport const awarenessTipsData: AwarenessTip[] = ${JSON.stringify(awarenessTips, null, 2)};\n\nexport const trueFalseTriviaData: TrueFalseTrivia[] = ${JSON.stringify(trueFalseTrivia, null, 2)};\n`, 'utf8');
fs.writeFileSync('src/data/emergencyNumbersData.ts', `import { EmergencyNumber } from '../types';\n\nexport const emergencyNumbersData: EmergencyNumber[] = ${JSON.stringify(emergencyNumbers, null, 2)};\n`, 'utf8');
console.log('awarenessData.ts & emergencyNumbersData.ts generated!');
