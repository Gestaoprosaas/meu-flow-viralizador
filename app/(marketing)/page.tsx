"use client";

import React from 'react';
import HeroSection from '../../components/marketing/HeroSection';
import ProblemSection from '../../components/marketing/ProblemSection';
import HowItWorksSection from '../../components/marketing/HowItWorksSection';
import FeaturesGrid from '../../components/marketing/FeaturesGrid';
import SocialProofSection from '../../components/marketing/SocialProofSection';
import PricingSection from '../../components/marketing/PricingSection';
import FaqSection from '../../components/marketing/FaqSection';
import MarketingFooter from '../../components/marketing/MarketingFooter';

export default function MarketingPage() {
  const handleStart = () => {
    console.log("Iniciar Jornada Grátis");
  };

  const handleLogin = () => {
    console.log("Navegar para Login");
  };

  const handleSelectPlan = (plan: string) => {
    console.log("Plano selecionado:", plan);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] selection:bg-[#FE2C55] selection:text-white">
      {/* 100vh Fullscreen Hero Section */}
      <HeroSection onStart={handleStart} onLogin={handleLogin} />

      {/* The Problem Section */}
      <ProblemSection />

      {/* Storytelling mechanics */}
      <HowItWorksSection />

      {/* Technical features grid */}
      <FeaturesGrid />

      {/* Metric tally and quotes */}
      <SocialProofSection />

      {/* Pricing options */}
      <PricingSection onSelectPlan={handleSelectPlan} onSelectFree={handleStart} />

      {/* Support and QA items */}
      <FaqSection />

      {/* Multi-tier footer */}
      <MarketingFooter onStart={handleStart} />
    </main>
  );
}
