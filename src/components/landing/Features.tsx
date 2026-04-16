import { Inbox, UserCircle2, Bell, GitBranch, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Features = () => {
  const { t } = useLanguage();
  const featureItems = t('features.items') as unknown as { title: string, desc: string, support: string }[];
  
  const iconMap = [Inbox, UserCircle2, Bell, GitBranch, Bot, Zap];
  const accentMap = [
    { accent: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-50 text-emerald-600" },
    { accent: "from-sky-500/10 to-sky-500/5", iconBg: "bg-sky-50 text-sky-600" },
    { accent: "from-amber-500/10 to-amber-500/5", iconBg: "bg-amber-50 text-amber-600" },
    { accent: "from-violet-500/10 to-violet-500/5", iconBg: "bg-violet-50 text-violet-600" },
    { accent: "from-rose-500/10 to-rose-500/5", iconBg: "bg-rose-50 text-rose-600" },
    { accent: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <section id="features" className="py-28 bg-stone-50">
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
            {t('features.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-5 text-stone-900 tracking-tight leading-tight"
          >
            {t('features.title')}
          </motion.h2>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feature, i) => {
            const Icon = iconMap[i];
            const { accent, iconBg } = accentMap[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative p-7 rounded-2xl bg-white border border-stone-200/70 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient tint on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-stone-900">{feature.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">{feature.desc}</p>
                  <p className="text-stone-400 text-xs leading-relaxed">{feature.support}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
