import { motion } from "framer-motion";
import { Bot, Clock, RefreshCw, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Testimonials = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  
  const aiPointItems = t('testimonials.aiPoints') as unknown as string[];
  const icons = [Clock, RefreshCw, MessageSquare, Bot];
  const pointsData = (aiPointItems || []).map((text, i) => ({
    icon: icons[i % icons.length],
    text
  }));

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
              {t('testimonials.eyebrow')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-6 leading-tight">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed mb-8">
              {t('testimonials.subtitle')}
            </p>

            <div className="space-y-4">
              {pointsData.map((point, i) => (
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

          {/* Right – AI visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl border border-stone-200 shadow-xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{t('testimonials.mockup.title')}</p>
                  <p className="text-[11px] text-emerald-600 font-medium">● {t('testimonials.mockup.active')}</p>
                </div>
              </div>

              {/* Customer message */}
              <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                <div className={`bg-stone-100 text-stone-700 rounded-2xl ${isRtl ? 'rounded-tl-sm' : 'rounded-tr-sm'} px-4 py-2.5 text-sm max-w-[80%]`}>
                  {t('testimonials.mockup.customerMsg')}
                </div>
              </div>

              {/* AI thinking */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider mb-2">
                  {t('testimonials.mockup.aiGenerating')}
                </p>
                <div className={`h-2 bg-emerald-200 rounded-full w-3/4 mb-1.5 animate-pulse ${isRtl ? 'ml-auto' : ''}`} />
                <div className={`h-2 bg-emerald-100 rounded-full w-1/2 animate-pulse ${isRtl ? 'ml-auto' : ''}`} />
              </div>

              {/* AI suggested reply */}
              <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
                <div className={`bg-emerald-600 text-white rounded-2xl ${isRtl ? 'rounded-tr-sm' : 'rounded-tl-sm'} px-4 py-2.5 text-sm max-w-[85%]`}>
                  {t('testimonials.mockup.aiReply')}
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-500 hover:bg-stone-50 transition-colors">
                  {t('testimonials.mockup.editBtn')}
                </button>
                <button className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors">
                  {t('testimonials.mockup.sendBtn')}
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <div className={`absolute -bottom-4 ${isRtl ? '-left-4' : '-right-4'} bg-white border border-stone-200 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2`}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-stone-700">{t('testimonials.mockup.savedBadge')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
