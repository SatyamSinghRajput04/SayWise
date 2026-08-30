import React, { useState } from 'react';
import { ArrowRight, Volume2, CheckCircle2, Activity, ShieldCheck, Zap, BookOpen, Layers, Award, ChevronDown } from 'lucide-react';
import { RobotMascot } from '../common/RobotMascot.js';
import { Navbar } from '../common/Navbar.js';
import { NeptuneOrbVisualizer } from '../studio/NeptuneOrbVisualizer.js';
import { useAuth } from '../../context/AuthContext.js';

interface LandingPageProps {
  onStartFree: () => void;
  onExploreTopics: () => void;
  onOpenHistory: () => void;
  onOpenAuth?: () => void;
  onTryDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onOpenHistory,
  onOpenAuth,
  onTryDemo,
}) => {
  const { user } = useAuth();
  const isLoggedIn = !!user && user.authProvider !== 'guest';

  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingWord(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingWord(null);
      utterance.onerror = () => setPlayingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#228cd0] via-[#42a3e3] to-[#71bbeb] text-white font-sans selection:bg-white selection:text-sky-600">
      
      {/* ========================================================================= */}
      {/* SVG FILTERS & GRADIENTS DEFINITIONS (Shared Global Atmospheric Engine)   */}
      {/* ========================================================================= */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Soft Edge Diffusion Filter */}
          <filter id="cloudSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <filter id="cloudHaze" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          <filter id="cloudPuffShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0284c7" floodOpacity="0.2" />
          </filter>

          {/* Natural Volumetric Sunlit Lighting Gradients */}
          <linearGradient id="cloudGradMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="65%" stopColor="#F0F9FF" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="cloudGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="cloudGradAmbient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#CFFAFE" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================================= */}
      {/* 1. SCREEN 1: PRISTINE HERO SECTION                                        */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Atmospheric Clouds in Hero Section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          
          {/* Mid-Left Organic Billowy Cumulus Cloud (Self-Contained inside viewport) */}
          <div className="absolute top-36 left-0 sm:left-4 md:left-8 w-[460px] h-[300px] opacity-90">
            <svg viewBox="0 0 460 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudPuffShadow)">
              {/* Back ambient volume */}
              <path
                d="M70 210 C40 210 20 180 30 145 C40 110 85 105 115 115 C135 70 200 60 245 85 C285 60 350 65 380 105 C420 105 450 140 440 185 C430 220 390 230 350 220 C290 235 170 235 70 210 Z"
                fill="url(#cloudGradBack)"
                filter="url(#cloudHaze)"
              />
              {/* Core Organic Cloud */}
              <path
                d="M85 200 C50 200 35 170 48 140 C60 110 95 110 120 120 C138 80 190 70 235 95 C270 65 330 75 360 110 C395 110 425 140 415 180 C405 215 370 220 330 215 C280 225 170 225 85 200 Z"
                fill="url(#cloudGradMain)"
                filter="url(#cloudSoft)"
              />
              {/* Top Sunlit Highlights */}
              <path
                d="M125 118 C145 82 195 72 235 95 C255 80 285 72 315 78 C300 100 255 110 220 105 C180 100 145 110 125 118 Z"
                fill="#FFFFFF"
                fillOpacity="0.9"
              />
            </svg>
          </div>

          {/* Right Volumetric Cloud Bank (Behind Mascot) */}
          <div className="absolute top-20 right-0 sm:right-4 md:right-8 w-[560px] h-[380px] opacity-95">
            <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudPuffShadow)">
              {/* Back Soft Haze */}
              <path
                d="M95 280 C45 280 30 220 65 170 C100 115 175 115 210 140 C235 80 330 65 390 105 C445 70 520 85 540 155 C565 220 520 290 450 300 Z"
                fill="url(#cloudGradBack)"
                filter="url(#cloudHaze)"
              />
              {/* Foreground Cloud Body */}
              <path
                d="M110 270 C60 270 45 215 80 170 C110 125 175 130 205 150 C230 95 320 75 375 115 C425 85 495 100 515 160 C535 220 495 280 430 285 C360 295 210 295 110 270 Z"
                fill="url(#cloudGradMain)"
                filter="url(#cloudSoft)"
              />
              {/* Sunlit Highlights */}
              <path
                d="M210 145 C235 98 315 80 370 115 C350 130 305 120 270 115 C235 110 215 128 210 145 Z"
                fill="#FFFFFF"
                fillOpacity="0.95"
              />
            </svg>
          </div>

          {/* Bottom Continuous Billowing Cloud Horizon Floor */}
          <div className="absolute -bottom-4 left-0 right-0 h-[220px] opacity-95">
            <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              {/* Back Rolling Layer */}
              <path
                d="M0 100 C110 65 200 110 300 75 C400 40 510 95 620 60 C730 25 840 80 960 50 C1080 20 1190 70 1300 40 C1380 20 1420 50 1440 65 V220 H0 Z"
                fill="url(#cloudGradBack)"
                filter="url(#cloudSoft)"
              />
              {/* Mid Billowy Clouds */}
              <path
                d="M0 130 C95 100 180 140 280 105 C380 70 480 120 590 90 C700 58 800 108 910 75 C1020 45 1130 95 1240 65 C1330 45 1400 75 1440 85 V220 H0 Z"
                fill="url(#cloudGradMain)"
              />
              {/* Front Crisp White Rolling Horizon */}
              <path
                d="M0 160 C110 135 210 170 320 140 C430 110 530 155 650 125 C770 95 870 138 990 110 C1110 80 1210 125 1330 105 C1400 90 1420 108 1440 118 V220 H0 Z"
                fill="#FFFFFF"
                fillOpacity="0.98"
              />
            </svg>
          </div>
        </div>

        {/* Top Unified Navbar */}
        <Navbar
          onNavigateHome={() => {}}
          onNavigateDashboard={onStartFree}
          onOpenHistory={onOpenHistory}
          onOpenAuth={onOpenAuth}
          currentScreen="LANDING"
        />

        {/* Hero Content Grid */}
        <div className="relative z-10 flex-1 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-12 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            {/* Left Text Column */}
            <div className="lg:col-span-8 text-left space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[78px] font-bold text-white tracking-tight leading-[1.04] font-display drop-shadow-md">
                Speak any language<br />
                <span className="font-extrabold">10× faster with AI</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-xl font-normal leading-relaxed drop-shadow">
                SayWise uses advanced conversational AI to evaluate your spoken English with instant grammar feedback, CEFR band scoring, and fluency metrics.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartFree}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-950 font-bold text-sm sm:text-base transition-all shadow-xl shadow-sky-950/20 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLoggedIn ? 'Go to Dashboard' : 'Start learning for free'}</span>
                  <ArrowRight className="w-4 h-4 text-sky-700" />
                </button>

                {!isLoggedIn && (
                  <button
                    onClick={onTryDemo || onStartFree}
                    className="px-6 py-3.5 rounded-2xl bg-sky-400/35 hover:bg-sky-400/50 backdrop-blur-md border border-white/80 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-sky-950/15 active:scale-95 flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] cursor-pointer"
                  >
                    <span>⚡</span>
                    <span className="text-white font-black tracking-wide">Try 1 Free Demo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Floating Mascot */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="relative">
                <RobotMascot size="lg" speechText="Hello Buddy!" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex justify-center pb-3">
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-1 text-white/90 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-widest drop-shadow">Learn More About SayWise</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform drop-shadow" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SCREEN 2: "ABOUT SAYWISE" — COMPLETE ORGANIC CLOUD ATMOSPHERE           */}
      {/* ========================================================================= */}
      <section id="about" className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pt-24 pb-24 sm:pt-32 sm:pb-36 max-w-7xl mx-auto space-y-16">
        
        {/* Full-Width Atmospheric Background Cloud Formations (Never cut off) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
          
          {/* Cloud 1: Upper Left Complete Fluffy Formation */}
          <div className="absolute top-6 left-2 sm:left-10 md:left-16 w-[380px] h-[240px] opacity-75">
            <svg viewBox="0 0 380 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudSoft)">
              <path
                d="M60 170 C30 170 20 130 45 105 C65 80 110 85 130 100 C145 65 195 55 230 80 C260 55 310 65 330 95 C360 95 375 125 365 155 C355 185 325 190 290 185 C240 195 145 195 60 170 Z"
                fill="url(#cloudGradMain)"
              />
            </svg>
          </div>

          {/* Cloud 2: Upper Right Complete Fluffy Formation */}
          <div className="absolute top-12 right-2 sm:right-10 md:right-16 w-[400px] h-[260px] opacity-75">
            <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudSoft)">
              <path
                d="M70 185 C35 185 25 140 55 110 C80 85 130 90 155 105 C175 70 230 60 270 85 C300 60 355 70 375 100 C405 100 420 135 410 165 C395 195 360 200 325 195 C265 205 160 205 70 185 Z"
                fill="url(#cloudGradMain)"
              />
            </svg>
          </div>

          {/* Cloud 3: Mid-Bento Center Ambient Drift (Floating behind Bento Cards) */}
          <div className="absolute top-[420px] left-1/2 -translate-x-1/2 w-[720px] h-[360px] opacity-45">
            <svg viewBox="0 0 720 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudHaze)">
              <path
                d="M100 260 C50 260 30 200 70 150 C110 100 190 105 230 130 C260 70 360 55 430 95 C490 60 580 75 610 140 C645 200 600 270 515 280 C420 290 230 290 100 260 Z"
                fill="url(#cloudGradAmbient)"
              />
            </svg>
          </div>

          {/* Cloud 4: Mid-Lower Left Flank Cloud */}
          <div className="absolute top-[780px] left-4 sm:left-12 w-[420px] h-[270px] opacity-70">
            <svg viewBox="0 0 420 270" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudSoft)">
              <path
                d="M75 195 C40 195 28 150 60 120 C90 90 145 95 170 115 C195 75 250 65 295 95 C330 65 385 75 405 110 C435 110 450 145 440 180 C425 210 390 215 350 210 C290 220 170 220 75 195 Z"
                fill="url(#cloudGradMain)"
              />
            </svg>
          </div>

          {/* Cloud 5: Mid-Lower Right Flank Cloud */}
          <div className="absolute top-[880px] right-4 sm:right-12 w-[440px] h-[280px] opacity-70">
            <svg viewBox="0 0 440 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" filter="url(#cloudSoft)">
              <path
                d="M80 200 C45 200 30 155 65 125 C95 95 150 100 175 120 C200 80 260 70 305 100 C340 70 400 80 425 115 C455 115 470 150 460 185 C445 215 410 220 370 215 C305 225 180 225 80 200 Z"
                fill="url(#cloudGradMain)"
              />
            </svg>
          </div>

          {/* Cloud 6: Bottom Rolling Horizon above Footer */}
          <div className="absolute -bottom-8 left-0 right-0 h-[280px] opacity-95">
            <svg viewBox="0 0 1440 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0 140 C120 95 220 150 330 110 C440 70 550 130 670 95 C790 60 900 120 1020 85 C1140 50 1250 105 1360 80 C1410 65 1430 85 1440 95 V280 H0 Z"
                fill="url(#cloudGradMain)"
                filter="url(#cloudSoft)"
              />
              <path
                d="M0 190 C130 160 230 200 350 170 C470 140 580 185 710 155 C840 125 950 170 1070 140 C1190 110 1290 155 1390 135 C1420 125 1435 140 1440 145 V280 H0 Z"
                fill="#FFFFFF"
                fillOpacity="0.98"
              />
            </svg>
          </div>
        </div>

        {/* Section Header (High Contrast Sky Pocket) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-xl border border-white/50 text-xs font-black uppercase tracking-widest text-white shadow-sm">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>About SayWise</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display drop-shadow-lg">
            Speak with Confidence.<br />
            Evaluated with Cambridge Precision.
          </h2>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium drop-shadow max-w-2xl mx-auto">
            Human tutors are costly and text grammar tools ignore spoken discourse. SayWise listens to your speech in real time, pinpoints syntactic errors, suggests CEFR C1/C2 upgrades, and guides your fluency with sub-second feedback.
          </p>
        </div>

        {/* 4-Pillar Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
          
          {/* Card 1: 4-Layer Spoken Grammar Engine */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 text-slate-900 space-y-5 transition-all hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider font-mono">
                Layer 1–4 Scanner
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Pinpointed Spoken Grammar Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Evaluates natural spoken syntax, identifying preposition mismatches, tense slips, and unidiomatic phrasing with clear linguistic corrections.
              </p>
            </div>

            {/* Micro-UI Preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700">Identified Spoken Syntax Fix</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">Major</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-rose-500 uppercase">Spoken:</span>
                  <span className="line-through text-rose-700 font-semibold">"I have full strong in AI engineering."</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Correct:</span>
                  <span className="font-bold text-emerald-700">"I have a strong background in AI engineering."</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                ✓ Corrects unidiomatic phrasing and clarifies grammatical noun structures.
              </p>
            </div>
          </div>

          {/* Card 2: CEFR Lexical Resource (A1 -> C2) */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 text-slate-900 space-y-5 transition-all hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase tracking-wider font-mono">
                CEFR A1–C2 Ladder
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                CEFR Vocabulary & Lexical Upgrades
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Transforms everyday spoken phrases into polished academic and professional vocabulary tailored for IELTS 8.0+ and TOEFL benchmarks.
              </p>
            </div>

            {/* Micro-UI Preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700">Lexical Resource Upgrade</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black font-mono">C1 Level</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold line-through">"important"</span>
                  <span className="text-slate-400 mx-2">→</span>
                  <span className="text-sky-800 font-bold text-sm">"crucial"</span>
                </div>
                <button
                  onClick={() => speakText('crucial')}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    playingWord === 'crucial' ? 'bg-sky-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-sky-100 text-slate-600'
                  }`}
                  title="Hear Pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                ✓ Elevates critical significance in spoken academic discourse.
              </p>
            </div>
          </div>

          {/* Card 3: Acoustic Fluency & Cadence Radar */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 text-slate-900 space-y-5 transition-all hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider font-mono">
                Speech Cadence VAD
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Fluency, WPM & Hesitation Detection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Measures Words Per Minute (WPM), speech cadence, and flags phonetic hesitations ("um", "uh") to ensure fluid, natural rhythm.
              </p>
            </div>

            {/* Micro-UI Preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700">Live Speaking Cadence</span>
                <span className="font-mono font-black text-slate-900">135 WPM</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full w-[70%]" />
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Zero filler sounds detected. Balanced rhythm and natural pauses.</span>
              </div>
            </div>
          </div>

          {/* Card 4: 3D Neptune Voice Studio */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 text-slate-900 space-y-5 transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase tracking-wider font-mono">
                  Judgment-Free AI Studio
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Private, Interactive Speaking Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Practice freely without stage fright. Speak into the Voice Studio, watch real-time word counting, and receive actionable drills.
                </p>
              </div>
            </div>

            {/* Micro-Neptune Visualizer Preview */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 border border-sky-100 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">Voice Studio</span>
                <p className="text-xs font-bold text-slate-800">"Ready when you are."</p>
                <span className="text-[10px] text-slate-500">Instant neural evaluation in &lt;2.5s</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 scale-75">
                <NeptuneOrbVisualizer isRecording={false} audioLevel={0.3} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step "How It Works" Flow */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl shadow-sky-950/15 border border-white/80 text-slate-900 space-y-8 relative z-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              How SayWise Works in 3 Steps
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Master speaking through deliberate, feedback-driven practice loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="text-base font-black text-slate-900">Choose a Prompt</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select from real IELTS, TOEFL, Job Interview, and conversational scenarios tailored for your level.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="text-base font-black text-slate-900">Speak in the Studio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record a 60–120 second spoken response with live voice activity tracking and real-time word counting.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 text-left">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="text-base font-black text-slate-900">Receive Instant Report</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get Cambridge/IELTS band scores, inline grammar error tags, and high-impact C1/C2 vocabulary drills.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-sky-950/25 space-y-6 max-w-4xl mx-auto relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight">
              Ready to Accelerate Your Speaking Fluency?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-lg mx-auto leading-relaxed">
              Join students, developers, and professionals worldwide speaking English with clarity and confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartFree}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-sky-50 text-sky-950 font-black text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{isLoggedIn ? 'Go to Dashboard' : 'Start Learning for Free'}</span>
              <ArrowRight className="w-4 h-4 text-sky-700" />
            </button>

            {!isLoggedIn && (
              <button
                onClick={onTryDemo || onStartFree}
                className="px-7 py-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-black text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Try 1 Free Demo Test</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Minimalist Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs font-semibold text-white/80 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SayWise AI. Certified CEFR & IELTS Spoken Assessment.</p>
          <div className="flex items-center gap-6 text-white/90 font-bold">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <button onClick={onStartFree} className="hover:text-white transition-colors">Practice Topics</button>
            <button onClick={onOpenAuth} className="hover:text-white transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
