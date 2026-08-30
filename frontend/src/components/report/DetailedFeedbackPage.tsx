import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, ArrowRight, Play, Square, CheckCircle2, Activity } from 'lucide-react';
import { EvaluationResult, GrammarFeedbackItem } from '../../types/index.js';

interface DetailedFeedbackPageProps {
  evaluation: EvaluationResult;
  onBack: () => void;
  onFinishReview: () => void;
}

export const DetailedFeedbackPage: React.FC<DetailedFeedbackPageProps> = ({
  evaluation,
  onBack,
  onFinishReview,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  const handlePlayTranscript = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(evaluation.transcript);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const errorsList = evaluation.grammarFeedback.filter((item) => item.type !== 'style');
  const summary = evaluation.grammarSummary;

  const getSeverityBadge = (severity?: GrammarFeedbackItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider">
            Critical
          </span>
        );
      case 'major':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
            Major
          </span>
        );
      case 'minor':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase tracking-wider">
            Minor
          </span>
        );
    }
  };

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
          <span>Back to Summary</span>
        </button>

        <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight font-display drop-shadow">
          Detailed Linguistic Feedback
        </h1>

        <div className="w-10" />
      </div>

      {/* 3. Main Glassmorphic Detailed Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-sky-950/15 border border-white/80 space-y-6">
          
          {/* A. Top: Spoken Transcript Card (Full Width / Middle) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Your Spoken Transcript ({evaluation.wordCount} words)
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {evaluation.durationSeconds}s
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic font-normal pr-20">
              "{evaluation.transcript}"
            </p>

            {/* Interactive Play / Stop Audio Toggle Button */}
            <button
              onClick={handlePlayTranscript}
              className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition-all shadow-sm ${
                isPlayingAudio
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-white text-sky-600 hover:bg-sky-50 border border-sky-200 hover:scale-105'
              }`}
              title={isPlayingAudio ? 'Stop Audio' : 'Play Transcript Audio'}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-black uppercase">Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span className="text-[10px] font-black uppercase">Play</span>
                </>
              )}
            </button>
          </div>

          {/* B. Middle Row: 2-Column Grid (Left: Grammar Evaluation | Right: Vocabulary Upgrades) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: 4-Layer Spoken Grammar Evaluation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-purple-50/80 border border-purple-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📖</span>
                    <h2 className="text-xs font-black uppercase tracking-wider text-purple-950">
                      Grammar Evaluation
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900 text-xs font-black font-mono">
                    Score: {evaluation.scores.grammar}/100
                  </span>
                </div>

                {/* Grammar Strengths */}
                {summary?.whatYouDidWell && summary.whatYouDidWell.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Grammar Strengths</span>
                    </p>
                    <div className="space-y-1 text-xs text-slate-700 font-medium pl-1">
                      {summary.whatYouDidWell.map((st: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Corrective Inline Grammar Fixes */}
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Identified Grammar Fixes ({errorsList.length})
                  </p>

                  {errorsList.length === 0 ? (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Excellent! Zero significant grammatical errors detected in your speech.</span>
                    </div>
                  ) : (
                    errorsList.map((err, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-purple-100/80 shadow-sm space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-800 capitalize">
                            {err.category || 'Grammar Rule'}
                          </span>
                          {getSeverityBadge(err.severity)}
                        </div>

                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold text-rose-500 uppercase">Spoken:</span>
                            <span className="line-through text-rose-700 font-semibold">"{err.original}"</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Correct:</span>
                            <span className="font-bold text-emerald-700">"{err.better}"</span>
                          </div>
                        </div>

                        <p className="text-slate-600 font-medium leading-relaxed text-[11px]">
                          {err.why}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: CEFR Lexical Resource & Vocabulary Upgrades */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-sky-50/80 border border-sky-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📚</span>
                    <h2 className="text-xs font-black uppercase tracking-wider text-sky-950">
                      Vocabulary Upgrades (CEFR)
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900 text-xs font-black font-mono">
                    Score: {evaluation.scores.vocabulary}/100
                  </span>
                </div>

                <div className="space-y-3">
                  {evaluation.vocabularySuggestions.length === 0 ? (
                    <div className="p-4 bg-white rounded-2xl border border-sky-100 text-slate-600 text-xs font-medium">
                      Lexical range is standard for this spoken response.
                    </div>
                  ) : (
                    evaluation.vocabularySuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Lexical Upgrade
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase font-mono">
                              {item.cefrLevel || 'C1'}
                            </span>
                            <button
                              onClick={() => speakText(item.better)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                playingWord === item.better
                                  ? 'bg-sky-600 text-white animate-pulse'
                                  : 'bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700'
                              }`}
                              title="Hear Pronunciation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Original:</span>
                            <span className="text-slate-700 font-semibold">"{item.original}"</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-bold text-sky-700 uppercase">Better:</span>
                            <span className="font-bold text-sky-800">"{item.better}"</span>
                          </div>
                        </div>

                        <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
                          <span className="font-bold text-slate-700">Why:</span> {item.why}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* C. Bottom Row: Fluency & Pacing Card (Full Width) */}
          <div className="bg-amber-50/80 border border-amber-100 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Fluency & Pacing ({evaluation.fluencyAnalysis.wordsPerMinute} WPM)
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black font-mono">
                Score: {evaluation.scores.fluency}/100
              </span>
            </div>

            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              {evaluation.fluencyAnalysis.tip || evaluation.fluencyAnalysis.pacingRating}
            </p>

            {evaluation.fluencyAnalysis.fillerWordsCount > 0 ? (
              <div className="text-[11px] font-bold text-amber-800 bg-amber-100/60 p-2.5 rounded-xl">
                ⚠️ Detected {evaluation.fluencyAnalysis.fillerWordsCount} filler words. Aim to replace "um/uh" with deliberate pausing.
              </div>
            ) : (
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/60 p-2.5 rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>No filler words detected. Clean, direct speech delivery!</span>
              </div>
            )}
          </div>

          {/* D. Bottom: Primary Action Button (Full Width) */}
          <button
            onClick={onFinishReview}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Finish Review & Save Progress</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
