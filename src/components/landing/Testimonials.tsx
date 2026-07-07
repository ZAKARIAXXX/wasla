import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Zap, Clock, ShieldCheck, RefreshCw } from "lucide-react";

// Full Darija conversations to show Karima's differentiator
const DARIJA_CONVOS = [
  {
    customer: "Salam! Wash kayna taille 40 f les baskets blanches?",
    thinking: "Checking stock for size 40 white sneakers…",
    reply: "Wa alaykum salam! ✨ Iyeh kayna taille 40 bzaf. Prix: 299 MAD w livraison 24h. Bghi nchouf lik les photos?",
    time: "< 3 secondes",
  },
  {
    customer: "Mrhba! Bghit ncanceli rendez-vous dyali ghda.",
    thinking: "Looking up appointment & suggesting next slot…",
    reply: "Entendus! Rendez-vous ghda msha 3la kheir. 📅 Kayen slot libre nhar l-had 10h — bghi nhajzek?",
    time: "< 4 secondes",
  },
  {
    customer: "Kifash ndir l commande w nkhles b cash f dar?",
    thinking: "Fetching COD payment instructions…",
    reply: "Sahla bzzaf! 🚚 Daz smiytek, adresse, w raqm l'hatif. Paymen f dar men 3nd l livreur. Ghir dak chi w nsta7malo!",
    time: "< 3 secondes",
  },
];

const POINTS = [
  { icon: Clock, text: "Responds under 5 seconds — even at 2am" },
  { icon: RefreshCw, text: "Handles appointment reschedules automatically" },
  { icon: Zap, text: "COD confirmation sent before they change their mind" },
  { icon: ShieldCheck, text: "Never gives wrong info — trained on your catalog" },
];

export const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"customer" | "thinking" | "reply">("customer");

  useEffect(() => {
    const sequence = async () => {
      // show customer
      setPhase("customer");
      await delay(1800);
      // show thinking
      setPhase("thinking");
      await delay(1400);
      // show reply
      setPhase("reply");
      await delay(3200);
      // next convo
      setIdx((prev) => (prev + 1) % DARIJA_CONVOS.length);
    };

    const timeoutId = setTimeout(sequence, 100);
    return () => clearTimeout(timeoutId);
  }, [idx]);

  const convo = DARIJA_CONVOS[idx];

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-5">
              Multiply Your Team With AI
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-4 leading-tight">
              Meet <span className="text-emerald-600">Karima</span> — your AI agent who speaks Darija
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed mb-2">
              Karima replies to your WhatsApp clients in <strong className="text-stone-700">Darija, French, or Arabic</strong> — instantly, at any hour.
              She confirms COD orders, books appointments, sends catalog links, and handles the 80% of messages that are always the same.
            </p>
            <p className="text-sm text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl mb-8 inline-block">
              🇲🇦 The only AI assistant trained on Moroccan commerce conversations
            </p>

            <div className="space-y-3">
              {POINTS.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <point.icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-stone-700">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right – Live Darija chat simulation */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 bg-stone-50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Karima — AI Agent</p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Active · Replies in Darija 🇲🇦
                  </p>
                </div>
                <div className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  LIVE DEMO
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 min-h-[240px] flex flex-col justify-end">
                <AnimatePresence mode="popLayout">
                  {/* Customer message */}
                  <motion.div
                    key={`customer-${idx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-end"
                  >
                    <div className="bg-stone-100 text-stone-800 rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%] shadow-sm">
                      {convo.customer}
                    </div>
                  </motion.div>

                  {/* AI thinking */}
                  {(phase === "thinking" || phase === "reply") && (
                    <motion.div
                      key={`thinking-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      {phase === "thinking" ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                          <span className="text-[10px] text-emerald-600 font-semibold">{convo.thinking}</span>
                          <div className="flex gap-1">
                            {[0, 160, 320].map((d) => (
                              <div key={d} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-600 text-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] shadow-md leading-relaxed">
                          {convo.reply}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Speed badge */}
              {phase === "reply" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-5 pb-4 flex items-center justify-end gap-2"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-stone-400">Replied in {convo.time}</span>
                </motion.div>
              )}

              {/* Fake input */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-9 bg-stone-50 border border-stone-200 rounded-xl px-4 flex items-center">
                    <p className="text-[11px] text-stone-400">Karima is handling this conversation…</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-5 -right-4 bg-white border border-stone-200 rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-stone-700">Saves 2+ hours/day on WhatsApp</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
