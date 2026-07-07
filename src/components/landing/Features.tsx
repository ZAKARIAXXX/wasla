import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

// Before/After comparison table — self-contained, no i18n needed
const ROWS = [
  { before: "3 hours/day on WhatsApp", after: "10 minutes/day" },
  { before: "Miss messages at night", after: "Karima replies 24/7" },
  { before: "Lose clients to faster competitors", after: "First to respond — every time" },
  { before: "40% return rate from unconfirmed COD", after: "Auto-confirmation in < 60 seconds" },
  { before: "Forget to follow up", after: "Auto reminders on autopilot" },
  { before: "No visibility on your team", after: "Live inbox with agent assignments" },
];

export const Features = () => {
  return (
    <section id="features" className="py-28 bg-stone-50">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4"
          >
            The Real Difference
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-5 text-stone-900 tracking-tight leading-tight"
          >
            Life before Wasla vs.{" "}
            <span className="text-emerald-600">life after</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-stone-500 max-w-2xl mx-auto"
          >
            Every Moroccan business we talk to describes the same pain. Here's what changes on day one.
          </motion.p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden"
        >
          {/* Column headers */}
          <div className="grid grid-cols-2">
            <div className="bg-rose-50 border-b border-r border-stone-200 px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <X className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-400">Without Wasla</p>
                <p className="text-xs text-stone-400">Manual & exhausting</p>
              </div>
            </div>
            <div className="bg-emerald-50 border-b border-stone-200 px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">With Wasla</p>
                <p className="text-xs text-stone-400">Automated & effortless</p>
              </div>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="grid grid-cols-2 border-b border-stone-100 last:border-b-0"
            >
              <div className="px-6 py-4 border-r border-stone-100 flex items-center gap-3 bg-rose-50/30">
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-rose-400" />
                </div>
                <p className="text-sm text-stone-600 font-medium">{row.before}</p>
              </div>
              <div className="px-6 py-4 flex items-center gap-3 bg-emerald-50/20">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-sm text-stone-800 font-semibold">{row.after}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
