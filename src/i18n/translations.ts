export const translations: Record<'en' | 'ar', any> = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      useCases: "Use Cases",
      pricing: "Pricing",
      faq: "FAQ",
      login: "Log In",
      bookDemo: "Book a Demo"
    },
    hero: {
      eyebrow: "Customer Operations Platform",
      titlePart1: "Manage customer conversations, leads, and follow-ups ",
      titleHighlight: "in one place",
      subtitle: "Wasla helps businesses reply faster, organize leads, automate follow-ups, and run cleaner customer operations from one place.",
      ctaTagline: "Stop losing leads because replies are late.",
      bookDemo: "Book a Demo",
      seeHow: "See How It Works",
      trustText: "Built for businesses that sell through WhatsApp, Instagram, and direct conversations.",
      badges: ["E-commerce Stores", "Clinics", "Beauty Brands", "Electronics Shops", "Service Businesses"]
    },
    socialProof: {
      eyebrow: "Trusted workflow for businesses handling high customer message volume",
      title: "From customer inquiries to final follow-up, Wasla helps teams stay in control.",
      badges: ["COD Stores", "Clinics", "Product Shops", "Beauty Brands", "Service Teams"]
    },
    stats: {
      eyebrow: "The problem",
      titlePart1: "Most businesses don't lose sales because of bad products. ",
      titleHighlight: "They lose them because of messy operations.",
      description: "As the business grows, the chaos grows with it. Wasla gives businesses a cleaner system to manage customer conversations, sales flow, and day-to-day operations without relying on scattered tools and manual work.",
      problems: [
        "Hot leads go cold because replies are late",
        "Customer messages get lost in the noise",
        "Follow-ups are forgotten and opportunities vanish",
        "Orders are handled manually and slowly",
        "Team has no visibility into what's happening"
      ]
    },
    features: {
      eyebrow: "Everything in one place",
      title: "Built to help businesses move faster and operate better",
      items: [
        {
          title: "Never lose customer conversations again",
          desc: "Manage customer conversations in one clean, centralized inbox instead of juggling messages manually.",
          support: "Reply faster, reduce confusion, and keep every conversation visible and organized."
        },
        {
          title: "Every customer gets a full profile",
          desc: "Track every lead and customer with clear history, notes, order status, and conversation context.",
          support: "No more guessing who asked what or losing track of serious buyers."
        },
        {
          title: "Stop warm leads from going cold",
          desc: "Never let warm leads disappear because someone forgot to reply or check back.",
          support: "Stay consistent with reminders, reactivation, and sales follow-up workflows."
        },
        {
          title: "Visual sales & order pipeline",
          desc: "Move customers through each stage with a simple visual workflow.",
          support: "From first inquiry to confirmation, delivery, payment, and after-sales follow-up."
        },
        {
          title: "AI that saves time on repetitive replies",
          desc: "Generate faster, more consistent replies for repetitive questions and common customer requests.",
          support: "Support teams save time while keeping responses clear and professional."
        },
        {
          title: "Automate the busywork slowing you down",
          desc: "Automate repetitive business tasks and reduce the manual work slowing the team down.",
          support: "From lead capture to reminders and internal actions, Wasla helps operations run smoother."
        }
      ]
    },
    productTour: {
      eyebrow: "How it works",
      title: "Simple for teams. Powerful for operations.",
      steps: [
        { title: "Capture every customer conversation", desc: "Bring inquiries and messages into one organized flow. No more scattered chats, lost messages, or missed opportunities." },
        { title: "Track leads and customer activity", desc: "See who is serious, who needs follow-up, and where every opportunity stands — all in one clear view." },
        { title: "Automate repetitive work", desc: "Reduce time spent on repeated replies, admin tasks, and manual follow-up. Let the system handle the routine." },
        { title: "Turn more conversations into sales", desc: "Stay faster, cleaner, and more consistent from first contact to final outcome. More follow-through, more results." }
      ]
    },
    useCases: {
      eyebrow: "Built for real business workflows",
      title: "Flexible enough for different business types",
      subtitle: "Wasla is designed for businesses that rely on customer conversations to sell, book, support, or close deals.",
      items: [
        { title: "E-commerce & COD Stores", desc: "Handle order confirmations, delivery questions, product inquiries, and follow-ups without the usual chaos.", tags: ["Order Management", "Follow-ups", "COD"] },
        { title: "Clinics & Appointments", desc: "Manage appointment requests, patient questions, reminders, and inquiry flow with less manual work.", tags: ["Appointments", "Reminders", "Patient Flow"] },
        { title: "Beauty & Fashion Brands", desc: "Organize high DM volume, repetitive product questions, and customer follow-up in one system.", tags: ["High Volume", "DMs", "Repeat Buyers"] },
        { title: "Electronics & Product Shops", desc: "Respond faster to availability, pricing, and product-related questions while keeping leads organized.", tags: ["Product Q&A", "Lead Tracking", "Pricing"] },
        { title: "Service Businesses", desc: "Track incoming leads, manage conversations, and keep follow-up from slipping through the cracks.", tags: ["Lead Capture", "Pipeline", "Follow-ups"] }
      ]
    },
    integrations: {
      eyebrow: "Why teams choose Wasla",
      title: "Less chaos. More visibility. Better follow-through.",
      subtitle: "Wasla brings customer messages, lead tracking, follow-ups, order flow, and AI-assisted support into one modern workspace.",
      bookDemo: "Book a Demo",
      benefits: [
        "Reply faster without sacrificing quality",
        "Keep leads and conversations organized",
        "Reduce manual admin and repetitive work",
        "Improve follow-up consistency",
        "Give teams more visibility across the customer journey",
        "Build cleaner systems as the business grows"
      ],
      manualEyebrow: "Why not just stay manual?",
      manualTitle: "Because growth breaks messy systems",
      manualDesc: "Using only WhatsApp, notes, and memory may work at the beginning. But once message volume grows, teams start missing leads, forgetting follow-ups, replying inconsistently, and losing visibility across the customer journey.",
      tableHeaders: { old: "The Manual Way", newWay: "With Wasla" },
      comparisonRows: [
        { old: "Messages scattered across WhatsApp and personal phones", newWay: "All conversations organized in one inbox" },
        { old: "Leads forgotten or lost in chat history", newWay: "Every lead tracked with full history" },
        { old: "Follow-ups that never happen — they just get forgotten", newWay: "Automated reminders and reactivation workflows" },
        { old: "Manual order handling — prone to errors and delays", newWay: "Visual pipeline from inquiry to close" },
        { old: "Reactive, chaotic operations — never knowing what's next", newWay: "Structured, scalable system with clear next steps" }
      ]
    },
    testimonials: {
      eyebrow: "AI where it actually helps",
      title: "Practical AI for real business work",
      subtitle: "Wasla uses AI where it creates real operational value — not just for trend points. AI should reduce friction, not create more noise.",
      aiPoints: [
        "Draft repetitive replies in seconds, not minutes",
        "Keep your tone consistent across every response",
        "Reduce support workload without sacrificing quality"
      ],
      mockup: {
        title: "AI Reply Assistant",
        active: "Active",
        customerMsg: "Hi, what's the price for the black hoodie in size L?",
        aiGenerating: "AI is generating a reply...",
        aiReply: "Hi! The black hoodie in size L is available at 299 MAD. Would you like to place an order? I can help you confirm the details right now.",
        editBtn: "Edit Reply",
        sendBtn: "Send",
        savedBadge: "Saved 2 min per reply"
      }
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Simple plans based on business needs",
      subtitle: "Choose the setup that fits the current stage of the business. Whether the goal is cleaner communication, stronger follow-up, or more automation, Wasla can be adapted to match the workflow.",
      mostPopular: "Most Popular",
      talkToUs: "Talk to Us",
      plans: [
        {
          name: "Starter",
          tagline: "For small businesses getting too many messages to handle manually.",
          features: ["Shared inbox", "Basic customer profiles", "Follow-up reminders", "AI reply suggestions", "Email support"]
        },
        {
          name: "Growth",
          tagline: "For businesses that want stronger follow-up, workflow visibility, and better support operations.",
          features: ["Everything in Starter", "Sales & order pipeline", "Workflow automation", "Advanced analytics", "Priority support"]
        },
        {
          name: "Custom",
          tagline: "For teams that need a more tailored setup and deeper operational automation.",
          features: ["Everything in Growth", "Custom integrations", "Dedicated onboarding", "SLA agreement", "Custom workflows"]
        }
      ],
      bottomCta: {
        title: "Need something specific?",
        desc: "Let's build the right setup for the workflow."
      }
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          q: "Is Wasla only for WhatsApp?",
          a: "Wasla is built for businesses that sell and communicate through direct customer conversations, including WhatsApp and similar messaging-driven workflows."
        },
        {
          q: "Is Wasla only for e-commerce stores?",
          a: "No. Wasla can also support clinics, service businesses, beauty brands, product-based businesses, and other teams handling customer conversations manually."
        },
        {
          q: "Is this a chatbot only?",
          a: "No. Wasla is much more than a chatbot. It combines customer communication, lead organization, follow-up systems, workflow visibility, and operational support into one platform."
        },
        {
          q: "Can Wasla be adapted to different businesses?",
          a: "Yes. Different businesses have different workflows, and Wasla is designed to be flexible enough to support that."
        },
        {
          q: "Does Wasla replace the human team?",
          a: "No. Wasla is designed to support and improve business operations, not replace human judgment where it matters."
        }
      ]
    },
    security: {
      title: "Your business doesn't need more messages. It needs a better system.",
      desc: "Stop losing leads because replies are late. Give your team visibility before operations become chaos. Let Wasla handle the busywork so you can focus on closing deals.",
      bookDemo: "Book a Demo",
      talkToUs: "Talk to Us",
      tagline: "Wasla helps businesses manage customer conversations, follow-ups, and operations in one place."
    },
    footer: {
      desc: "Wasla helps businesses manage customer conversations, follow-ups, and operations with more clarity and less chaos.",
      columns: [
        {
          heading: "Product",
          links: ["Features", "Use Cases", "Pricing", "FAQ"]
        },
        {
          heading: "Company",
          links: ["About", "Contact", "Blog", "Careers"]
        },
        {
          heading: "Legal",
          links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
        }
      ],
      copyright: "© 2024 Wasla. All rights reserved.",
      login: "Log In",
      getStarted: "Get Started"
    }
  },
  ar: {
    nav: {
      features: "المميزات",
      howItWorks: "كيف نعمل",
      useCases: "مجالات العمل",
      pricing: "الأسعار",
      faq: "الأسئلة الشائعة",
      login: "تسجيل الدخول",
      bookDemo: "احجز عرضاً تجريبياً"
    },
    hero: {
      eyebrow: "منصة إدارة عمليات العملاء",
      titlePart1: "أدر محادثات عملائك، والمبيعات، ومتابعة الطلبات ",
      titleHighlight: "في مكان واحد",
      subtitle: "وصلة تساعد الشركات على الرد بشكل أسرع، تنظيم العملاء، أتمتة المتابعة، وتشغيل عمليات عملاء أنظف من مكان واحد.",
      ctaTagline: "أوقف فقدان عملائك بسبب تأخر الردود.",
      bookDemo: "احجز عرضاً تجريبياً",
      seeHow: "شاهد كيف نعمل",
      trustText: "مُصممة خصيصاً للشركات التي تبيع عبر واتساب، إنستغرام، أو عبر المحادثات المباشرة مع العملاء.",
      badges: ["المتاجر الإلكترونية", "العيادات والمراكز الطبية", "علامات التجميل", "متاجر الإلكترونيات", "شركات الخدمات"]
    },
    socialProof: {
      eyebrow: "مسار عمل موثوق للشركات التي تتعامل مع حجم عالي من رسائل العملاء",
      title: "من أول استفسار للعميل وحتى إتمام المتابعة، وصلة تمنح فريقك تحكماً كاملاً.",
      badges: ["متاجر الدفع عند الاستلام", "العيادات", "متاجر المنتجات", "علامات التجميل", "فرق الخدمات"]
    },
    stats: {
      eyebrow: "المشكلة الحقيقية",
      titlePart1: "معظم الشركات لا تخسر مبيعاتها بسبب رداءة المنتج. ",
      titleHighlight: "بل تخسرها بسبب الفوضى الإدارية.",
      description: "مع نمو عملك، ينمو حجم التشتت. وصلة تمنحك نظاماً احترافياً لإدارة محادثات العملاء، تتبع المبيعات، والعمليات اليومية بوضوح تام، بعيداً عن العمل اليدوي المربك والمنصات المشتتة.",
      problems: [
        "العملاء المحتملين يفقدون اهتمامهم بسبب تأخر الردود",
        "رسائل العملاء تضيع وسط التشتت اليومي",
        "المتابعة تُنسى والفرص تختفي",
        "إدارة الطلبات تتم بشكل يدوي وبطيء",
        "الفريق لا يرى ما يحدث في العمل"
      ]
    },
    features: {
      eyebrow: "كل شيء في مكان واحد",
      title: "صُممت خصيصاً لمساعدة الشركات على النمو السريع والعمل باحترافية",
      items: [
        {
          title: "لا تفقد أي محادثة مع عميلك مرة أخرى",
          desc: "تحكم في كافة محادثات عملائك من خلال صندوق بريد واحد منظم، وتخلص من التبديل المزعج بين التطبيقات.",
          support: "رد أسرع، لا مزيد من التشتت، واجعل كل محادثة واضحة وموثقة."
        },
        {
          title: "كل عميل يحصل على ملف كامل",
          desc: "تتبع كل عميل أو مهتم من خلال سجل واضح يتضمن المحادثات، الملاحظات، وحالة الطلب.",
          support: "توقف عن التخمين أو تضييع وقتك في البحث التائه عن مشتري جاد."
        },
        {
          title: "أوقف فقدان العملاء المحتملين",
          desc: "لا تخسر أبداً صفقات محتملة لمجرد نسيان الرد أو المتابعة في الوقت المناسب.",
          support: "نظام تذكير فعال ومسارات متابعة تضمن بقاءك على تواصل دائم لإنهاء البيع."
        },
        {
          title: "مسار مبيعات مرئي واضح",
          desc: "انقل عملاءك عبر كل مرحلة من مراحل البيع بوضوح مرئي كامل.",
          support: "من الاستفسار الأول وحتى التأكيد والتسليم والمتابعة ما بعد البيع."
        },
        {
          title: "ذكاء اصطناعي يوفر وقتك",
          desc: "قم بتوليد ردود سريعة واحترافية للأسئلة المكررة وطلبات العملاء الشائعة.",
          support: "وفر وقت فريقك وحافظ على مستوى عالي في جودة خدمتك."
        },
        {
          title: "أتمتة المهام التي تبطئ عملك",
          desc: "تخلص من العمل اليدوي الروتيني الذي يسحب طاقة فريقك بشكل يومي.",
          support: "من تسجيل بيانات العميل وحتى التذكيرات الداخلية، وصلة تضمن سير العمل بسلاسة."
        }
      ]
    },
  productTour: {
    eyebrow: "اكتشف القوة في البساطة",
    title: "نظام سلس لفريقك، وقوي جداً لإدارة أعمالك.",
    steps: [
      { title: "التحكم في كافة المحادثات", desc: "جمع كل الرسائل والاستفسارات في مسار عمل أوحد منظم. لا مزيد من تشتت المحادثات أو ضياع الفرص." },
      { title: "تتبع سلوك المهتمين", desc: "اعرف من هو المشتري الجاد، من يحتاج متابعة، وأين تقف كل صفقة، عبر شاشة عرض واضحة." },
      { title: "أتمتة العمل المتكرر", desc: "قلل الوقت الضائع في الردود المتكررة والعمل المكتبي. اترك لوصلة تولي المهام الروتينية." },
      { title: "تحويل المحادثات إلى مبيعات", desc: "ابق الأسرع والأنظم من نقطة التواصل الأولى وحتى إتمام البيع. متابعة أكثر تعني أرباحاً أكثر." }
    ]
  },
  useCases: {
    eyebrow: "اكتشف الحل الأمثل لمجالك",
    title: "مرونة احترافية تلائم مختلف القطاعات",
    subtitle: "وصلة مصممة للشركات التي تعتمد على المحادثات في البيع، حجز المواعيد، تقديم الدعم، أو إتمام الصفقات.",
    items: [
      { title: "المتاجر الإلكترونية والدفع عند الاستلام", desc: "أدر تأكيدات الطلب، استفسارات التوصيل، أسئلة المنتجات، والمتابعة بدون فوضى.", tags: ["إدارة الطلبات", "متابعة الطلبات", "الدفع عند الاستلام"] },
      { title: "العيادات والحجوزات", desc: "استقبل طلبات الحجز، أسئلة المرضى، ورسائل التذكير بكل سهولة وبعيداً عن العمل اليدوي.", tags: ["حجوزات", "تذكير المواعيد", "ملفات المرضى"] },
      { title: "ماركات التجميل والموضة", desc: "نظم حجم الرسائل الهائل واستفسارات المنتجات والأسعار في نظام واحد منظم.", tags: ["ضغط الرسائل", "مبيعات مباشرة", "عملاء متكررون"] },
      { title: "متاجر الإلكترونيات والمنتجات", desc: "الرد الفوري على توفر المنتجات والأسعار مع الاحتفاظ بتنظيم عملائك.", tags: ["استفسارات المنتجات", "تتبع المهتمين", "الأسعار"] },
      { title: "شركات الخدمات", desc: "تتبع طلبات الخدمة الجديدة واحتفظ بقاعدة بيانات واضحة لمتابعة صفقاتك.", tags: ["استقطاب العملاء", "مراحل البيع", "المتابعة"] }
    ]
  },
  integrations: {
    eyebrow: "لماذا تختار الشركات وصلة",
    title: "فوضى أقل. رؤية أكبر. ومتابعة أفضل.",
    subtitle: "خطوة بخطوة، تجمع وصلة محادثات عملائك، تتبع المبيعات، وتنظيم الطلبات في منصة واحدة حديثة وذكية.",
    bookDemo: "احجز عرضاً تجريبياً",
    benefits: [
      "رد أسرع دون التنازل عن جودة الخدمة",
      "حافظ على تنظيم محادثاتك وعملائك المحتملين",
      "قلل من الإدارة اليدوية والعمل المتكرر",
      "ضاعف من كفاءة التذكير والمتابعة",
      "امنح فريقك رؤية أوضح لرحلة العميل بالكامل",
      "قم ببناء أسلوب عمل احترافي ينمو مع شركتك"
    ],
    manualEyebrow: "لماذا لا أستمر بالحلول اليدوية؟",
    manualTitle: "لأن النمو يكسر الأنظمة الضعيفة",
    manualDesc: "استخدام الواتساب العادي، الملاحظات، والاعتماد على الذاكرة قد ينجح في البداية. لكن مع زيادة عدد الرسائل، تبدأ الصفقات بالضياع، والمتابعة بالنسيان، وتصبح رؤية الصورة الكاملة للمبيعات شبه مستحيلة.",
    tableHeaders: { old: "الطريقة اليدوية", newWay: "مع نظام وصلة" },
    comparisonRows: [
      { old: "محادثات مبعثرة عبر الواتساب والهواتف الشخصية", newWay: "كل المحادثات منظمة في صندوق واحد" },
      { old: "عملاء محتملون يُنسون أو تضيع بياناتهم", newWay: "تتبع دقيق وتلقائي لكل عميل" },
      { old: "متابعة لا تحدث أبداً - تُنسى ببساطة", newWay: "تذكيرات تلقائية ومسارات إعادة تفعيل" },
      { old: "إدارة طلبات يدوية - عرضة للأخطاء والتأخير", newWay: "مسار مرئي من الطلب للتسليم" },
      { old: "عمليات رد فعل وفوضوية - لا تعرف ما هو التالي", newWay: "نظام منظم وقابل للتوسع مع خطوات واضحة" }
    ]
  },
  testimonials: {
    eyebrow: "ذكاء اصطناعي حيث يحتاجه عملك فعلاً",
    title: "ذكاء اصطناعي عملي صُمم للشركات",
    subtitle: "لا نستخدم الذكاء الاصطناعي كمجرد ميزة شكلية، بل حيث يضيف قيمة حقيقية لعملياتك. هدفه تقليل الجهد لا مضاعفة التشتت.",
    aiPoints: [
      "أنشئ الردود المتكررة في ثوانٍ وليس دقائق",
      "حافظ على أسلوب موحد في كل رد",
      "قلل من ضغط الدعم دون التضحية بالجودة"
    ],
    mockup: {
      title: "مساعد الذكاء الاصطناعي",
      active: "نشط الآن",
      customerMsg: "مرحباً، كم سعر الهودي الأسود مقاس لارج؟",
      aiGenerating: "يتم إنشاء الرد الذكي...",
      aiReply: "أهلاً بك! الهودي الأسود مقاس لارج متوفر حالياً بسعر 299 درهم. هل تود طلب واحد؟ يمكنني مساعدتك في تأكيد تفاصيل الطلب الآن.",
      editBtn: "تعديل الرد",
      sendBtn: "إرسال فوراً",
      savedBadge: "وفرت دقيقتين في هذا الرد"
    }
  },
  pricing: {
    eyebrow: "الأسعار",
    title: "باقات بسيطة تناسب احتياجات عملك",
    subtitle: "اختر الباقة التي تناسب مرحلة عملك الحالية. سواء كان هدفك تواصل أنظف، متابعة أقوى، أو أتمتة أكثر، وصلة يمكن تكييفها لتتناسب مع طريقة عملك.",
    mostPopular: "الأكثر طلباً",
    talkToUs: "تواصل معنا",
    plans: [
      {
        name: "الأساسية",
        tagline: "للشركات الصغيرة التي بدأت تواجه ضغطاً في الرد اليدوي على الرسائل.",
        features: ["صندوق رسائل موحد", "قاعدة بيانات أساسية للعملاء", "تنبيهات متابعة العملاء", "مساعد رد ذكي (AI)", "دعم فني عبر البريد"]
      },
      {
        name: "النمو",
        tagline: "للشركات التي تبحث عن متابعة أقوى، تتبع واضح للمبيعات، وعمليات دعم أسرع.",
        features: ["كل مميزات الأساسية", "مسار مبيعات وتتبع طلبات", "أتمتة سير العمل والمتابعة", "تقارير وإحصائيات متقدمة", "دعم فني ذو أولوية عالية"]
      },
      {
        name: "المخصصة",
        tagline: "للفرق الكبيرة التي تحتاج لربط مخصص للمنصات وأتمتة شاملة وعميقة.",
        features: ["كل مميزات باقة النمو", "ربط برمجي مخصص (API)", "إعداد وتدريب مخصص للفريق", "اتفاقية التزام بمستوى الخدمة", "مسارات عمل خاصة ومتقدمة"]
      }
    ],
    bottomCta: {
      title: "هل تحتاج لشيء محدد أو مخصص؟",
      desc: "دعنا نبني الإعداد المثالي لشركتك ومسار عملك معاً."
    }
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "نُسأل دائماً عن...",
    items: [
      {
        q: "هل تعمل وصلة مع واتساب فقط؟",
        a: "وصلة مصممة للشركات التي تعتمد مبيعاتها على المحادثات المباشرة، وهذا لا يقتصر على واتساب بل يشمل المنصات المعتمدة على المراسلة وبناء علاقات مع المشتريين."
      },
      {
        q: "هل منصتكم للمتاجر الإلكترونية حصراً؟",
        a: "لا، وصلة قوية وملائمة جداً للعيادات الطبية، مقدمي الخدمات، وحتى العلامات التجارية والمجالات التي يكون البيع فيها مبنياً على المحادثة."
      },
      {
        q: "هل هذه مجرد أداة رد آلي (Chatbot)؟",
        a: "إطلاقاً. نحن نستخدم الذكاء الاصطناعي كمساعد للرد فقط، وصلة هي منصة إدارة أعمال متكاملة. فهي تنظم العملاء، وتتبع الصفقات، وتقوم بأتمتة المهام اليومية لفريقك."
      },
      {
        q: "هل يمكن تكييف المنصة لتناسب أعمالنا المتخصصة؟",
        a: "نعم. نحن نعلم أن كل شركة لها مسار ونموذج بيع مختلف، وبناءً على ذلك تم تصميم وصلة لتمتلك مرونة فائقة وقابلة للتعديل بحسب سير المعاملات الخاصة بك."
      },
      {
        q: "هل ستستبدل وصلة فريق العمل لدينا؟",
        a: "لا، وصلة وجدت لتساعد فريقك وتضاعف إنتاجيتهم بإزالة الأعمال اليدوية الروتينية، لتمنحهم وقتاً إضافياً للتركيز على استقطاب عملاء جدد وإنهاء الصفقات الضخمة."
      }
    ]
  },
  security: {
    title: "عملك لا يحتاج لمزيد من الرسائل. بل يحتاج لنظام أفضل.",
    desc: "أوقف فقدان العملاء بسبب تأخر الردود.امنح فريقك رؤية واضحة قبل أن تتحول العمليات لفوضى. دع وصلة تتولى العمل الروتيني حتى تتمكن من التركيز على إتمام الصفقات.",
    bookDemo: "احجز عرضاً تجريبياً",
    talkToUs: "تواصل معنا",
    tagline: "وصلة تساعد الشركات على إدارة محادثات العملاء والمتابعة والعمليات في مكان واحد."
  },
    footer: {
      desc: "وصلة帮助企业在一个地方管理客户对话、跟进和运营.",
      columns: [
        {
          heading: "المنتج",
          links: ["المميزات", "المجالات", "الأسعار", "الأسئلة الشائعة"]
        },
        {
          heading: "الشركة",
          links: ["من نحن", "اتصل بنا", "المدونة", "التوظيف"]
        },
        {
          heading: "الشؤون القانونية",
          links: ["سياسة الخصوصية", "شروط الخدمة", "سياسة ملفات الارتباط"]
        }
      ],
      copyright: "© 2024 وصلة. جميع الحقوق محفوظة.",
      login: "تسجيل الدخول",
      getStarted: "ابدأ الآن"
    }
  }
};
