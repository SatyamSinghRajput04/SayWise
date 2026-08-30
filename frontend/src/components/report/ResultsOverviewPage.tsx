import React from 'react';
import { ChevronLeft, Share2, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { EvaluationResult } from '../../types/index.js';

interface ResultsOverviewPageProps {
  evaluation: EvaluationResult;
  onBack: () => void;
  onViewDetailedFeedback: () => void;
}

export const ResultsOverviewPage: React.FC<ResultsOverviewPageProps> = ({
  evaluation,
  onBack,
  onViewDetailedFeedback,
}) => {
  const { scores, whatYouDidWell, areasToImprove } = evaluation;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
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

        <div className="absolute top-80 -left-20 w-[480px] h-80 opacity-75">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="180" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="260" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="350" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="260" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
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

      {/* 2. Top Header Navigation */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-black text-xs transition-all shadow-sm active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-display drop-shadow">
          Your Speaking Results
        </h1>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: 'SayWise Speaking Evaluation',
                  text: `I scored ${scores.overall}/100 (${scores.cefrLevel}) on SayWise!`,
                  url: window.location.href,
                })
                .catch(() => {});
            }
          }}
          className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white transition-all shadow-sm active:scale-95"
          title="Share Results"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Main Results Overview Glassmorphic Grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-sky-950/15 border border-white/80 space-y-8">
          
          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Overall Scorecard & Dimension Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Overall Scorecard Hero */}
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 rounded-3xl p-6 border border-sky-100/80 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
                      {scores.overall}
                    </span>
                    <span className="text-sm font-bold text-slate-400 font-mono">/ 100</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-600">Great job! 🎉</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase tracking-wider">
                      {scores.cefrLevel} Level
                    </span>
                  </div>
                </div>

                {/* Circular Radial Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200/80"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-600 transition-all duration-1000 ease-out"
                      strokeDasharray={`${scores.overall}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-900 font-display">
                    {scores.overall}
                  </span>
                </div>
              </div>

              {/* Dimension Breakdown Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4">
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Dimension Breakdown
                </p>

                {/* Grammar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>📖</span> Grammar & Syntax
                    </span>
                    <span className="font-mono text-slate-900">{scores.grammar}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${scores.grammar}%` }}
                    />
                  </div>
                </div>

                {/* Vocabulary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>📚</span> Lexical Resource
                    </span>
                    <span className="font-mono text-slate-900">{scores.vocabulary}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${scores.vocabulary}%` }}
                    />
                  </div>
                </div>

                {/* Fluency */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span>🎙️</span> Fluency & Pacing
                    </span>
                    <span className="font-mono text-slate-900">{scores.fluency}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
                      style={{ width: `${scores.fluency}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pedagogical Feedback & Action Button */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* What You Did Well */}
              <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-3xl p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>What you did well</span>
                </p>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  {whatYouDidWell.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas to Improve */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-6 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Areas to improve</span>
                </p>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  {areasToImprove.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-amber-600 font-bold mt-0.5">💡</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={onViewDetailedFeedback}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>View Detailed Linguistic Feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
