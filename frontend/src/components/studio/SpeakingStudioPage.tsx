import React, { useState, useRef } from 'react';
import { ChevronLeft, Lightbulb, Square, AlertCircle, Sparkles, Mic, Type, RefreshCw } from 'lucide-react';
import { Topic } from '../../types/index.js';
import { AudioRecordingService } from '../../services/audioService.js';
import { NeptuneOrbVisualizer } from './NeptuneOrbVisualizer.js';

const PROMPT_BANKS: Record<string, string[]> = {
  'Travel': [
    'Describe a memorable journey you took or a place you would love to visit. Explain why it was significant to you.',
    'Talk about an unexpected adventure or cultural surprise you experienced while traveling away from home.',
    'If you could live in any city in the world for one full year, where would you go, what local traditions would you explore, and why?',
    'Describe your ideal vacation: would you prefer exploring a bustling historic metropolis or relaxing in isolated natural landscapes? Give reasons.',
    'Discuss a local dish or culinary experience from a trip that left a lasting impression on your taste and memory.'
  ],
  'Education': [
    'Discuss an important skill or academic subject you learned. How has it influenced your personal or professional life?',
    'Talk about a mentor, teacher, or book that fundamentally transformed the way you approach problem-solving and critical thinking.',
    'Describe a time you struggled to learn a complex concept (such as programming, math, or a language) and how you persevered through frustration.',
    'If you could instantly download and master any complex domain or art form overnight, what would you choose and how would you apply it?',
    'Do you believe self-directed online learning will eventually replace traditional university degrees? Defend your perspective.'
  ],
  'Technology': [
    'How do you think artificial intelligence and automation will reshape workplace dynamics and daily life over the next decade?',
    'Discuss the ethical dilemmas of autonomous robots and smart AI assistants operating inside our private homes.',
    'Would you ever participate in a mission to colonize Mars or travel to orbit if commercial spaceflight became affordable? Why or why not?',
    'What is one science fiction technology or invention you wish existed today, and how would it solve a major global problem?',
    'How has social media altered human relationships and attention spans, and what boundaries should we set for our digital well-being?'
  ],
  'Work & Career': [
    'Talk about your ideal career or dream job. What responsibilities would it entail, and why is it appealing to you?',
    'If you were to launch your own tech startup tomorrow, what core problem would you tackle and what culture would you build for your team?',
    'Describe the single most vital quality of an inspiring leader, and provide a real-world or historical example.',
    'What does healthy work-life balance mean to you, and how do you prioritize between high career ambitions and personal health?',
    'Describe an ideal project team: would you prefer working with specialists who do one thing perfectly, or versatile generalists? Explain.'
  ],
  'Random Topic': [
    'Talk about a movie or television series that had a deep emotional impact on you. What made the storytelling memorable?',
    'Describe an iconic sports match, tournament, or comeback victory that inspired you with its display of teamwork and grit.',
    'If you could spend 24 hours inside the fictional world of any movie, video game, or novel, which universe would you choose and what would you do?',
    'Describe a time you faced intense stage fright or nervousness speaking before a crowd, and how you handled the adrenaline.',
    'What is a song, musical genre, or soundtrack that motivates you to focus and conquer challenging goals? Explain why it resonates with you.'
  ],
};

interface SpeakingStudioPageProps {
  topic: Topic;
  onBack: () => void;
  onSubmitRecording: (audioBlob: Blob | null, transcriptText?: string, durationSec?: number, topicPrompt?: string) => void;
}

