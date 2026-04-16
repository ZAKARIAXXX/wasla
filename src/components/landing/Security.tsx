import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Security = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-stone-900">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="w-7 h-7 text-emerald-400" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            {t('security.title')}
          </h2>
          <p className="text-lg text-stone-400 leading-relaxed max-w-2xl mx-auto mb-10">
            {t('security.desc')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/signup")}
              size="lg"
              className="px-9 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('security.bookDemo')}
              <ArrowRight className="ml-2 h-4 w-4 rtl:-scale-x-100 rtl:ml-0 rtl:mr-2" />
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              size="lg"
              variant="outline"
              className="px-9 py-6 text-base font-bold border-2 border-stone-700 hover:border-stone-500 bg-transparent hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl transition-all duration-300"
            >
              {t('security.talkToUs')}
            </Button>
          </div>

          {/* Bottom tagline */}
          <p className="text-stone-500 text-sm mt-10">
            {t('security.tagline')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
