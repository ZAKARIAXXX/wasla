import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Stats = () => {
  const { t } = useLanguage();
  const problems = t('stats.problems') as unknown as string[];
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
              {t('stats.eyebrow')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 leading-tight tracking-tight mb-6">
              {t('stats.titlePart1')}
              <span className="text-rose-500 block">{t('stats.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed mb-8">
              {t('stats.description')}
            </p>
          </motion.div>

          {/* Right – problem pills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {problems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-100 hover:shadow-md hover:shadow-rose-500/5 transition-shadow"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-stone-700 font-semibold">{problem}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
