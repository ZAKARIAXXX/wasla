import { motion } from "framer-motion";
import { TrendingUp, Clock, ShoppingCart, Calendar, Star } from "lucide-react";

const CASES = [
  {
    icon: Calendar,
    industry: "Cabinet Dentaire • Rabat",
    color: "from-sky-500/10 to-sky-500/5",
    iconBg: "bg-sky-50 text-sky-600",
    badge: "Clinique",
    badgeColor: "bg-sky-100 text-sky-700",
    problem: "Dental clinic losing 30% of appointments to unanswered WhatsApp messages after hours.",
    result: "Karima auto-confirms every appointment. Cancellations are caught 24h early and slot filled automatically.",
    metric: "2 hrs/day saved",
    metricSub: "Zero missed appointments",
    quote: "\"Clients get a reply at 11pm — I didn't believe it would work until I saw it.\"",
    author: "Dr. Sanae, Cabinet Dentaire Rabat",
  },
  {
    icon: ShoppingCart,
    industry: "COD Store • Casablanca",
    color: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-50 text-emerald-600",
    badge: "E-commerce",
    badgeColor: "bg-emerald-100 text-emerald-700",
    problem: "COD store with 40% return rate because orders weren't confirmed fast enough — customers forgot or changed their minds.",
    result: "Wasla sends an automatic confirmation within 60 seconds of each order. Returns dropped by half.",
    metric: "40% fewer returns",
    metricSub: "+23% confirmed orders",
    quote: "\"Bghit nwqef r-returns. Wasla dar hada b automation simple.\"",
    author: "Anas, COD Fashion Store Casablanca",
  },
  {
    icon: Star,
    industry: "Beauty Salon • Marrakech",
    color: "from-rose-500/10 to-rose-500/5",
    iconBg: "bg-rose-50 text-rose-600",
    badge: "Services",
    badgeColor: "bg-rose-100 text-rose-700",
    problem: "A busy beauty salon missing booking requests while the owner was with clients — losing revenue to competing salons who replied first.",
    result: "Karima handles Instagram DM bookings, reads the schedule, and confirms slots instantly.",
    metric: "3× more bookings",
    metricSub: "First to reply, every time",
    quote: "\"Daba l'agenda dyali kollu mla. Clients kaygolsi 'safi' wla Wasla.\"",
    author: "Hind, Salon de beauté Marrakech",
  },
];

export const UseCases = () => {
  return (
    <section id="solutions" className="py-28 bg-stone-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4"
          >
            Real Results • Moroccan Businesses
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-5 text-stone-900 tracking-tight"
          >
            The businesses that{" "}
            <span className="text-emerald-600">stopped losing money</span>{" "}
            to slow WhatsApp replies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-stone-500"
          >
            Every industry has the same root problem: the client messaged, nobody replied fast enough, and they went somewhere else.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CASES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`relative bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group`}
              >
                {/* Gradient accent top */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${c.color.replace("/10", "").replace("/5", "").replace("to-", "")} from-${c.iconBg.split("-")[1]}-400 to-${c.iconBg.split("-")[1]}-200`} />

                <div className="p-7">
                  {/* Industry label */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-1">{c.industry}</p>

                  {/* Problem */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase text-rose-400 tracking-wider mb-1">The Problem</p>
                    <p className="text-sm text-stone-600 leading-relaxed">{c.problem}</p>
                  </div>

                  {/* Result */}
                  <div className="mb-5">
                    <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider mb-1">What Changed</p>
                    <p className="text-sm text-stone-700 font-medium leading-relaxed">{c.result}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                      <p className="text-base font-black text-emerald-700">{c.metric}</p>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-stone-600">{c.metricSub}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-xs text-stone-500 italic leading-relaxed mb-1">{c.quote}</p>
                    <p className="text-[10px] font-bold text-stone-400">{c.author}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
