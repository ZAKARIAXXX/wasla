import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { Features } from "@/components/landing/Features";
import { ProductTour } from "@/components/landing/ProductTour";
import { UseCases } from "@/components/landing/UseCases";
import { SocialProof } from "@/components/landing/SocialProof";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Security } from "@/components/landing/Security";
import { Footer } from "@/components/landing/Footer";

const SectionDivider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent w-full" />
);

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>Wasla — Manage Customer Conversations, Leads & Follow-ups in One Place</title>
        <meta
          name="description"
          content="Wasla helps businesses reply faster, stay organized, automate repetitive work, and turn more conversations into real sales. Built for WhatsApp-driven businesses."
        />
      </Helmet>
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">
          {/* 1 – Hero */}
          <Hero />
          <SectionDivider />

          {/* 2 – Pain First: Why manual WhatsApp is killing growth */}
          <Stats />
          <SectionDivider />

          {/* 3 – Solution: Meet Karima AI — speaks Darija */}
          <Testimonials />
          <SectionDivider />

          {/* 4 – Before / After comparison */}
          <Features />
          <SectionDivider />

          {/* 5 – How It Works */}
          <ProductTour />
          <SectionDivider />

          {/* 6 – Real Industry Cases */}
          <UseCases />
          <SectionDivider />

          {/* 7 – Social Proof / Trust Strip */}
          <SocialProof />
          <SectionDivider />

          {/* 8 – Pricing */}
          <Pricing />
          <SectionDivider />

          {/* 9 – FAQ */}
          <FAQ />

          {/* 10 – Final CTA */}
          <Security />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Landing;
