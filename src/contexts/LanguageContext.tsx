import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => any; // Changed from string to any to support objects/arrays
}

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      contacts: "Contacts",
      campaigns: "Campaigns",
      analytics: "Analytics",
      settings: "Settings",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      // ... common keys ...
      operationSuccessful: "Operation successful",
      loading: "Loading",
      noDataAvailable: "No data available",
      areYouSure: "Are you sure?",
      confirmAction: "Confirm Action",
      
      nav: {
        features: "Features",
        howItWorks: "How it works",
        useCases: "Solutions",
        pricing: "Pricing",
        faq: "FAQ",
        login: "Login",
        bookDemo: "Start Free Trial"
      },

      hero: {
        eyebrow: "Trusted by 500+ Moroccan businesses",
        titlePart1: "Convert Every WhatsApp Chat into ",
        titleHighlight: "Revenue",
        subtitle: "The all-in-one CRM for businesses that live on WhatsApp. Manage leads, automate follow-ups, and double your sales without more effort.",
        badges: ["Small Business", "E-commerce", "Services", "Real Estate"],
        bookDemo: "Get Started Free",
        seeHow: "Watch Demo",
        ctaTagline: "No credit card required • 7-day free trial"
      },

      socialProof: {
        eyebrow: "Empowering Local Growth",
        title: "Built for every industry in Morocco",
        badges: ["Retail Stores", "Medical Clinics", "Real Estate Agencies", "SaaS & Tech", "Home Services"]
      },

      stats: {
        eyebrow: "The Problem",
        titlePart1: "Stop Losing Sales to ",
        titleHighlight: "Manual Chaos",
        description: "Moroccan customers expect fast replies on WhatsApp. But when you're busy, messages get missed, leads are forgotten, and money stays on the table.",
        problems: ["Messages lost in private chats", "Zero follow-up on cold leads", "No team visibility or reports", "Manual typing for every client"]
      },

      features: {
        eyebrow: "Powerful Features",
        title: "Everything you need to scale your WhatsApp sales",
        items: [
          { title: "Shared Inbox", desc: "One number, multiple team members. Respond together and never miss a chat.", support: "Works with official API" },
          { title: "Contact Manager", desc: "Tag, segment, and organize your leads like a pro. Search history in seconds.", support: "Unlimited contacts" },
          { title: "Smart Notifications", desc: "Get alerted when a lead hasn't been replied to in over 30 minutes.", support: "Custom alerts" },
          { title: "Automated Flows", desc: "Send auto-welcomes, catalog links, or follow-ups based on customer tags.", support: "Triggered by events" },
          { title: "AI Sales Agent", desc: "Let AI handle basic questions and qualify leads while you sleep.", support: "Multilingual support" },
          { title: "Real-time Analytics", desc: "Track response times, conversion rates, and team performance daily.", support: "Exportable reports" }
        ]
      },

      productTour: {
        eyebrow: "How It Works",
        title: "4 simple steps to WhatsApp excellence",
        steps: [
          { title: "Connect Number", desc: "Link your WhatsApp Business account in under 2 minutes." },
          { title: "Import Contacts", desc: "Bring your existing leads or start fresh with our API." },
          { title: "Automate Routine", desc: "Set up auto-replies for after-hours or common FAQs." },
          { title: "Watch Sales Grow", desc: "Focus on closing while Wasla handles the organization." }
        ]
      },

      useCases: {
        eyebrow: "Tailored Solutions",
        title: "How Moroccan businesses use Wasla",
        subtitle: "Real results for real businesses across the kingdom.",
        items: [
          { title: "E-commerce Stores", desc: "Automate order confirmations and abandoned cart recovery.", tags: ["Shopify", "WooCommerce", "Local Ads"] },
          { title: "Real Estate", desc: "Instantly qualify buyers and schedule viewings via automated flows.", tags: ["Lead Gen", "Scheduling"] },
          { title: "Service Providers", desc: "Manage bookings and send appointment reminders automatically.", tags: ["Salons", "Repair", "Consulting"] },
          { title: "Educational Hubs", desc: "Handle student inquiries and course registration at scale.", tags: ["Schools", "Training"] },
          { title: "Wholesale/B2B", desc: "Manage bulk orders and distributor relationships efficiently.", tags: ["Supply Chain", "CRM"] }
        ]
      },

      integrations: {
        eyebrow: "Why Choose Wasla?",
        title: "Engineered for speed and reliability",
        subtitle: "We don't just provide a tool; we provide a complete system built for the Moroccan market dynamic.",
        bookDemo: "Start Scaling Now",
        benefits: ["Arabic & French Support", "Official Meta Partner", "Bank-grade Security", "Unlimited Message History"],
        manualEyebrow: "The Old Way vs The Wasla Way",
        manualTitle: "Why manual WhatsApp is killing your growth",
        manualDesc: "Managing 50+ chats a day on a single phone is impossible. Here is how we change the game:",
        tableHeaders: { old: "The Old Chaos", newWay: "The Wasla Method" },
        comparisonRows: [
          { old: "Checking 5 private phones", newWay: "One shared team dashboard" },
          { old: "Forgetting to follow up", newWay: "Automated follow-up reminders" },
          { old: "Copy-pasting same text", newWay: "Instant quick-replies & templates" },
          { old: "No idea how team is doing", newWay: "Clear performance analytics" }
        ]
      },

      testimonials: {
        eyebrow: "AI Power",
        title: "Multiply your team with AI",
        subtitle: "Our AI doesn't just chat; it learns your business and helps your team close more deals faster.",
        aiPoints: ["Drafts human-like responses", "Translates between AR/FR/EN instantly", "Suggests best products based on chat", "Analyzes customer sentiment"],
        mockup: {
          title: "Wasla AI Assistant",
          active: "Thinking...",
          customerMsg: "Do you have this in blue and can you deliver to Marrakech?",
          aiGenerating: "Generating Best Response",
          aiReply: "Yes! We have the 'Sky Blue' model in stock. Delivery to Marrakech takes 24-48 hours via Aramex. Would you like me to send the payment link?",
          editBtn: "Edit Draft",
          sendBtn: "Send Now",
          savedBadge: "15 min saved"
        }
      },

      pricing: {
        eyebrow: "Simple Pricing",
        title: "Plans that grow with you",
        subtitle: "Start free, upgrade as you scale. No hidden fees.",
        plans: [
          { name: "Starter", tagline: "Perfect for solopreneurs starting out.", features: ["1 Team Seat", "1,000 Messages/mo", "Basic CRM", "Mobile App"] },
          { name: "Professional", tagline: "Built for growing teams and stores.", features: ["5 Team Seats", "Unlimited Messages", "Automation Flows", "Full Analytics"] },
          { name: "Enterprise", tagline: "Custom solutions for large scale.", features: ["Unlimited Seats", "White-label Options", "Dedicated AM", "Custom AI Training"] }
        ],
        mostPopular: "Most Popular",
        talkToUs: "Start 7-Day Free Trial",
        bottomCta: {
          title: "Need a custom solution?",
          desc: "We offer special pricing for non-profits and large-scale enterprises. Contact our sales team for a custom quote."
        }
      },

      faq: {
        eyebrow: "Frequently Asked Questions",
        title: "Everything you need to know",
        items: [
          { q: "Do I need a new phone number?", a: "No, you can use your existing WhatsApp Business number. We'll help you connect it to our official API gateway." },
          { q: "Is it safe and official?", a: "Yes. Wasla uses the official Meta WhatsApp Business Cloud API, ensuring your account is safe from bans." },
          { q: "How many agents can use it?", a: "Depending on your plan, you can have from 1 to 50+ agents responding from the same number simultaneously." },
          { q: "Does it support Arabic?", a: "Absolutely. The entire dashboard and our support team are fully bilingual in Arabic and French." }
        ]
      },

      security: {
        title: "Ready to transform your WhatsApp sales?",
        desc: "Join hundreds of Moroccan businesses that use Wasla to stay organized and grow their revenue every single day.",
        bookDemo: "Start Your Free Trial",
        talkToUs: "Talk to an Expert",
        tagline: "Secure, official, and built for growth."
      },

      footer: {
        desc: "The #1 WhatsApp CRM built for the modern Moroccan business. Scale your conversations, not your stress.",
        columns: [
          { heading: "Product", links: ["Features", "Automation", "AI Agent", "Pricing"] },
          { heading: "Company", links: ["About Us", "Contact", "Blog", "Privacy"] },
          { heading: "Resources", links: ["Documentation", "Help Center", "WhatsApp API", "Status"] }
        ],
        copyright: "© 2024 Wasla. All rights reserved.",
        login: "Login",
        getStarted: "Get Started"
      }
    },
  },
  ar: {
    translation: {
      dashboard: "لوحة التحكم",
      contacts: "الاتصالات",
      campaigns: "الحملات",
      analytics: "التحليلات",
      settings: "الإعدادات",
      login: "تسجيل الدخول",
      signup: "التسجيل",
      logout: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      rememberMe: "تذكرني",
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      add: "إضافة",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      actions: "إجراءات",
      status: "الحالة",
      date: "التاريخ",
      time: "الوقت",
      name: "الاسم",
      description: "الوصف",
      home: "الرئيسية",
      profile: "الملف الشخصي",
      sendMessage: "إرسال رسالة",
      messageSent: "تم إرسال الرسالة",
      contactDetails: "تفاصيل الاتصال",
      addContact: "إضافة اتصال",
      editContact: "تعديل اتصال",
      createCampaign: "إنشاء حملة",
      campaignDetails: "تفاصيل الحملة",
      viewAnalytics: "عرض التحليلات",
      exportData: "تصدير البيانات",
      accountSettings: "إعدادات الحساب",
      notificationSettings: "إعدادات الإشعارات",
      welcomeBack: "مرحباً بعودتك",
      createNewAccount: "إنشاء حساب جديد",
      somethingWentWrong: "حدث خطأ ما",
      pleaseTryAgain: "الرجاء المحاولة مرة أخرى",
      operationSuccessful: "تمت العملية بنجاح",
      loading: "جار التحميل",
      noDataAvailable: "لا توجد بيانات متاحة",
      areYouSure: "هل أنت متأكد؟",
      confirmAction: "تأكيد الإجراء",

      nav: {
        features: "المميزات",
        howItWorks: "كيف يعمل",
        useCases: "الحلول",
        pricing: "الأسعار",
        faq: "الأسئلة الشائعة",
        login: "تسجيل الدخول",
        bookDemo: "ابدأ تجربة مجانية"
      },

      hero: {
        eyebrow: "موثوق من قبل أكثر من 500 شركة مغربية",
        titlePart1: "حوّل كل محادثة واتساب إلى ",
        titleHighlight: "أرباح",
        subtitle: "منصة إدارة علاقات العملاء المتكاملة للشركات التي تعتمد على واتساب. أدر عملائك، أتمت المتابعات، وضاعف مبيعاتك دون جهد إضافي.",
        badges: ["شركات صغيرة", "تجارة إلكترونية", "خدمات", "عقارات"],
        bookDemo: "ابدأ مجاناً",
        seeHow: "شاهد العرض",
        ctaTagline: "لا حاجة لبطاقة ائتمان • تجربة مجانية لمدة 7 أيام"
      },

      socialProof: {
        eyebrow: "تمكين النمو المحلي",
        title: "مصمم لكل قطاع أعمال في المغرب",
        badges: ["متاجر التجزئة", "عيادات طبية", "وكالات عقارية", "SaaS وتقنية", "خدمات منزلية"]
      },

      stats: {
        eyebrow: "المشكلة",
        titlePart1: "توقف عن خسارة المبيعات بسبب ",
        titleHighlight: "الفوضى اليدوية",
        description: "يتوقع المغاربة ردوداً سريعة على واتساب. ولكن عندما تكون مشغولاً، تضيع الرسائل، ويتم نسيان العملاء، وتبقى الأرباح بعيدة المنال.",
        problems: ["رسائل ضائعة في الدردشات الخاصة", "غياب المتابعة للعملاء المحتملين", "انعدام رؤية الفريق أو التقارير", "الكتابة اليدوية لكل عميل"]
      },

      features: {
        eyebrow: "مميزات قوية",
        title: "كل ما تحتاجه لتوسيع مبيعاتك عبر واتساب",
        items: [
          { title: "صندوق وارد مشترك", desc: "رقم واحد، أعضاء فريق متعددون. ردوا معاً ولا تفوتوا أي دردشة أبداً.", support: "يعمل مع API الرسمي" },
          { title: "مدير الاتصالات", desc: "صنف ونظم عملائك باحترافية. ابحث في تاريخ المحادثات في ثوانٍ.", support: "جهات اتصال غير محدودة" },
          { title: "تنبيهات ذكية", desc: "احصل على تنبيه عندما لا يتم الرد على عميل لأكثر من 30 دقيقة.", support: "تنبيهات مخصصة" },
          { title: "تدفقات مؤتمتة", desc: "أرسل رسائل ترحيب تلقائية، روابط كتالوج، أو متابعات بناءً على تصنيفات العملاء.", support: "تعتمد على الأحداث" },
          { title: "مساعد مبيعات ذكي", desc: "دع الذكاء الاصطناعي يجيب على الأسئلة الأساسية ويؤهل العملاء أثناء نومك.", support: "دعم متعدد اللغات" },
          { title: "تحليلات فورية", desc: "تتبع أوقات الاستجابة، معدلات التحويل، وأداء الفريق يومياً.", support: "تقارير قابلة للتصدير" }
        ]
      },

      productTour: {
        eyebrow: "كيف يعمل",
        title: "4 خطوات بسيطة للتميز عبر واتساب",
        steps: [
          { title: "ربط الرقم", desc: "اربط حساب واتساب للأعمال الخاص بك في أقل من دقيقتين." },
          { title: "استيراد جهات الاتصال", desc: "أحضر عملائك الحاليين أو ابدأ من جديد باستخدام API الخاص بنا." },
          { title: "أتمتة الروتين", desc: "قم بإعداد الردود التلقائية لخارج أوقات العمل أو الأسئلة الشائعة." },
          { title: "شاهد نمو المبيعات", desc: "ركز على إغلاق الصفقات بينما تتولى وصلة التنظيم." }
        ]
      },

      useCases: {
        eyebrow: "حلول مخصصة",
        title: "كيف تستخدم الشركات المغربية وصلة",
        subtitle: "نتائج حقيقية لأعمال حقيقية في جميع أنحاء المملكة.",
        items: [
          { title: "متاجر التجارة الإلكترونية", desc: "أتمتة تأكيدات الطلبات واسترجاع السلال المهجورة.", tags: ["سلة", "ووكومرس", "إعلانات محلية"] },
          { title: "العقارات", desc: "أهل المشترين فوراً وحدد موعد المعاينات عبر التدفقات المؤتمتة.", tags: ["جلب العملاء", "جدولة المواعيد"] },
          { title: "مزودي الخدمات", desc: "أدر الحجوزات وأرسل تذكيرات المواعيد تلقائياً.", tags: ["صالونات", "إصلاح", "استشارات"] },
          { title: "المراكز التعليمية", desc: "تعامل مع استفسارات الطلاب والتسجيل في الدورات على نطاق واسع.", tags: ["مدارس", "تدريب"] },
          { title: "الجملة / B2B", desc: "أدر طلبات الجملة وعلاقات الموزعين بكفاءة.", tags: ["سلسلة التوريد", "CRM"] }
        ]
      },

      integrations: {
        eyebrow: "لماذا تختار وصلة؟",
        title: "مصمم من أجل السرعة والموثوقية",
        subtitle: "نحن لا نوفر أداة فحسب؛ بل نوفر نظاماً متكاملاً بني ليناسب ديناميكية السوق المغربية.",
        bookDemo: "ابدأ التوسع الآن",
        benefits: ["دعم باللغة العربية والفرنسية", "شريك رسمي لميتا", "أمان بمستوى بنكي", "تاريخ رسائل غير محدود"],
        manualEyebrow: "الطريقة القديمة مقابل طريقة وصلة",
        manualTitle: "لماذا يقتل واتساب اليدوي نموك",
        manualDesc: "إدارة أكثر من 50 دردشة يومياً على هاتف واحد أمر مستحيل. إليك كيف نغير قواعد اللعبة:",
        tableHeaders: { old: "فوضى الماضي", newWay: "طريقة وصلة" },
        comparisonRows: [
          { old: "تفقد 5 هواتف خاصة", newWay: "لوحة تحكم واحدة مشتركة للفريق" },
          { old: "نسيان المتابعة", newWay: "تذكيرات متابعة مؤتمتة" },
          { old: "نسخ ولصق نفس النصوص", newWay: "ردود سريعة وقوالب فورية" },
          { old: "لا فكرة عن أداء الفريق", newWay: "تحليلات أداء واضحة" }
        ]
      },

      testimonials: {
        eyebrow: "قوة الذكاء الاصطناعي",
        title: "ضاعف إنتاجية فريقك بالذكاء الاصطناعي",
        subtitle: "ذكاؤنا الاصطناعي لا يدردش فحسب؛ بل يتعلم طبيعة عملك ويساعد فريقك على إتمام الصفقات بشكل أسرع.",
        aiPoints: ["يصيغ ردوداً تشبه البشر", "يترجم بين العربية والفرنسية والإنجليزية فوراً", "يقترح أفضل المنتجات بناءً على الدردشة", "يحلل مشاعر العملاء"],
        mockup: {
          title: "مساعد وصلة الذكي",
          active: "يفكر...",
          customerMsg: "هل لديكم هذا باللون الأزرق وهل يمكنكم التوصيل لمراكش؟",
          aiGenerating: "يتم إنشاء أفضل رد",
          aiReply: "نعم! لدينا موديل 'Sky Blue' في المخزون. التوصيل لمراكش يستغرق 24-48 ساعة عبر أرامكس. هل تود أن أرسل لك رابط الدفع؟",
          editBtn: "تعديل المسودة",
          sendBtn: "إرسال الآن",
          savedBadge: "تم توفير 15 دقيقة"
        }
      },

      pricing: {
        eyebrow: "أسعار بسيطة",
        title: "باقات تنمو معك",
        subtitle: "ابدأ مجاناً، وقم بالترقية مع توسعك. لا توجد رسوم خفية.",
        plans: [
          { name: "البداية", tagline: "مثالي لرواد الأعمال المنفردين.", features: ["مقعد فريق واحد", "1,000 رسالة شهرياً", "CRM أساسي", "تطبيق جوال"] },
          { name: "الاحترافي", tagline: "مصمم للفرق والمتاجر المتنامية.", features: ["5 مقاعد فريق", "رسائل غير محدودة", "تدفقات أتمتة", "تحليلات كاملة"] },
          { name: "المؤسسات", tagline: "حلول مخصصة للنطاقات الكبيرة.", features: ["مقاعد غير محدودة", "خيارات العلامة البيضاء", "مدير حساب مخصص", "تدريب مخصص للذكاء الاصطناعي"] }
        ],
        mostPopular: "الأكثر شيوعاً",
        talkToUs: "ابدأ تجربة مجانية لمدة 7 أيام",
        bottomCta: {
          title: "هل تحتاج إلى حل مخصص؟",
          desc: "نحن نقدم أسعاراً خاصة للمنظمات غير الربحية والمؤسسات الكبيرة. اتصل بفريق المبيعات لدينا للحصول على عرض مخصص."
        }
      },

      faq: {
        eyebrow: "الأسئلة الشائعة",
        title: "كل ما تحتاج إلى معرفته",
        items: [
          { q: "هل أحتاج إلى رقم هاتف جديد؟", a: "لا، يمكنك استخدام رقم واتساب للأعمال الحالي الخاص بك. سنساعدك في ربطه بـ API الرسمي الخاص بنا." },
          { q: "هل هو آمن ورسمي؟", a: "نعم. تستخدم وصلة Meta WhatsApp Business Cloud API الرسمي، مما يضمن حماية حسابك من الحظر." },
          { q: "كم عدد الوكلاء الذين يمكنهم استخدامه؟", a: "بناءً على باقتك، يمكنك الحصول على من 1 إلى أكثر من 50 وكيلاً يردون من نفس الرقم في وقت واحد." },
          { q: "هل يدعم اللغة العربية؟", a: "بالتأكيد. لوحة التحكم بالكامل وفريق الدعم لدينا متحدثون بالعربية والفرنسية." }
        ]
      },

      security: {
        title: "جاهز لتحويل مبيعاتك عبر واتساب؟",
        desc: "انضم إلى مئات الشركات المغربية التي تستخدم وصلة للبقاء منظمين وزيادة أرباحهم كل يوم.",
        bookDemo: "ابدأ تجربتك المجانية",
        talkToUs: "تحدث مع خبير",
        tagline: "آمن، رسمي، ومبني للنمو."
      },

      footer: {
        desc: "#1 واتساب CRM بني للشركات المغربية الحديثة. وسع محادثاتك، وليس توترك.",
        columns: [
          { heading: "المنتج", links: ["المميزات", "الأتمتة", "مساعد AI", "الأسعار"] },
          { heading: "الشركة", links: ["من نحن", "اتصل بنا", "المدونة", "الخصوصية"] },
          { heading: "المصادر", links: ["التوثيق", "مركز المساعدة", "WhatsApp API", "الحالة"] }
        ],
        copyright: "© 2024 وصلة. جميع الحقوق محفوظة.",
        login: "تسجيل الدخول",
        getStarted: "ابدأ الآن"
      }
    },
  },
};

// Initialize i18next outside the component
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true, // Crucial: allows returning objects/arrays for .map()
});

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState(() => {
    return i18n.language;
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    return i18n.t(key);
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};