export const SpeakingStudioPage: React.FC<SpeakingStudioPageProps> = ({
  topic,
  onBack,
  onSubmitRecording,
}) => {
  // Built-in fallback guarantee so shuffle is ALWAYS available with 5+ prompts
  const categoryBank = PROMPT_BANKS[topic.category] || PROMPT_BANKS['Random Topic'];
  const allPrompts = (topic.prompts && topic.prompts.length > 1) ? topic.prompts : categoryBank;
  
  const [promptIndex, setPromptIndex] = useState(0);
  const currentPrompt = allPrompts[promptIndex % allPrompts.length];

  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveWordCount, setLiveWordCount] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [useTextMode, setUseTextMode] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioServiceRef = useRef<AudioRecordingService | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const handleStartRecording = async () => {
    setWarningMessage(null);
    setLiveTranscript('');
    setLiveWordCount(0);

    try {
      const service = new AudioRecordingService();
      audioServiceRef.current = service;
      await service.startRecording(
        (level) => setAudioLevel(level),
        (transcript, count) => {
          setLiveTranscript(transcript);
          setLiveWordCount(count);
        }
      );

      setIsRecording(true);
      setSecondsElapsed(0);

      timerIntervalRef.current = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Recording initialization error:', err);
      setWarningMessage(
        err.message || 'Microphone access denied. Please allow microphone permissions or type your response manually below.'
      );
      setUseTextMode(true);
    }
  };

  const handleStopRecording = async () => {
    if (!audioServiceRef.current) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRecording(false);
    setIsTransitioning(true);

    try {
      const result = await audioServiceRef.current.stopRecording();
      const finalTranscript = (liveTranscript || result.liveTranscript || '').trim();
      const finalDuration = secondsElapsed || 15;

      const words = finalTranscript.split(/\s+/).filter(Boolean);
      if (words.length < 3 && !result.audioBlob) {
        setIsTransitioning(false);
        setWarningMessage('No speech was detected. Please speak clearly into your microphone.');
        return;
      }

      setTimeout(() => {
        onSubmitRecording(result.audioBlob, finalTranscript, finalDuration, currentPrompt);
      }, 400);
    } catch (err: any) {
      setIsTransitioning(false);
      console.error('Stop recording error:', err);
      setWarningMessage('Error processing audio. Please try again.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTranscript.trim()) return;

    const words = manualTranscript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      setWarningMessage('Please write at least a few sentences to receive an evaluation.');
      return;
    }

    const estimatedDuration = Math.max(Math.round(words.length / 2.2), 15);
    setIsTransitioning(true);
    setTimeout(() => {
      onSubmitRecording(null, manualTranscript.trim(), estimatedDuration, currentPrompt);
    }, 400);
  };

  const handleShufflePrompt = () => {
    if (isRecording) return;
    setPromptIndex((prev) => (prev + 1) % allPrompts.length);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const minWords = topic.targetWordCount?.min || 100;
  const maxWords = topic.targetWordCount?.max || 200;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
      {/* 1. Volumetric Clouds Atmosphere */}
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
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isRecording}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-black text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Studio</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-white/90 drop-shadow">
            Voice Studio • {topic.category}
          </span>
        </div>

        <button
          onClick={() => setShowTips(!showTips)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all shadow-sm ${
            showTips
              ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
              : 'bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Tips</span>
        </button>
      </div>

      {/* 3. Main Speaking Studio Glassmorphic Canvas */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-sky-950/15 border border-white/80">
          
          {/* Warning Banner */}
          {warningMessage && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Tips Drawer */}
          {showTips && (
            <div className="mb-6 bg-amber-50/95 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2 animate-in slide-in-from-top duration-200">
              <p className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Examiner Pro Tips for "{topic.title}":</span>
              </p>
              <ul className="space-y-1 list-disc list-inside font-medium pl-1 text-slate-700">
                <li>Structure your response: Introduction → Key Reasons/Stories → Conclusion.</li>
                <li>Aim for 100–200 words at a steady, natural speaking pace of 120–140 words per minute.</li>
                <li>Incorporate high-level academic adjectives and varied conjunctions.</li>
              </ul>
            </div>
          )}

          {/* Desktop 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Prompt & Speaking Target Goals */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="space-y-3">
                
                {/* Target Word Count + Shuffle Badge Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {isRecording ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-black uppercase tracking-wider animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>Speaking in progress...</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-black uppercase tracking-wider">
                      <span>🎯 Target: {minWords}–{maxWords} words</span>
                    </div>
                  )}

                  {!isRecording && (
                    <button
                      onClick={handleShufflePrompt}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-black transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
                      title="Shuffle to another challenge prompt in this category"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                      <span>Shuffle Topic ({promptIndex + 1}/{allPrompts.length})</span>
                    </button>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug font-display">
                  {topic.title}
                </h1>

                {/* Main Topic Prompt Card */}
                <div className="space-y-2">
                  <div className="text-slate-800 text-sm font-semibold leading-relaxed bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4.5 shadow-sm transition-all">
                    "{currentPrompt}"
                  </div>

                  {!isRecording && (
                    <p className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5 px-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>
                        Don't know this topic? Click <strong className="text-sky-700 font-bold">Shuffle Topic</strong> above to refresh challenges.
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Progress & Target Stats Capsule */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spoken Words</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {liveWordCount} <span className="text-xs text-slate-400 font-sans font-bold">/ 200 words</span>
                    </span>
                  </div>
                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, Math.round((liveWordCount / 200) * 100)))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Minimum: 100</span>
                    <span>Target: 100–200</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Time</p>
                    <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                      {topic.targetTimeSeconds || 90}s
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
                    <p className="text-xs font-black text-sky-700 uppercase mt-1">
                      {topic.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Rotating Neptune Planet */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-5 text-center">
              
              {/* 3D Neptune Planet Visualizer */}
              <div className="w-full flex justify-center py-2">
                <NeptuneOrbVisualizer isRecording={isRecording} audioLevel={audioLevel} />
              </div>

              {/* Timer & Speech Cadence Status */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-sm tracking-wider shadow-inner">
                  ⏱️ {formatTime(secondsElapsed)}
                </div>
                {isRecording && (
                  <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold animate-pulse">
                    Voice Active (Mic On)
                  </div>
                )}
              </div>

              {/* Action Buttons: Record / Stop / Text Fallback */}
              {!useTextMode ? (
                <div className="w-full max-w-sm space-y-3 pt-2">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={isTransitioning}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-base shadow-xl shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mic className="w-5 h-5" />
                      <span>Start Speaking</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      disabled={isTransitioning}
                      className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-xl shadow-rose-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Finish & Evaluate ({liveWordCount} words)</span>
                    </button>
                  )}

                  {!isRecording && (
                    <button
                      onClick={() => setUseTextMode(true)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto transition-colors pt-1 cursor-pointer"
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>Prefer typing instead of speaking?</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Manual Text Submission Mode */
                <form onSubmit={handleManualSubmit} className="w-full max-w-md space-y-3 pt-2 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                      <span>Type your 100–200 word response:</span>
                      <span className="font-mono text-slate-500">
                        {manualTranscript.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </label>
                    <textarea
                      value={manualTranscript}
                      onChange={(e) => setManualTranscript(e.target.value)}
                      placeholder="Type your response here..."
                      rows={5}
                      className="w-full rounded-2xl border border-slate-300 p-3.5 text-xs text-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none resize-none font-medium leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isTransitioning || !manualTranscript.trim()}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      Submit for AI Evaluation
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseTextMode(false)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                    >
                      Switch to Mic
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
