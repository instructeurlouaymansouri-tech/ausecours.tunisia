const fs = require('fs');

const protocols = [
  {
    id: "proto-cpr",
    category: "cpr",
    severity: "critical",
    iconName: "HeartPulse",
    emergencyCallNumber: "190",
    metronomeBpm: 110,
    title: {
      en: "CPR (Cardiopulmonary Resuscitation)",
      fr: "RCR (Réanimation Cardio-Respiratoire)",
      ar: "الإنعاش القلبي الرئوي (CPR)",
      tn: "ماساج كاردياك (الإنعاش القلبي)"
    },
    subtitle: {
      en: "Victim is unconscious, unresponsive, and not breathing normally.",
      fr: "Victime inconsciente, ne répond pas et ne respire pas normalement.",
      ar: "المصاب فاقد للوعي تماماً ولا يتنفس بشكل طبيعي.",
      tn: "المريض طايح فاقد الوعي وماهوش قاعد يتنفس جملة."
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Check Safety & Responsiveness",
          fr: "Vérifier la sécurité et la conscience",
          ar: "تأكد من أمان المكان ودرجة الوعي",
          tn: "ثبت في أمان البلاصة وهز كتفو وصيح عليه"
        },
        instruction: {
          en: "Tap shoulders firmly and shout: 'Are you okay?'. Check chest for breathing movement for no more than 10 seconds.",
          fr: "Secouez doucement les épaules et criez : 'Est-ce que vous m'entendez ?'. Observez la poitrine pendant 10 secondes maximum.",
          ar: "هز كتفي المصاب بلطف واسأله بصوت عالٍ: 'هل أنت بخير؟'. راقب حركة الصدر لمدة لا تتجاوز 10 ثوانٍ.",
          tn: "انزل على كتافو وقول بصوت عالي: 'تسمع فيا؟'. راقب صدرو يطلع ويهبط وإلا لا لمدة أقل من 10 ثواني."
        },
        warning: {
          en: "Do not delay compressions if in doubt. Agonal gasps are NOT normal breathing.",
          fr: "Ne perdez pas de temps. Les râles agoniques ne sont PAS une respiration normale.",
          ar: "لا تتأخر في بدء الضغطات إذا كنت غير متأكد. الشهقات المتقطعة ليست تنفساً طبيعياً.",
          tn: "ما تضيعش الوقت. النفس المتقطع بالسيف راهو ماهوش نفس عادي."
        }
      },
      {
        stepNumber: 2,
        title: {
          en: "Call 198 or 190 Immediately",
          fr: "Appeler le 198 ou 190 Immédiatement",
          ar: "اتصل بالحماية المدنية 198 أو الإسعاف 190 فوراً",
          tn: "اطلب الحماية 198 وإلا السامي 190 فيسع"
        },
        instruction: {
          en: "Put phone on speaker. Tell dispatcher: exact address, adult/child victim, unconscious and not breathing.",
          fr: "Mettez le haut-parleur. Indiquez l'adresse exacte, l'état inconscient et sans respiration.",
          ar: "شغل مكبر الصوت. أعط العنوان بدقة وأخبرهم أن المصاب فاقد للوعي وبدون تنفس.",
          tn: "حط التليفون عل السبيكر هاوت بارلور. قلهم البلاصة بالظبط وشخص طايح ما يتنفسش."
        }
      },
      {
        stepNumber: 3,
        title: {
          en: "Hand Placement & Body Posture",
          fr: "Positionnement des Mains & Posture",
          ar: "وضعية اليدين واستقامة الذراعين",
          tn: "حط يديك في وسط الصدر بالظبط"
        },
        instruction: {
          en: "Place heel of one hand in center of bare chest (between nipples). Interlock fingers with other hand. Keep elbows straight.",
          fr: "Placez le talon d'une main au centre de la poitrine nue. Entrecroisez les doigts de l'autre main. Gardez les bras bien droits.",
          ar: "ضع كعب يدك في منتصف الصدر العاري (بين الحلمتين). شبك أصابع اليد الأخرى فوقها واجعل ذراعيك مستقيمتين تماماً.",
          tn: "حط كعب يدك في وسط الصدر بالظبط. حط اليد الأخرى فوقها وشبك صوابعك. خلي يديك واقفين دغريين."
        }
      },
      {
        stepNumber: 4,
        title: {
          en: "Compress Hard & Fast (100-120 BPM)",
          fr: "Compresser Fort et Vite (100-120 BPM)",
          ar: "اضغط بقوة وبسرعة (100-120 ضغطة/دقيقة)",
          tn: "انزل بقوة وبسرعة (110 دقة في الدقيقة)"
        },
        instruction: {
          en: "Push down at least 5-6 cm (2 inches). Allow full chest recoil after each push. Do not stop until ambulance arrives.",
          fr: "Enfoncez de 5 à 6 cm. Laissez la poitrine remonter complètement après chaque poussée. Ne vous arrêtez pas.",
          ar: "اضغط لعمق 5-6 سم. اترك الصدر يرتد لأعلى بالكامل بعد كل ضغطة. استمر بدون توقف حتى وصول الإسعاف.",
          tn: "انزل بعمق 5 إلى 6 صانتي. خلي الصدر يعاود يرجع بعد كل نزلة. ما تقصش جملة حتى يوصل الإسعاف."
        }
      }
    ],
    dos: {
      en: [
        "Place victim on a firm, flat surface (floor, not bed).",
        "Compress at a rhythm of 100-120 BPM (use built-in metronome).",
        "Let chest recoil completely between compressions.",
        "Switch rescuers every 2 minutes if tired to maintain depth."
      ],
      fr: [
        "Allongez la victime sur une surface rigide (au sol, jamais sur un lit).",
        "Compressez au rythme de 100 à 120 battements par minute.",
        "Laissez le thorax remonter complètement à chaque poussée.",
        "Relayez-vous toutes les 2 minutes pour garder une efficacité maximale."
      ],
      ar: [
        "ضع المصاب على سطح صلب ومستوٍ (الأرضية وليس السرير).",
        "اضغط بإيقاع منتظم 100 إلى 120 ضغطة في الدقيقة.",
        "دع الصدر يرتفع تماماً بعد كل ضغطة قبل النزول مجدداً.",
        "تبادل الأدوار مع شخص آخر كل دقيقتين لتفادي الإجهاد."
      ],
      tn: [
        "حط المصاب فوق قاعة يابسة ومستوية (فوق القاعة موش فوق الفرش).",
        "انزل بريتم سريع ومنتظم 110 دقة في الدقيقة (استعمل الميترونوم).",
        "خلي الصدر يرجع بلاصتو قبل ما تعاود تنزل.",
        "بدل مع شكون كل دقيقتين باش ما تتعبش والنزلة تبقى قوية."
      ]
    },
    donts: {
      en: [
        "DO NOT interrupt compressions for more than 10 seconds.",
        "DO NOT perform rescue breaths if untrained (Hands-Only CPR is superior).",
        "DO NOT lean on victim's chest between compressions.",
        "DO NOT give up until medical professionals take over."
      ],
      fr: [
        "N'INTERROMPEZ PAS les compressions plus de 10 secondes.",
        "NE FAITES PAS de bouche-à-bouche si non formé (le massage seul suffit).",
        "NE RESTEZ PAS appuyé sur le thorax entre deux compressions.",
        "N'ABANDONNEZ PAS avant l'arrivée de l'équipe médicale."
      ],
      ar: [
        "إياك أن توقف الضغطات لأكثر من 10 ثوانٍ مطلقاً.",
        "لا تضيع الوقت في التنفس الصناعي إذا لم تكن متدرباً (الضغطات الصدرية وحدها كافية).",
        "لا تبقَ متكئاً على صدر المصاب بين الضغطات.",
        "لا تستسلم أو تتوقف حتى يستلم المسعفون المهمة."
      ],
      tn: [
        "رد بالك تقص عل النزلات أكثر من 10 ثواني.",
        "ما تضيعش الوقت في فم لفم كانك موش متدرب (الماساج وحدو يسلك الروح).",
        "ما تبقاش متكي ومثقل على صدرو بين النزلة والأخرى.",
        "ما تسلمش جملة حتى يوصل الحماية أو طبيب السامي."
      ]
    }
  },
  {
    id: "proto-choking",
    category: "choking",
    severity: "critical",
    iconName: "Wind",
    emergencyCallNumber: "198",
    title: {
      en: "Severe Choking (Airway Obstruction)",
      fr: "Étouffement / Obstruction Aiguë des Voies Aériennes",
      ar: "الغصة والاختناق الشديد (انسداد مجرى الهواء)",
      tn: "الشرقة القوية والغصة (تسريح القرجومة)"
    },
    subtitle: {
      en: "Victim cannot speak, breathe, or cough loudly, clutching their throat.",
      fr: "La victime ne peut plus parler, respirer ni tousser, et porte les mains à son cou.",
      ar: "المصاب لا يستطيع الكلام أو التنفس أو السعال بقوة ويضع يديه على عنقه.",
      tn: "المريض ما عادش ينجم يتكلم ولا يكح ولا يتنفس وشاد قرجومتو بيديه."
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Assess: Can they cough or speak?",
          fr: "Évaluer : Peut-il tousser ou parler ?",
          ar: "التقييم: هل يستطيع السعال أو الكلام؟",
          tn: "ثبت: ينجم يكح وإلا يتكلم؟"
        },
        instruction: {
          en: "If coughing loudly, encourage them to KEEP COUGHING. If silent and clutching throat, act immediately.",
          fr: "Si la personne tousse fort, encouragez-la à continuer. Si aucun son ne sort, intervenez immédiatement.",
          ar: "إذا كان يسعل بقوة، شجعه على مواصلة السعال. إذا كان صامتاً ولا يستطيع التنفس، ابدأ المناورة فوراً.",
          tn: "كانو يكح مليح خليه يزيد يكح. كان ساكت وما يخرجش صوت ادخل فيسع."
        }
      },
      {
        stepNumber: 2,
        title: {
          en: "5 Firm Back Blows",
          fr: "5 Claques dans le Dos",
          ar: "5 ضربات حازمة بين لوحي الكتف",
          tn: "5 ضربات باهين بين كتافو من التالي"
        },
        instruction: {
          en: "Stand slightly behind. Lean victim forward. Deliver 5 sharp blows between shoulder blades with heel of hand.",
          fr: "Placez-vous sur le côté. Penchez la victime en avant. Donnez 5 claques vigoureuses entre les omoplates avec le talon de la main.",
          ar: "قف بجانب المصاب ومِل به إلى الأمام. وجّه 5 ضربات قوية بكعب يدك بين لوحي الكتف في الظهر.",
          tn: "اقف في جنبو وميلو للقدام. اعطيه 5 ضربات قويين بكعب يدك في ظهرو بين كتافو."
        }
      },
      {
        stepNumber: 3,
        title: {
          en: "5 Abdominal Thrusts (Heimlich Maneuver)",
          fr: "5 Compressions Abdominales (Heimlich)",
          ar: "5 ضغطات بطنية (مناورة هيمليك)",
          tn: "5 نزلات في فم المعدة (طريقة هيمليك)"
        },
        instruction: {
          en: "Stand behind victim. Make a fist just above navel. Grasp fist with other hand and pull sharply INWARD and UPWARD.",
          fr: "Placez-vous derrière. Placez un poing juste au-dessus du nombril. Saisissez votre poing et tirez fermement vers l'arrière et vers le haut.",
          ar: "قف خلف المصاب. ضع قبضتك فوق السرة مباشرة وأمسكها بيدك الأخرى واضغط بقوة للداخل وللأعلى.",
          tn: "اقف وراه. حط قبضة يدك فوق السرة بشوية. شد قبضتك بيدك الأخرى واكبس بقوة لداخل ولفوق."
        }
      }
    ],
    dos: {
      en: [
        "Lean victim forward so dislodged object falls out rather than deeper.",
        "Alternate 5 back blows and 5 abdominal thrusts.",
        "If victim becomes unconscious, start CPR immediately and look for object in mouth."
      ],
      fr: [
        "Penchez la victime vers l'avant pour que l'objet sorte de la bouche.",
        "Alternez 5 claques dans le dos et 5 compressions abdominales.",
        "Si la victime perd connaissance, allongez-la et commencez la RCR immédiatement."
      ],
      ar: [
        "احرص على إمالة المصاب للأمام حتى يسقط الجسم الغريب للخارج.",
        "بدل بين 5 ضربات ظهرية و 5 ضغطات بطنية بشكل متتابع.",
        "إذا فقد المصاب الوعي، ضعه على الأرض وابدأ الإنعاش القلبي (CPR) فوراً."
      ],
      tn: [
        "ميل المصاب للقدام باش الحاجة اللي واقفتلو تخرج لبرة وما تغرقش.",
        "بدل بين 5 ضربات في الظهر و 5 نزلات في البطن.",
        "إذا طاح فاقد الوعي حطو عل القاعة وابدا الماساج كاردياك فيسع."
      ]
    },
    donts: {
      en: [
        "DO NOT perform blind finger sweeps in mouth (you may push object further).",
        "DO NOT perform abdominal thrusts on infants under 1 year (use back blows & chest thrusts).",
        "DO NOT give liquids while choking."
      ],
      fr: [
        "NE METTEZ PAS les doigts à l'aveugle dans la bouche (risque d'enfoncer l'objet).",
        "NE FAITES PAS de Heimlich abdominal sur un nourrisson de moins d'un an.",
        "NE DONNEZ PAS à boire à une personne qui s'étouffe."
      ],
      ar: [
        "إياك أن تدخل أصابعك بشكل أعمى داخل فم المصاب (قد تدفع الجسم لداخل الحلق).",
        "لا تستخدم ضغطات البطن للرضع الأقل من سنة (استخدم ضربات الظهر وضغطات الصدر).",
        "لا تعطه ماء أو سوائل إطلاقاً أثناء الغصة."
      ],
      tn: [
        "رد بالك تغطس صوابعك في فمو بالعمى (تنجم تزيد تغرق اللقمة).",
        "ما تعملش نزلة البطن لرضيع أقل من عام (اعمل ضربات ظهر ونزلات صدر).",
        "ما تشربوش الماء وهو مشروق."
      ]
    }
  },
  {
    id: "proto-bleeding",
    category: "bleeding",
    severity: "critical",
    iconName: "Droplet",
    emergencyCallNumber: "198",
    title: {
      en: "Severe Arterial & Venous Bleeding",
      fr: "Hémorragie Externe Grave",
      ar: "النزيف الشديد وتدفق الدم الحاد",
      tn: "نزيف قوي برشة ودم يجري"
    },
    subtitle: {
      en: "Spurting or continuous rapid blood flow that does not stop with light pressure.",
      fr: "Écoulement continu et abondant ou jet de sang artériel qui ne s'arrête pas.",
      ar: "تدفق دم مستمر وغزير أو متدفق على شكل نبضات لا يتوقف بالضغط الخفيف.",
      tn: "دم قاعد يخرج بقوة ويسيل برشة وما حبش يحبس."
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Direct Pressure Immediately",
          fr: "Pression Directe Immédiate",
          ar: "الضغط المباشر الفوري على الجرح",
          tn: "انزل بكفك وقوة على بلاصة الجرح"
        },
        instruction: {
          en: "Apply firm, continuous direct pressure over wound using sterile cloth, towel, or gloved bare hand.",
          fr: "Appuyez très fermement et sans relâcher directement sur la plaie avec un tissu propre ou la main.",
          ar: "اضغط بقوة وباستمرار دون توقف على الجرح مباشرة بقطعة قماش نظيفة أو يدك.",
          tn: "انزل بكبس كبير ومن غير ما ترخف فوق الجرح بقطعة قماش نظيفة وإلا بيدك."
        }
      },
      {
        stepNumber: 2,
        title: {
          en: "Maintain Pressure & Bandage",
          fr: "Maintenir et Poser un Pansement Compressif",
          ar: "ربط ضمادة ضاغطة محكمة",
          tn: "اربط فاصمة كابسة فوق القماش"
        },
        instruction: {
          en: "Wrap tightly with bandage. If blood soaks through, DO NOT remove first cloth; add more layers on top.",
          fr: "Enroulez fermement un bandage. Si le sang traverse, NE RETIREZ PAS le premier tissu; ajoutez-en par-dessus.",
          ar: "اربط الضمادة بإحكام. إذا تشربت الدماء، لا تنزع القماش الأول بل أضف طبقات أخرى فوقه.",
          tn: "اربط بالقوي. كان القماش شرب الدم ما تنحيهوش، زيد حط فوقو قماش آخر واربط."
        }
      },
      {
        stepNumber: 3,
        title: {
          en: "Tourniquet for Limb Trauma (If trained)",
          fr: "Garrot pour Hémorragie Massive de Membre",
          ar: "تطبيق العاصبة (Tourniquet) للأطراف عند الضرورة",
          tn: "استعمل الحزام وإلا قارو كان الدم ما حبش يحبس في الساق وإلا اليد"
        },
        instruction: {
          en: "If bleeding on limb is life-threatening and direct pressure fails, apply tourniquet 5-7 cm above wound (never on joint). Note time.",
          fr: "Si l'hémorragie sur un bras ou une jambe menace la vie, posez un garrot 5 à 7 cm au-dessus de la plaie (jamais sur une articulation). Notez l'heure.",
          ar: "في حال كان النزيف في الأطراف شديداً جداً، ضع العاصبة 5-7 سم فوق الجرح (ليس فوق المفصل) وسجل وقت وضعها بدقة.",
          tn: "إذا النزيف قوي برشة في يد وإلا ساق، حط قارو 5 صانتي فوق الجرح وسجل قداش الوقت بالظبط."
        }
      }
    ],
    dos: {
      en: [
        "Keep victim lying down and calm to prevent shock.",
        "Elevate bleeding limb above heart level if no fracture is suspected.",
        "Keep victim warm with blanket or jacket."
      ],
      fr: [
        "Allongez la victime pour éviter le choc circulatoire.",
        "Surélevez le membre si aucune fracture n'est suspectée.",
        "Couvrez la victime pour éviter l'hypothermie."
      ],
      ar: [
        "اجعل المصاب مستلقياً وحافظ على هدوئه لمنع حدوث صدمة دموية.",
        "ارفع الطرف النازف أعلى من مستوى القلب إذا لم يكن هناك كسر.",
        "غطّ المصاب ببطانية أو معطف لحمايته من البرودة وهبوط الحرارة."
      ],
      tn: [
        "رقد المريض وريضو باش ما يدخلش في شوك.",
        "هز الساق وإلا اليد النازفة أعلى من مستوى القلب كان ما فماش كسر.",
        "غطيه بكاشة وإلا فيستة دافية باش بدنو ما يبردش."
      ]
    },
    donts: {
      en: [
        "DO NOT remove embedded knives, glass, or objects (stabilize around them).",
        "DO NOT remove the initial blood-soaked cloth.",
        "DO NOT loosen a tourniquet once applied."
      ],
      fr: [
        "NE RETIREZ JAMAIS un corps étranger planté (couteau, verre).",
        "NE RETIREZ PAS le premier pansement imbibé de sang.",
        "NE DESSERREZ PAS un garrot une fois posé."
      ],
      ar: [
        "إياك ونزع الأجسام المغروزة (سكين، زجاج) بل ثبّت الضماد حولها.",
        "لا تنزع القماش الأول المشبع بالدماء مطلقاً.",
        "لا ترخف أو تفك العاصبة بعد ربطها إلا بمعرفة الطبيب."
      ],
      tn: [
        "رد بالك تنحي موس وإلا بلارة مغروسة، ثبت الفاصمة داير ساير عليها.",
        "ما تنحيش القماش الأول اللي شرب الدم.",
        "ما ترخفش القارو بعد ما كبستو."
      ]
    }
  },
  {
    id: "proto-burns",
    category: "burns",
    severity: "urgent",
    iconName: "Flame",
    emergencyCallNumber: "198",
    title: {
      en: "Thermal & Chemical Burns",
      fr: "Brûlures Thermiques et Chimiques",
      ar: "الحروق الحرارية والكيميائية",
      tn: "الحروق بالنار والزيت والمواد الكيميائية"
    },
    subtitle: {
      en: "Hot liquids, fire, boiling oil, electrical or chemical skin burns.",
      fr: "Liquides bouillants, flammes, huile chaude, brûlures chimiques ou électriques.",
      ar: "حروق ناتجة عن سوائل مغلية، نار، زيت حار، أو مواد كيميائية.",
      tn: "تحرق بماء مغلي، زيت سخون، نار وإلا مواد كيميائية قوية."
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "Cool Water for 20 Minutes (Rule of 20)",
          fr: "Refroidir à l'Eau Tiède 20 Minutes",
          ar: "التبريد بالماء الجاري لمدة 20 دقيقة",
          tn: "صب ماء الحنفية البارد العادي لمدة 20 دقيقة"
        },
        instruction: {
          en: "Immediately run cool tap water (15-25°C) gently over burn for at least 15-20 minutes. Do not use ice.",
          fr: "Faites couler immédiatement de l'eau fraîche du robinet sur la brûlure pendant 15 à 20 minutes. Pas de glaçons.",
          ar: "اسكب ماء الصنبور المعتدل بلطف وبشكل متواصل على مكان الحرق لمدة 15 إلى 20 دقيقة. لا تستخدم الثلج.",
          tn: "صب ماء بارد عادي متاع سبالة عل الحرق لمدة 15 إلى 20 دقيقة. رد بالك تحط ثلج."
        }
      },
      {
        stepNumber: 2,
        title: {
          en: "Remove Constrictive Items & Loose Clothing",
          fr: "Retirer Bijoux et Vêtements Non Adhérents",
          ar: "نزع الخواتم والساعات والملابس غير الملتصقة",
          tn: "نحي الخواتم والمنقالة والقش اللي موش لاصق"
        },
        instruction: {
          en: "Gently remove rings, watches, and belts before swelling starts. Cut clothing around burn, but DO NOT tear stuck fabric.",
          fr: "Retirez bagues et montres avant le gonflement. Découpez les vêtements autour, sans arracher le tissu collé.",
          ar: "انزع الخواتم والأساور قبل حدوث التورم. قص الملابس حول الحرق ولا تنزع الأقمشة الملتصقة بالجلد.",
          tn: "نحي الخاتم والمنقالة فيسع قبل ما يتنفخ. قص الحوايج داير ساير وما تقلعش القماش اللي لاصق في اللحم."
        }
      },
      {
        stepNumber: 3,
        title: {
          en: "Cover with Clean Plastic Film or Sterile Dressing",
          fr: "Couvrir avec Film Alimentaire Propre",
          ar: "التغطية بغلاف بلاستيكي نظيف أو شاش معقم",
          tn: "غطي بفيلم سليوفان نظيف وإلا فاصمة معقمة"
        },
        instruction: {
          en: "Cover loosely with clean plastic cling wrap or sterile non-stick dressing to prevent infection and air contact pain.",
          fr: "Posez délicatement un film plastique alimentaire propre ou une compresse stérile sans serrer.",
          ar: "غط الحرق برفق بطبقة من البلاستيك الغذائي النظيف أو شاش معقم غير لاصق لتخفيف الألم ومنع التلوث.",
          tn: "غطي بشوية بالسيلوفان النظيف وإلا بقماش معقم باش ينقص السطر وما يتعفنش."
        }
      }
    ],
    dos: {
      en: [
        "Cool with running tap water immediately.",
        "Keep victim warm (cooling large areas can cause hypothermia).",
        "Seek emergency care (Ben Arous Burn Center) for burns larger than victim's palm."
      ],
      fr: [
        "Refroidissez à l'eau courante immédiatement.",
        "Réchauffez le reste du corps pour éviter l'hypothermie.",
        "Consultez immédiatement (Centre des Grands Brûlés Ben Arous) si la brûlure dépasse la paume de la main."
      ],
      ar: [
        "برد مكان الحرق بالماء الجاري فور حدوثه.",
        "حافظ على دفء باقي جسم المصاب لتجنب انخفاض الحرارة.",
        "توجه فوراً لمركز الحروق البليغة ببن عروس إذا كان الحرق أكبر من راحة اليد."
      ],
      tn: [
        "برد بماء السبالة فورا.",
        "دفي باقي البدن باش ما يبردش.",
        "امشي لمركز الحروق ببن عروس كان الحرق أكبر من كف اليد."
      ]
    },
    donts: {
      en: [
        "DO NOT apply ice, butter, oil, toothpaste, or coffee powder (fatal infection risk).",
        "DO NOT pop blisters (skin protects against severe infection).",
        "DO NOT rip off clothing stuck to the burn."
      ],
      fr: [
        "N'APPLIQUEZ PAS de glace, beurre, huile, dentifrice ou marc de café.",
        "NE PERCEZ JAMAIS les cloques (risque infectieux majeur).",
        "N'ARRACHEZ PAS les vêtements collés à la peau."
      ],
      ar: [
        "إياك ووضع الثلج، الزبدة، معجون الأسنان، أو مسحوق القهوة (خطر تسمم وتلوث خطير).",
        "لا تفقأ الفقاعات المائية أبداً لأنها تحمي الجلد من البكتيريا.",
        "لا تنزع الملابس الملتصقة بالجرح بقوة."
      ],
      tn: [
        "رد بالك تحط زبدة، معجون أسنان، زيت وإلا قهوة (راهو يعمل تعفن خطير).",
        "ما تطرشقش البنابل والفقاعات متاع الماء جملة.",
        "ما تقلعش القماش اللي لاصق في اللحم المحروق."
      ]
    }
  },
  {
    id: "proto-stroke",
    category: "stroke",
    severity: "critical",
    iconName: "Activity",
    emergencyCallNumber: "190",
    title: {
      en: "Stroke (FAST Test Protocol)",
      fr: "AVC (Accident Vasculaire Cérébral - Test FAST)",
      ar: "السكتة الدماغية والجلطة (اختبار FAST)",
      tn: "الجلطة الدماغية (اختبار الفاست FAST السريع)"
    },
    subtitle: {
      en: "Sudden numbness, weakness on one side, facial droop, slurred speech.",
      fr: "Engourdissement brutal, paralysie d'un côté, déformation de la bouche, parole confuse.",
      ar: "خدر مفاجئ، شلل أو ضعف في جانب واحد من الجسم، اعوجاج الوجه، وصعوبة التحدث.",
      tn: "وجه يتعوج فجأة، يد ترخف وما عادش يهزها، ولسانو يثقال."
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          en: "F - Face Drooping",
          fr: "F - Face / Visage Dévié",
          ar: "F - الوجه (انحراف الفم)",
          tn: "F - الوجه (الفم معوج)"
        },
        instruction: {
          en: "Ask person to smile. Does one side of the face droop or look uneven?",
          fr: "Demandez à la personne de sourire. Un côté du visage s'affaisse-t-il ?",
          ar: "اطلب من الشخص أن يبتسم. هل يرتخي أو ينحرف أحد جانبي الوجه؟",
          tn: "قلو يتبسم. ثبت كان فمو معوج عل جنب وإلا عينو هابطة؟"
        }
      },
      {
        stepNumber: 2,
        title: {
          en: "A - Arm Weakness",
          fr: "A - Arm / Faiblesse du Bras",
          ar: "A - الذراع (ضعف أو شلل)",
          tn: "A - اليدين (واحدة طايحة)"
        },
        instruction: {
          en: "Ask person to raise both arms. Does one arm drift downward or cannot lift?",
          fr: "Demandez-lui de lever les deux bras. Un bras retombe-t-il ?",
          ar: "اطلب منه رفع كلتا يديه للأمام. هل تهبط إحدى اليدين أو يعجز عن رفعها؟",
          tn: "قلو يهز يديه الاثنين للقدام. فمة يد طايحة ما ينجمش يهزها؟"
        }
      },
      {
        stepNumber: 3,
        title: {
          en: "S - Speech Difficulty",
          fr: "S - Speech / Trouble de la Parole",
          ar: "S - الكلام (صعوبة النطق)",
          tn: "S - الكلام (لسانو ثقيل)"
        },
        instruction: {
          en: "Ask person to repeat a simple sentence. Is speech slurred, strange, or unable to speak?",
          fr: "Faites-lui répéter une phrase simple. La voix est-elle pâteuse ou incompréhensible ?",
          ar: "اطلب منه تكرار جملة بسيطة. هل كلامه غير مفهوم، ثقيل، أو عاجز عن النطق؟",
          tn: "قلو يعاود جملة ساهلة. كلامو مخلط وإلا لسانو ثقيل ما ينجمش يحكي؟"
        }
      },
      {
        stepNumber: 4,
        title: {
          en: "T - Time to Call 190 Immediately",
          fr: "T - Time / Temps d'Appeler le 190",
          ar: "T - الوقت حاسم: اتصل بـ 190 فوراً",
          tn: "T - الوقت: اطلب 190 فيسع فيسع"
        },
        instruction: {
          en: "Every minute brain cells die (Time is Brain). Call SAMU 190 immediately and note exact time symptoms started.",
          fr: "Chaque minute compte. Appelez le 190 immédiatement et notez l'heure exacte d'apparition.",
          ar: "كل دقيقة تفقد ملايين الخلايا الدماغية. اتصل بالإسعاف 190 فوراً وسجل وقت بدء الأعراض بالدقيقة.",
          tn: "كل دقيقة بحسابها. اطلب السامي 190 واقيد الوقت بالظبط وقتاش بدات الأعراض."
        }
      }
    ],
    dos: {
      en: [
        "Keep victim lying flat or slightly elevated with head supported.",
        "Note the exact minute symptoms began for clot-busting medication eligibility.",
        "Reassure victim and keep them calm."
      ],
      fr: [
        "Allongez la victime avec la tête légèrement surélevée.",
        "Notez l'heure précise du début des symptômes.",
        "Rassurez-la et maintenez le calme."
      ],
      ar: [
        "اجعل المصاب مستلقياً مع رفع الرأس قليلاً.",
        "سجل وقت بداية الأعراض بالدقيقة لإعطاء أدوية إذابة الجلطة في المستشفى.",
        "طمئن المصاب وحافظ على هدوئه التام."
      ],
      tn: [
        "رقد المريض وهز راسو شوية لفوق.",
        "قيد الوقت بالدقيقة وقتاش بدات الحالة باش الطبيب يعطيه دوايات تسريح الجلطة.",
        "طمنو وخليه رايض من غير خوف."
      ]
    },
    donts: {
      en: [
        "DO NOT give food, drink, or oral medications (swallowing muscles may be paralyzed).",
        "DO NOT give aspirin before a hospital brain scan (may worsen hemorrhagic stroke).",
        "DO NOT wait to see if symptoms improve."
      ],
      fr: [
        "NE DONNEZ RIEN à manger, ni à boire, ni de médicament.",
        "NE DONNEZ PAS d'aspirine avant le scanner cérébral.",
        "N'ATTENDEZ PAS que les symptômes passent."
      ],
      ar: [
        "إياك وإعطاء أي طعام أو شراب أو دواء عبر الفم (خطر الاختناق لشلل البلع).",
        "لا تعطه أسبرين قبل إجراء التصوير المقطعي بالمستشفى (قد يزيد النزيف الدماغي).",
        "لا تنتظر لترى إن كانت الأعراض ستتحسن تلقائياً."
      ],
      tn: [
        "رد بالك توكلو وإلا تشربو ماء وإلا تعطيه حرابش (ينجم يتشرق).",
        "ما تعطيهش أسبرين قبل ما يعمل سكانير في السبيطار.",
        "ما تستناش وتقول تو تتعدى وحدها."
      ]
    }
  }
];

fs.writeFileSync('src/data/emergencyProtocols.ts', `import { EmergencyProtocol } from '../types';\n\nexport const emergencyProtocols: EmergencyProtocol[] = ${JSON.stringify(protocols, null, 2)};\n`, 'utf8');
console.log('emergencyProtocols.ts generated!');
