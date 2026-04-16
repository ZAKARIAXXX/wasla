import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const plans = t('pricing.plans') as unknown as { name: string, tagline: string, features: string[] }[];

  return (
    <section id="pricing" className="py-28 bg-stone-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4"
          >
            {t('pricing.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-black mb-5 text-stone-900 tracking-tight"
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-stone-500"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mb-14"
        >
          {plans.map((plan, i) => {
            const isPopular = i === 1;
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -10 }}
                className={`relative p-9 rounded-[2rem] border transition-all duration-400 ${
                  isPopular
                    ? "bg-white border-emerald-400 shadow-2xl shadow-emerald-900/10 ring-4 ring-emerald-500/10 scale-[1.03]"
                    : "bg-white border-stone-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-200/50"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-emerald-600/30 uppercase tracking-wide">
                    {t('pricing.mostPopular')}
                  </div>
                )}

                <h3 className="text-2xl font-black mb-2 text-stone-900">{plan.name}</h3>
                <p className="text-stone-500 text-sm leading-snug mb-8 min-h-[2.5rem]">{plan.tagline}</p>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-stone-600">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isPopular ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-500"
                      }`}>
                        <Check className="w-3 h-3 stroke-[3px]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate("/signup")}
                  size="lg"
                  className={`w-full h-12 text-base font-bold rounded-xl transition-all duration-300 ${
                    isPopular
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5"
                      : "border-2 border-stone-200 bg-transparent hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-700"
                  }`}
                >
                  {t('pricing.talkToUs')}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 rounded-2xl bg-white border border-stone-200 max-w-xl mx-auto"
        >
          <h4 className="text-lg font-bold text-stone-900 mb-2">{t('pricing.bottomCta.title')}</h4>
          <p className="text-stone-500 text-sm mb-5">
            {t('pricing.bottomCta.desc')}
          </p>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 font-bold"
          >
            {t('pricing.talkToUs')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
