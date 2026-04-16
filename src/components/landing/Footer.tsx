import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const columns = t('footer.columns') as unknown as { heading: string, links: string[] }[];

  return (
    <footer className="bg-stone-900 border-t border-stone-800 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <Logo size={32} theme="dark" />
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-bold mb-5 text-white text-sm uppercase tracking-wider">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-stone-400 text-sm hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-sm">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-emerald-400 transition-colors">{t('footer.login')}</Link>
            <Link to="/signup" className="hover:text-emerald-400 transition-colors">{t('footer.getStarted')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
