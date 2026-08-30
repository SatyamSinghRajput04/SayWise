import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { NeptuneOrbVisualizer } from './NeptuneOrbVisualizer.js';

interface AnalyzingSpeechPageProps {
  onBack?: () => void;
}

export const AnalyzingSpeechPage: React.FC<AnalyzingSpeechPageProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Converting speech to text', detail: 'Groq Whisper v3' },
    { label: 'Checking 4-layer grammar rules', detail: 'Adjudicator & Syntactic Engine' },
    { label: 'Evaluating vocabulary & lexical density', detail: 'CEFR lexical analysis' },
    { label: 'Calculating multi-metric overall score', detail: 'Deterministic scoring formula' },
    { label: 'Generating tailored pedagogical report', detail: 'High-impact action plan' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 px-4 pt-6 pb-16">
      {/* 1. Volumetric Atmosphere Clouds Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-10 -right-20 w-[500px] h-80 opacity-80">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="160" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="240" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="330" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="240" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
          </svg>
        </div>

        <div className="absolute -bottom-16 left-0 right-0 h-[320px] opacity-95">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <ellipse cx="200" cy="220" rx="180" ry="80" fill="white" fillOpacity="0.8" />
            <ellipse cx="500" cy="200" rx="220" ry="90" fill="white" fillOpacity="0.85" />
            <ellipse cx="820" cy="190" rx="210" ry="90" fill="white" fillOpacity="0.9" />
            <ellipse cx="1160" cy="210" rx="230" ry="90" fill="white" fillOpacity="0.85" />
            <ellipse cx="1400" cy="230" rx="160" ry="80" fill="white" fillOpacity="0.8" />
            <rect x="0" y="240" width="1440" height="80" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
      </div>

      {/* 2. Top Header */}
      <div className="relative z-20 max-w-2xl mx-auto flex items-center justify-between mb-6">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-black text-xs transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        ) : (
          <div className="w-10" />
        )}

        <h2 className="text-xs font-black uppercase tracking-widest text-white/90 drop-shadow">
          AI Evaluation Engine
        </h2>
        <div className="w-10" />
      </div>

      {/* 3. Main Glassmorphic Card Container */}
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 space-y-6 text-center">
          
          {/* 3D Neptune Analysis Orb */}
          <div className="flex flex-col items-center justify-center">
            <NeptuneOrbVisualizer
              isRecording={false}
              audioLevel={0.4}
              isTransitioning={true}
              size="md"
            />

            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display mt-2">
              Analyzing your speech...
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Evaluating grammar precision, CEFR vocabulary distribution, and speaking fluency
            </p>
          </div>

          {/* Stepper Progress Checklist */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 text-left">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isInProgress = idx === currentStep;

              return (
                <div key={idx} className="flex items-center gap-3.5 transition-all">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                    </div>
                  ) : isInProgress ? (
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center flex-shrink-0">
                      <Circle className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm font-bold ${isCompleted ? 'text-slate-900' : isInProgress ? 'text-sky-800' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {isCompleted ? 'Completed' : isInProgress ? step.detail : 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pro Tip */}
          <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-3.5 flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sky-950">CEFR Examiner Insight</h4>
              <p className="text-xs text-sky-800/90 font-medium leading-relaxed mt-0.5">
                Our 4-layer Adjudication Engine evaluates grammar accuracy deterministically to provide verified corrections without false positives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
