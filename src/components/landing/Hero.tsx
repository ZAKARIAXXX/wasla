import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const trustBadges = t('hero.badges') as unknown as string[];

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-stone-50">
      {/* Radial gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(16,185,129,0.08),_transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,_rgba(16,185,129,0.05),_transparent)]" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('hero.eyebrow')}
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 text-stone-900 leading-[1.15] tracking-tight">
              {t('hero.titlePart1')}
              <span className="text-emerald-600 block sm:inline">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-xl text-stone-500 mb-8 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Business type badges */}
            <div className="flex flex-wrap gap-2 mb-10">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-100 shadow-sm text-xs font-semibold text-stone-500"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={() => navigate("/signup")}
                size="lg"
                className="px-8 py-6 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-600/35 flex items-center gap-2"
              >
                {t('hero.bookDemo')}
                <ArrowIcon className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-bold border-2 border-stone-200 hover:border-emerald-300 bg-white hover:bg-stone-50 text-stone-900 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5 text-emerald-500" />
                {t('hero.seeHow')}
              </Button>
            </div>

            {/* Urgency line */}
            <p className="text-sm font-medium text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
              {t('hero.ctaTagline')}
            </p>
          </motion.div>

          {/* Right Column – Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="relative w-full aspect-square lg:aspect-auto lg:h-[580px]"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-75 translate-y-12" />

            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col">
              {/* Browser chrome */}
              <div className="h-11 border-b border-stone-100 bg-stone-50/80 flex items-center px-4 gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="flex-1 mx-4">
                  <div className="h-5 bg-stone-100 rounded-md w-48 mx-auto" />
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden bg-stone-50/40 gap-0">
                {/* Sidebar */}
                <div className="hidden sm:flex flex-col w-52 bg-white border-r border-stone-100 p-4 gap-4 shrink-0">
                  <div className="h-7 w-28 bg-stone-100 rounded-lg mb-2" />
                  <div className="space-y-1">
                    {[
                      { label: "Inbox", active: true },
                      { label: "Leads", active: false },
                      { label: "Follow-ups", active: false },
                      { label: "Pipeline", active: false },
                      { label: "AI Assistant", active: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`h-8 w-full rounded-lg px-3 flex items-center text-xs font-semibold ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-stone-400 hover:bg-stone-50"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "New Today", value: "24", color: "text-stone-800", badge: "3 urgent" },
                      { label: "Follow-ups", value: "7", color: "text-amber-600", badge: "2 due" },
                      { label: "Closed", value: "12", color: "text-emerald-600", badge: "+5 today" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-stone-100 p-3 shadow-sm relative"
                      >
                        <p className="text-[10px] text-stone-400 mb-0.5">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                        <span className="absolute top-2 right-2 text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          {stat.badge}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Conversation list */}
                  <div className="flex-1 bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-2.5 border-b border-stone-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">Active Conversations</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-medium">Follow-up due</span>
                        <span className="text-[10px] text-stone-400">5 unread</span>
                      </div>
                    </div>
                    <div className="flex-1 divide-y divide-stone-50 overflow-hidden">
                      {[
                        { name: "Sara M.", msg: "Is the size 38 still available?", time: "2m", unread: true, status: "new-order" },
                        { name: "Karim B.", msg: "When will my order arrive?", time: "15m", unread: true, status: "preparing" },
                        { name: "Fatima R.", msg: "Thank you! Got it ✓", time: "1h", unread: false, status: "delivered" },
                        { name: "Adam T.", msg: "Can I book an appointment?", time: "2h", unread: false, status: "new-order" },
                      ].map((conv) => (
                        <div
                          key={conv.name}
                          className="px-4 py-2.5 flex items-start gap-3 hover:bg-stone-50/80 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                            {conv.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-stone-800">{conv.name}</span>
                              <span className="text-[10px] text-stone-400">{conv.time}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 truncate">{conv.msg}</p>
                          </div>
                          {conv.unread && (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          )}
                          {/* Mini status indicator */}
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full shrink-0 mt-1 ${
                            conv.status === 'new-order' ? 'bg-rose-100 text-rose-600' :
                            conv.status === 'preparing' ? 'bg-amber-100 text-amber-600' :
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {conv.status === 'new-order' ? 'New' : conv.status === 'preparing' ? 'Prep' : 'Done'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom row - AI + Automation */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* AI badge */}
                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm px-3 py-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-semibold text-emerald-700">AI Active</span>
                    </div>
                    {/* Automation event */}
                    <div className="bg-stone-50 rounded-xl border border-stone-100 shadow-sm px-3 py-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-[10px] font-medium text-stone-600">Auto-follow up sent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
