import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Bot, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Conversation scenarios that loop
const SCENARIOS = [
  {
    contact: { name: "Sara M.", phone: "+212 6 12 34 56 78", avatar: "S", color: "from-violet-400 to-violet-600" },
    messages: [
      { role: "customer", text: "Salam! Wash kayn j size 38 f les baskets blanches? 🙏", delay: 0 },
      { role: "ai", text: "Wa alaykum salam Sara! ✨ Oui, kayna taille 38 f blanc. Prix: 299 MAD, livraison 24h. Tzidi t9edri tchofi les photos catalogue?", delay: 2200 },
      { role: "customer", text: "Ah zwin! Kifdach ndir l commande?", delay: 5000 },
      { role: "ai", text: "Sahla! Diri hna l info dyalek: isem, adresse, w raqm l hatif. N9edrouk n3awed ntibat m3ak hda ⚡", delay: 7000 },
    ],
  },
  {
    contact: { name: "Karim B.", phone: "+212 6 98 76 54 32", avatar: "K", color: "from-amber-400 to-amber-600" },
    messages: [
      { role: "customer", text: "Hello! I ordered 3 days ago, when will it arrive? 📦", delay: 0 },
      { role: "ai", text: "Hi Karim! Let me check your order right away 🔍 Your parcel #3291 is currently out for delivery and should arrive today before 6pm. You'll get an SMS with live tracking!", delay: 2500 },
      { role: "customer", text: "Great, merci! 👍", delay: 5200 },
      { role: "ai", text: "Avec plaisir! Don't hesitate to reach out if you need anything 😊 Have a great day!", delay: 6800 },
    ],
  },
  {
    contact: { name: "Fatima R.", phone: "+212 6 55 44 33 22", avatar: "F", color: "from-emerald-400 to-emerald-600" },
    messages: [
      { role: "customer", text: "Mrhba! Bghit n9ed rendez-vous liyam jaya?", delay: 0 },
      { role: "ai", text: "Mrhba bik Fatima! 🌟 Kayna des créneaux disponibles: Mardi 22 avril à 10h ou 14h30, Mercredi 23 à 11h. Anhi mzyan lik?", delay: 2000 },
      { role: "customer", text: "Mardi 10h perfect!", delay: 4500 },
      { role: "ai", text: "Parfait ✅ Rendez-vous confirmé le Mardi 22 avril à 10h00. Tu recevras un rappel SMS 1h avant. À bientôt! 🙏", delay: 6200 },
    ],
  },
];

type Message = {
  role: "customer" | "ai";
  text: string;
  id: number;
};

const TypingBubble = () => (
  <div className="flex items-end gap-2 justify-start">
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
      <Bot className="w-3 h-3 text-white" />
    </div>
    <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "160ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  </div>
);

