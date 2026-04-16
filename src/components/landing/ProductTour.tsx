import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Zap, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProductTour = () => {
  const { t } = useLanguage();
  const stepItems = t('productTour.steps') as unknown as { title: string, desc: string }[];
  
  const iconMap = [MessageSquare, BarChart2, Zap, TrendingUp];
  return (
    <section id="how-it-works" className="py-28 bg-stone-50 overflow-hidden">
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
            {t('productTour.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-4 text-stone-900 tracking-tight"
          >
            {t('productTour.title')}
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line on desktop */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent origin-left" 
          />

          {stepItems.map((step, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-16 h-16 rounded-2xl bg-white border-2 border-stone-200 group-hover:border-emerald-400 flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-100 transition-all duration-400 relative z-10"
                  >
                    <Icon className="w-7 h-7 text-stone-400 group-hover:text-emerald-500 transition-colors duration-300" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-md z-20">
                    {`0${i + 1}`}
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
