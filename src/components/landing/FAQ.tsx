import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const FAQ = () => {
  const { t } = useLanguage();
  const faqs = t('faq.items') as unknown as { q: string, a: string }[];

  return (
    <section id="faq" className="py-28 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">{t('faq.eyebrow')}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
            {t('faq.title')}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <AccordionItem value={`item-${i}`} className="border-stone-200">
                  <AccordionTrigger className="text-left rtl:text-right text-base font-semibold text-stone-800 hover:text-emerald-600 transition-colors py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-500 text-sm leading-relaxed pb-5 lg:pr-12 rtl:lg:pr-0 rtl:lg:pl-12">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