export const Hero = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight;
  const trustBadges = t("hero.badges") as unknown as string[];

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentScenario = SCENARIOS[scenarioIndex];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleMessages, isTyping]);

  // Run scenario animation
  useEffect(() => {
    setVisibleMessages([]);
    setIsTyping(false);
    setMsgCount(0);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const scenario = SCENARIOS[scenarioIndex];
    let counter = 0;

    scenario.messages.forEach((msg, i) => {
      // Show typing bubble before AI message
      if (msg.role === "ai") {
        const typingStart = setTimeout(() => {
          setIsTyping(true);
        }, msg.delay - 900);
        timersRef.current.push(typingStart);
      }

      const t = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => [
          ...prev,
          { role: msg.role, text: msg.text, id: counter++ },
        ]);
        setMsgCount((n) => n + 1);
      }, msg.delay);

      timersRef.current.push(t);
    });

    // After all messages, wait and move to next scenario
    const lastDelay = scenario.messages[scenario.messages.length - 1].delay + 3500;
    const nextScenario = setTimeout(() => {
      setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, lastDelay);
    timersRef.current.push(nextScenario);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [scenarioIndex]);

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-stone-50">
      {/* Radial gradient backgrounds */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(16,185,129,0.08),_transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,_rgba(16,185,129,0.05),_transparent)]" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column – Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t("hero.eyebrow")}
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 text-stone-900 leading-[1.15] tracking-tight">
              {t("hero.titlePart1")}
              <span className="text-emerald-600 block sm:inline">{t("hero.titleHighlight")}</span>
            </h1>

            <p className="text-xl text-stone-500 mb-8 max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-100 shadow-sm text-xs font-semibold text-stone-500"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={() => navigate("/signup")}
                size="lg"
                className="px-8 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-600/35 flex items-center gap-2"
              >
                {t("hero.bookDemo")}
                <ArrowIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-bold border-2 border-stone-200 hover:border-emerald-300 bg-white hover:bg-stone-50 text-stone-900 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                {t("hero.seeHow")}
              </Button>
            </div>

            <p className="text-sm font-medium text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
              {t("hero.ctaTagline")}
            </p>
          </motion.div>

          {/* Right Column – Live Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="relative w-full aspect-square lg:aspect-auto lg:h-[580px]"
          >
            {/* Soft glow */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-75 translate-y-12 pointer-events-none" />

            {/* Card shell */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col">

              {/* Browser chrome */}
              <div className="h-11 border-b border-stone-100 bg-stone-50/80 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="flex-1 mx-4">
                  <div className="h-5 bg-stone-100 rounded-md w-48 mx-auto" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Wifi className="w-3 h-3" />
                  LIVE
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <div className="hidden sm:flex flex-col w-52 bg-white border-r border-stone-100 shrink-0">
                  {/* Sidebar header */}
                  <div className="p-3 border-b border-stone-50">
                    <div className="h-6 w-24 bg-stone-100 rounded-lg mb-1" />
                    <p className="text-[9px] text-stone-400 font-medium">3 conversations actives</p>
                  </div>

                  {/* Conversation list in sidebar */}
                  <div className="flex-1 overflow-hidden divide-y divide-stone-50/50">
                    {SCENARIOS.map((sc, idx) => (
                      <div
                        key={sc.contact.name}
                        className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all ${
                          idx === scenarioIndex ? "bg-emerald-50 border-l-2 border-emerald-500" : "hover:bg-stone-50"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${sc.contact.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                          {sc.contact.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-bold truncate ${idx === scenarioIndex ? "text-emerald-700" : "text-stone-700"}`}>
                            {sc.contact.name}
                          </p>
                          <p className="text-[9px] text-stone-400 truncate">{sc.contact.phone}</p>
                        </div>
                        {idx === scenarioIndex && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* AI active badge */}
                  <div className="p-3 border-t border-stone-50">
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div>
                        <p className="text-[9px] font-bold text-emerald-700">Karima AI Active</p>
                        <p className="text-[8px] text-emerald-500">Réponse auto &lt; 5s</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col min-w-0 bg-stone-50/60">

                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 bg-white shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={scenarioIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentScenario.contact.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                      >
                        {currentScenario.contact.avatar}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex-1 min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={scenarioIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="text-xs font-bold text-stone-800 truncate"
                        >
                          {currentScenario.contact.name}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-[9px] text-emerald-500 font-medium">● En ligne</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                      <Bot className="w-3 h-3 text-emerald-600" />
                      <span className="text-[9px] font-bold text-emerald-700">AI ON</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <AnimatePresence>
                      {visibleMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className={`flex items-end gap-2 ${msg.role === "customer" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "ai" && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 max-w-[78%] shadow-sm ${
                              msg.role === "customer"
                                ? "bg-emerald-500 text-white rounded-br-sm"
                                : "bg-white border border-stone-100 text-stone-800 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-[11px] leading-relaxed">{msg.text}</p>
                          </div>
                          {msg.role === "customer" && (
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentScenario.contact.color} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                              {currentScenario.contact.avatar}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TypingBubble />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fake input bar */}
                  <div className="px-4 py-3 border-t border-stone-100 bg-white shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 bg-stone-50 border border-stone-100 rounded-xl px-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] text-stone-400 font-medium">Karima AI is handling this…</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating metric badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white border border-stone-100 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Avg. response</p>
                <p className="text-sm font-black text-stone-900">&lt; 5 seconds</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white border border-stone-100 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Handled by AI</p>
                <p className="text-sm font-black text-stone-900">87% of messages</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
