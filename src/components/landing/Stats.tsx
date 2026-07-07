import { motion } from "framer-motion";
import { AlertCircle, PhoneOff, Clock3, TrendingDown, UserX } from "lucide-react";

// Pain-point pills with real data — moved to section 2 right after hero
const PAINS = [
  {
    icon: PhoneOff,
    stat: "30%",
    label: "of appointments are lost",
    detail: "Dental clinics in Morocco miss 3 in 10 bookings because nobody answered WhatsApp after 7pm.",
  },
  {
    icon: TrendingDown,
    stat: "40%",
    label: "COD return rate",
    detail: "Orders that aren't confirmed within the first hour have a near 40% chance of coming back — unsold.",
  },
  {
    icon: Clock3,
    stat: "3 hrs",
    label: "per day on WhatsApp replies",
    detail: "The average Moroccan business owner spends 3 hours daily on WhatsApp — mostly copy-pasting the same 5 answers.",
  },
  {
    icon: UserX,
    stat: "#1",
    label: "reason clients switch",
    detail: "\"They didn't reply fast enough.\" The first business to respond wins the sale. It's that simple.",
  },
];

export const Stats = () => {
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
            <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-5">
              Why You're Losing Revenue Right Now
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 leading-tight tracking-tight mb-6">
              Manual WhatsApp is{" "}
              <span className="text-rose-500 block">quietly killing your growth</span>
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed mb-6">
              Every unanswered message is a client that went to a competitor who replied faster. 
              This isn't speculation — it's what we hear from every business in Morocco.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-sm font-semibold text-stone-700">
                The average response time in Morocco is <span className="text-rose-600">4 hours.</span> Wasla brings it to <span className="text-emerald-600">under 5 seconds.</span>
              </p>
            </div>
          </motion.div>

          {/* Right – pain stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {PAINS.map((pain, i) => {
              const Icon = pain.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="flex flex-col gap-3 p-5 rounded-2xl bg-rose-50 border border-rose-100 hover:shadow-md hover:shadow-rose-500/10 transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-2xl font-black text-rose-600">{pain.stat}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 mb-1">{pain.label}</p>
                    <p className="text-xs text-stone-500 leading-relaxed">{pain.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
