import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const navLinks = [
    { href: "#features", label: t('nav.features') },
    { href: "#how-it-works", label: t('nav.howItWorks') },
    { href: "#solutions", label: t('nav.useCases') },
    { href: "#pricing", label: t('nav.pricing') },
    { href: "#faq", label: t('nav.faq') },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-5 py-4"
    >
      {/* Pill container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between rounded-full px-5 h-14 bg-white/15 backdrop-blur-2xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 shrink-0"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Logo size={40} theme="light" showText={false} />
        </motion.div>

        {/* Desktop nav links — centred */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-stone-600 hover:text-emerald-600 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 font-semibold rounded-full px-3 transition-all flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'AR' : 'EN'}</span>
          </Button>

          <div className="w-px h-4 bg-stone-200/50 mx-1"></div>

          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-600 hover:text-stone-900 hover:bg-white/40 font-semibold rounded-full px-4 transition-all duration-200"
            >
              {t('nav.login')}
            </Button>
          </Link>
          <Link to="/signup">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full px-5 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                {t('nav.bookDemo')}
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-stone-700 p-1.5 rounded-full hover:bg-white/40 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — glass pill dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-7xl mx-auto mt-2 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden"
            style={{ WebkitBackdropFilter: "blur(24px)" }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-stone-700 hover:text-emerald-600 transition-colors py-2.5 px-4 rounded-2xl hover:bg-white/60"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-stone-200/40">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLanguage(language === 'en' ? 'ar' : 'en');
                    setIsOpen(false);
                  }}
                  className="w-full justify-center text-stone-600 hover:bg-stone-50 font-semibold rounded-2xl flex items-center gap-2 border-stone-200"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'العربية' : 'English'}
                </Button>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-stone-600 hover:bg-white/60 font-semibold rounded-2xl">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25">
                    {t('nav.bookDemo')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
