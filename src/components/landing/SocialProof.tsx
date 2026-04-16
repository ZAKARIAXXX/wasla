import { motion } from "framer-motion";
import { ShoppingBag, Stethoscope, Sparkles, Cpu, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const SocialProof = () => {
  const { t } = useLanguage();
  const badges = t('socialProof.badges') as unknown as string[];
  
  const iconMap = [ShoppingBag, Stethoscope, Sparkles, Cpu, Briefcase];
  return (
    <section className="py-16 bg-white border-y border-stone-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">
            {t('socialProof.eyebrow')}
          </p>
          <h2 className="text-2xl font-bold text-stone-900">
            {t('socialProof.title')}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="flex flex-wrap justify-center gap-4"
        >
          {badges.map((label, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 10 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all duration-300 group cursor-default"
              >
                <Icon className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-semibold text-stone-600 group-hover:text-stone-800 transition-colors">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
