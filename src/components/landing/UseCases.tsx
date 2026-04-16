import { ShoppingCart, CalendarDays, Sparkles, Cpu, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export const UseCases = () => {
  const { t } = useLanguage();
  const useCaseItems = t('useCases.items') as unknown as { title: string, desc: string, tags: string[] }[];
  
  const stylingMap = [
    { icon: ShoppingCart, gradient: "from-emerald-500/10" },
    { icon: CalendarDays, gradient: "from-sky-500/10" },
    { icon: Sparkles, gradient: "from-rose-500/10" },
    { icon: Cpu, gradient: "from-violet-500/10" },
    { icon: Briefcase, gradient: "from-amber-500/10" },
  ];

  return (
    <section id="solutions" className="py-28 bg-white">
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
            {t('useCases.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-5 text-stone-900 tracking-tight"
          >
            {t('useCases.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-stone-500"
          >
            {t('useCases.subtitle')}
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {useCaseItems.map((useCase, i) => {
            const styling = stylingMap[i] || stylingMap[i % stylingMap.length];
            const { icon: Icon, gradient } = styling;
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative p-7 rounded-2xl bg-white border border-stone-200/70 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 overflow-hidden group w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                {/* Gradient tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="w-11 h-11 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-center mb-5 text-stone-500 group-hover:border-emerald-300 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-2">{useCase.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-5">{useCase.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
