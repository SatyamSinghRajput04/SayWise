import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Sparkles, Clock, MessageSquare, Home, UserPlus, LogIn, ChevronRight } from 'lucide-react';
import { User } from '../../types/index.js';

interface PracticeCompletePageProps {
  user: User | null;
  onPracticeAgain: () => void;
  onChooseNewTopic: () => void;
  onViewHistory: () => void;
  onBackToHome: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const PracticeCompletePage: React.FC<PracticeCompletePageProps> = ({
  user,
  onPracticeAgain,
  onChooseNewTopic,
  onViewHistory,
  onBackToHome,
  onOpenAuth,
}) => {
  const isGuest = !user || user.authProvider === 'guest';
  const cleanName = user?.displayName?.replace(/^buddy,?\s*/i, '').trim().split(/\s+/)[0] || 'Friend';

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#38bdf8', '#8b5cf6', '#10b981', '#f59e0b'],
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
      {/* 1. Volumetric Clouds Background */}
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

      {/* 2. Main Practice Complete Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-sky-950/15 border border-white/80 space-y-8 text-center">
          
          {/* Celebration Emoji & Heading */}
          <div className="space-y-3">
            <div className="text-6xl sm:text-7xl animate-bounce duration-1000 select-none">
              🎉
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Great job, {isGuest ? 'Speaker' : cleanName}!
            </h1>

            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
              {isGuest
                ? 'You completed your speaking practice session! Check your scores and save your progress.'
                : 'You completed your speaking practice. Your progress and stats have been updated!'}
            </p>
          </div>

          {/* If Guest/Demo: High-Converting Save Score Card */}
          {isGuest && (
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50/70 border border-sky-100 rounded-3xl p-6 shadow-sm space-y-4 max-w-xl mx-auto text-left">
              <div className="space-y-1.5 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Save Your Speaking Progress</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Create a Free Account
                </h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Save your detailed evaluation report, track your daily CEFR speaking streak, and unlock unlimited practice tests!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => onOpenAuth?.('signup')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account →</span>
                </button>

                <button
                  onClick={() => onOpenAuth?.('signin')}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Already have an account? Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* Next Steps Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {/* Practice Again */}
            <div
              onClick={onPracticeAgain}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Practice Again</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Try the same topic</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>

            {/* Choose New Topic */}
            <div
              onClick={onChooseNewTopic}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-sky-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Choose New Topic</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Pick a different prompt</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
            </div>

            {/* View History */}
            <div
              onClick={onViewHistory}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-emerald-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">View History</h3>
                  <p className="text-[11px] text-slate-400 font-medium">See your past attempts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>

            {/* Chat with AI */}
            <div
              onClick={onChooseNewTopic}
              className="bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-amber-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">Chat with AI</h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[9px] font-black uppercase">
                      New
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Discuss your response</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="max-w-md mx-auto pt-2">
            <button
              onClick={onBackToHome}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
