import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Integrations = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const benefits = t('integrations.benefits') as unknown as string[];
  const comparisonRows = t('integrations.comparisonRows') as unknown as { old: string, newWay: string }[];

  return (
    <section className="py-28 bg-stone-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-5">
              {t('integrations.eyebrow')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-6 leading-tight">
              {t('integrations.title')}
            </h2>
            <p className="text-lg text-stone-500 leading-relaxed mb-8">
              {t('integrations.subtitle')}
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 transition-all"
            >
              {t('integrations.bookDemo')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 transition-colors duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-stone-700 leading-snug">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why not stay manual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-stone-200 rounded-3xl p-10 lg:p-14"
        >
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">
              {t('integrations.manualEyebrow')}
            </p>
            <h3 className="text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mb-4">
              {t('integrations.manualTitle')}
            </h3>
            <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
              {t('integrations.manualDesc')}
            </p>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left rtl:text-right font-bold text-rose-500 pb-4 pr-8 rtl:pr-0 rtl:pl-8 w-1/2">
                    {t('integrations.tableHeaders.old')}
                  </th>
                  <th className="text-left rtl:text-right font-bold text-emerald-600 pb-4 w-1/2">
                    {t('integrations.tableHeaders.newWay')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {comparisonRows.map((row, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <td className="py-3 pr-8 rtl:pr-0 rtl:pl-8 text-stone-500 line-through decoration-rose-200">{row.old}</td>
                    <td className="py-3 text-stone-800 font-medium flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      {row.newWay}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
